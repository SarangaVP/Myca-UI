import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import TaskItem, { Task } from "../components/TaskItem";
import EditTaskModal from "../components/EditTaskModal";
import TaskInput from "../components/TaskInput";

const Focus: React.FC = () => {
  const [todaysFocus, setTodaysFocus] = useState<Task[]>([]);
  const [todaysRituals, setTodaysRituals] = useState<Task[]>([]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [todaysRecurrings, setTodaysRecurrings] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem("AUTH_TOKEN")
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Track task being edited

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // Formats as "2025-02-25"

  const fetchFocusData = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      console.warn("AUTH_TOKEN not available, skipping fetch.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch Today's Focus
      const focusResponse = await fetch(`${BASE_URL}/getFocusList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: formattedDate,
          focused_items: [],
        }),
      });

      if (!focusResponse.ok) {
        throw new Error(`HTTP error for Today's Focus! Status: ${focusResponse.status}`);
      }
      const focusData = await focusResponse.json();

      // Fetch Today's Rituals
      const ritualsResponse = await fetch(`${BASE_URL}/getRitualItems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: formattedDate,
          ritual_list: [],
        }),
      });

      if (!ritualsResponse.ok) {
        throw new Error(`HTTP error for Today's Rituals! Status: ${ritualsResponse.status}`);
      }
      const ritualsData = await ritualsResponse.json();

      // Fetch In Progress
      const inProgressResponse = await fetch(`${BASE_URL}/getInProgressItems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: formattedDate,
          in_progress_items: [],
        }),
      });

      if (!inProgressResponse.ok) {
        throw new Error(`HTTP error for In Progress! Status: ${inProgressResponse.status}`);
      }
      const inProgressData = await inProgressResponse.json();

      // Fetch Today's Recurrings
      const recurringsResponse = await fetch(`${BASE_URL}/getRecurrenceItems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: formattedDate,
          focused_items: [],
        }),
      });

      if (!recurringsResponse.ok) {
        throw new Error(`HTTP error for Today's Recurrings! Status: ${recurringsResponse.status}`);
      }
      const recurringsData = await recurringsResponse.json();

      // Process and categorize the data
      const processTasks = (data: any): Task[] => {
        if (data.status === 200 && data.reports && data.reports.length > 0) {
          return data.reports[0].map((item: any) => ({
            id: String(item.id),
            name: item.context.name,
            isFocused: item.context.is_focused || false,
            parentId: item.context.parent_item_id || null,
            children: [], // Assuming no nested children for simplicity; adjust if needed
            context: {
              name: item.context.name,
              itype: item.context.itype || "task", // Default to "task" if not provided
              status: item.context.status || "running", // Default to "running" if not provided
            },
          }));
        }
        return [];
      };

      const focusTasks = processTasks(focusData);
      const ritualsTasks = processTasks(ritualsData);
      const inProgressTasks = processTasks(inProgressData);
      const recurringsTasks = processTasks(recurringsData);

      // Set the state for each category
      setTodaysFocus(focusTasks);
      setTodaysRituals(ritualsTasks);
      setInProgress(inProgressTasks);
      setTodaysRecurrings(recurringsTasks);

      console.log("Today's Focus:", focusTasks);
      console.log("Today's Rituals:", ritualsTasks);
      console.log("In Progress:", inProgressTasks);
      console.log("Today's Recurrings:", recurringsTasks);
    } catch (error) {
      console.error("Error fetching focus data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchFocusData();
    } else {
      const interval = setInterval(() => {
        const newToken = localStorage.getItem("AUTH_TOKEN");
        if (newToken) {
          setAuthToken(newToken);
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [authToken]);

  const displayDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Handler for updating/editing a task
  const handleUpdateTask = async (task: Task, updatedFields: Partial<Task>) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) return;

    const encodedTaskId = encodeURIComponent(task.id); // Encode the task ID
    console.log("Updating/Editing task with ID:", encodedTaskId, "Data:", updatedFields);

    try {
      const response = await fetch(`${BASE_URL}/updateItem`, { // Match EditTaskModal’s endpoint
        method: "POST", // Match EditTaskModal’s method
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: formattedDate,
          item_id: task.id,
          new_name: updatedFields.name || task.name,
          new_type: updatedFields.context?.itype || task.context?.itype || "task",
          new_status: updatedFields.context?.status || task.context?.status || "running",
          isFocused: updatedFields.isFocused !== undefined ? updatedFields.isFocused : task.isFocused,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update local state based on the category
      if (task.isFocused) {
        setTodaysFocus((prev: Task[]) =>
          prev.map((t: Task) => (t.id === task.id ? { ...t, ...updatedFields, context: { ...t.context, ...updatedFields.context } } : t))
        );
      } else {
        // Assume it’s in Rituals, In Progress, or Recurrings; refine based on your logic
        setTodaysRituals((prev: Task[]) =>
          prev.map((t: Task) => (t.id === task.id ? { ...t, ...updatedFields, context: { ...t.context, ...updatedFields.context } } : t))
        );
        setInProgress((prev: Task[]) =>
          prev.map((t: Task) => (t.id === task.id ? { ...t, ...updatedFields, context: { ...t.context, ...updatedFields.context } } : t))
        );
        setTodaysRecurrings((prev: Task[]) =>
          prev.map((t: Task) => (t.id === task.id ? { ...t, ...updatedFields, context: { ...t.context, ...updatedFields.context } } : t))
        );
      }

      // Refresh tasks to ensure consistency with the backend
      fetchFocusData();
      setEditingTask(null); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating/editing task:", error);
    }
  };

  // Refresh tasks callback for TaskItem
  const refreshTasks = () => {
    fetchFocusData();
  };

  // Callback for editing tasks (opens modal or triggers edit)
  const onEditTask = (task: Task) => {
    setEditingTask(task); // Open the edit modal with the selected task
    console.log("Editing task:", task);
  };

  return (
    <div style={{ flex: 1, padding: "20px", backgroundColor: "#f4f4f4" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>Focus</h2>
      <p style={{ fontSize: "18px", color: "#666", marginBottom: "15px" }}>{displayDate}</p>

      <TaskInput refreshTasks={refreshTasks} /> {/* Added TaskInput for consistency with Plan */}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Left Column: Today's Focus and In Progress */}
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "20px", padding: "15px" }}>
              <h3>Today's Focus <span style={{ fontSize: "12px" }}>+</span></h3>
              <p>These are your priorities for today</p>
              {todaysFocus.map((task: Task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  refreshTasks={refreshTasks}
                  onEditTask={onEditTask}
                />
              ))}
            </div>

            <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "20px", padding: "15px" }}>
              <h3>In progress</h3>
              <p>These are your currently in progress items</p>
              {inProgress.map((task: Task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  refreshTasks={refreshTasks}
                  onEditTask={onEditTask}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Today's Rituals and Today's Recurrings */}
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "20px", padding: "15px" }}>
              <h3>Today's Rituals <span style={{ fontSize: "12px" }}>🌱</span></h3>
              <p>These are the ritual tasks that you want to do today</p>
              {todaysRituals.map((task: Task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  refreshTasks={refreshTasks}
                  onEditTask={onEditTask}
                />
              ))}
            </div>

            <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "20px", padding: "15px" }}>
              <h3>Today's Recurrings</h3>
              <p>These are the recurring tasks that you want to do today</p>
              {todaysRecurrings.map((task: Task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  refreshTasks={refreshTasks}
                  onEditTask={onEditTask}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          refreshTasks={refreshTasks}
        />
      )}
    </div>
  );
};

export default Focus;