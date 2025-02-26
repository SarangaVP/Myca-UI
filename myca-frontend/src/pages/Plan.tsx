import React, { useEffect, useState } from "react";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import EditTaskModal from "../components/EditTaskModal";
import { BASE_URL } from "../config";

interface Task {
  id: string;
  name: string;
  isFocused: boolean; 
  parentId?: string;
  children?: Task[];
}

const Plan: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingTask, setEditingTask] = useState<Task | null>(null); // Track task being edited
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("AUTH_TOKEN"));


  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const fetchTasks = () => {
    const token = localStorage.getItem("AUTH_TOKEN"); // Ensure we get the latest token
    if (!token) {
      console.warn("AUTH_TOKEN not available, skipping fetch.");
      return;
    }

    setLoading(true);
    fetch(`${BASE_URL}/getItems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ date_input: formattedDate, items_list: [] }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 200 && data.reports.length > 0) {
          const rawTasks: Task[] = data.reports[0].map((item: any) => ({
            id: String(item.id),
            name: item.context.name,
            isFocused: item.context.is_focused || false, 
            parentId: item.context.parent_item_id || null,
          }));

          const taskMap = new Map<string, Task>();
          rawTasks.forEach((task) => taskMap.set(task.id, { ...task, children: [] }));

          const rootTasks: Task[] = [];
          rawTasks.forEach((task) => {
            if (task.parentId && taskMap.has(task.parentId)) {
              taskMap.get(task.parentId)!.children!.push(taskMap.get(task.id)!);
            } else {
              rootTasks.push(taskMap.get(task.id)!);
            }
          });

          setTasks(rootTasks);
        }
      })
      .catch((error) => console.error("Error fetching tasks:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authToken) {
      fetchTasks();
    } else {
      const interval = setInterval(() => {
        const newToken = localStorage.getItem("AUTH_TOKEN");
        if (newToken) {
          setAuthToken(newToken);
          clearInterval(interval);
        }
      }, 500); // Check every 500ms
      return () => clearInterval(interval);
    }
  }, [authToken]);

  useEffect(() => {
    // console.log("Tasks updated:", tasks);
  }, [tasks]);

  const displayDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ flex: 1, padding: "20px", backgroundColor: "#f4f4f4" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>Plan</h2>
      <p style={{ fontSize: "18px", color: "#666", marginBottom: "15px" }}>{displayDate}</p>

      <TaskInput refreshTasks={fetchTasks} />

      {loading ? <p>Loading tasks...</p> : <TaskList tasks={tasks} refreshTasks={fetchTasks} onEditTask={setEditingTask} />}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={true}
          onClose={() => setEditingTask(null)}
          refreshTasks={fetchTasks}
        />
      )}
    </div>
  );
};

export default Plan;
