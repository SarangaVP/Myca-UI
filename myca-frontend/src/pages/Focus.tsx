

// import React, { useEffect, useState } from "react";
// import { BASE_URL } from "../config";
// import TaskItem, { Task } from "../components/TaskItem";
// import EditTaskModal from "../components/EditTaskModal";
// import TaskInput from "../components/TaskInput";

// const Focus: React.FC = () => {
//   const [todaysFocus, setTodaysFocus] = useState<Task[]>([]);
//   const [todaysRituals, setTodaysRituals] = useState<Task[]>([]);
//   const [inProgress, setInProgress] = useState<Task[]>([]);
//   const [todaysRecurrings, setTodaysRecurrings] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [authToken, setAuthToken] = useState<string | null>(
//     localStorage.getItem("AUTH_TOKEN")
//   );
//   const [editingTask, setEditingTask] = useState<Task | null>(null);

//   const today = new Date();
//   const formattedDate = today.toISOString().split("T")[0]; // Formats as "2025-03-05"

//   const fetchFocusData = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       console.warn("AUTH_TOKEN not available, skipping fetch.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     console.log("Starting fetchFocusData with token:", token);

//     try {
//       // Fetch Today's Focus
//       console.log("Fetching Today's Focus...");
//       const focusResponse = await fetch(`${BASE_URL}/getFocusList`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           focused_items: [],
//         }),
//       });
//       console.log("getFocusList response status:", focusResponse.status);
//       if (!focusResponse.ok) {
//         const errorText = await focusResponse.text();
//         console.error("getFocusList failed with status:", focusResponse.status, "Details:", errorText);
//         throw new Error(`HTTP error for Today's Focus! Status: ${focusResponse.status}, Details: ${errorText}`);
//       }
//       const focusData = await focusResponse.json();
//       console.log("getFocusList succeeded, data:", focusData);

//       // Fetch Today's Rituals
//       console.log("Fetching Today's Rituals...");
//       const ritualsResponse = await fetch(`${BASE_URL}/getRitualItems`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           ritual_list: [],
//         }),
//       });
//       console.log("getRitualItems response status:", ritualsResponse.status);
//       if (!ritualsResponse.ok) {
//         const errorText = await ritualsResponse.text();
//         console.error("getRitualItems failed with status:", ritualsResponse.status, "Details:", errorText);
//         throw new Error(`HTTP error for Today's Rituals! Status: ${ritualsResponse.status}, Details: ${errorText}`);
//       }
//       const ritualsData = await ritualsResponse.json();
//       console.log("getRitualItems succeeded, data:", ritualsData);

//       // Fetch In Progress
//       console.log("Fetching In Progress...");
//       const inProgressResponse = await fetch(`${BASE_URL}/getInProgressItems`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           in_progress_items: [],
//         }),
//       });
//       console.log("getInProgressItems response status:", inProgressResponse.status);
//       if (!inProgressResponse.ok) {
//         const errorText = await inProgressResponse.text();
//         console.error("getInProgressItems failed with status:", inProgressResponse.status, "Details:", errorText);
//         throw new Error(`HTTP error for In Progress! Status: ${inProgressResponse.status}, Details: ${errorText}`);
//       }
//       const inProgressData = await inProgressResponse.json();
//       console.log("getInProgressItems succeeded, data:", inProgressData);

//       // Fetch Today's Recurrings
//       console.log("Fetching Today's Recurrings...");
//       const recurringsResponse = await fetch(`${BASE_URL}/getRecurrenceItems`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           focused_items: [],
//         }),
//       });
//       console.log("getRecurrenceItems response status:", recurringsResponse.status);
//       if (!recurringsResponse.ok) {
//         const errorText = await recurringsResponse.text();
//         console.error("getRecurrenceItems failed with status:", recurringsResponse.status, "Details:", errorText);
//         throw new Error(`HTTP error for Today's Recurrings! Status: ${recurringsResponse.status}, Details: ${errorText}`);
//       }
//       const recurringsData = await recurringsResponse.json();
//       console.log("getRecurrenceItems succeeded, data:", recurringsData);

//       // Process and categorize the data
//       const processTasks = (data: any): Task[] => {
//         if (data.status === 200 && data.reports && data.reports.length > 0) {
//           return data.reports[0].map((item: any) => ({
//             id: String(item.id),
//             name: item.context.name,
//             isFocused: item.context.is_focused || false,
//             parentId: item.context.parent_item_id || null,
//             children: [],
//             context: {
//               name: item.context.name,
//               itype: item.context.itype || "task",
//               status: item.context.status || "running",
//             },
//           }));
//         }
//         return [];
//       };

//       const focusTasks = processTasks(focusData);
//       const ritualsTasks = processTasks(ritualsData);
//       const inProgressTasks = processTasks(inProgressData);
//       const recurringsTasks = processTasks(recurringsData);

//       setTodaysFocus(focusTasks);
//       setTodaysRituals(ritualsTasks);
//       setInProgress(inProgressTasks);
//       setTodaysRecurrings(recurringsTasks);

//       console.log("Today's Focus:", focusTasks);
//       console.log("Today's Rituals:", ritualsTasks);
//       console.log("In Progress:", inProgressTasks);
//       console.log("Today's Recurrings:", recurringsTasks);
//     } catch (error) {
//       console.error("Error fetching focus data:", error);
//     } finally {
//       setLoading(false);
//       console.log("fetchFocusData finished");
//     }
//   };

//   useEffect(() => {
//     console.log("Focus useEffect running, authToken:", authToken);
//     if (authToken) {
//       setTimeout(() => fetchFocusData(), 500); // Delay to let carryPreviousDay finish
//     } else {
//       const interval = setInterval(() => {
//         const newToken = localStorage.getItem("AUTH_TOKEN");
//         if (newToken) {
//           setAuthToken(newToken);
//           clearInterval(interval);
//         }
//       }, 500);
//       return () => clearInterval(interval);
//     }
//   }, [authToken]);

//   const displayDate = today.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//   });

//   const handleUpdateTask = async (task: Task, updatedFields: Partial<Task>) => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) return;

//     const encodedTaskId = encodeURIComponent(task.id);
//     console.log("Updating/Editing task with ID:", encodedTaskId, "Data:", updatedFields);

//     try {
//       const response = await fetch(`${BASE_URL}/updateItem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           item_id: task.id,
//           new_name: updatedFields.name || task.name,
//           new_type: updatedFields.context?.itype || task.context?.itype || "task",
//           new_status: updatedFields.context?.status || task.context?.status || "running",
//           isFocused: updatedFields.isFocused !== undefined ? updatedFields.isFocused : task.isFocused,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("updateItem failed with status:", response.status, "Details:", errorText);
//         throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }

//       if (task.isFocused) {
//         setTodaysFocus((prev: Task[]) =>
//           prev.map((t: Task) => (t.id === task.id ? { ...t, ...updatedFields, context: { ...t.context, ...updatedFields.context } } : t))
//         );
//       } else {
//         setTodaysRituals((prev: Task[]) =>
//           prev.map((t: Task) => (t.id === task.id ? { ...t, ...updatedFields, context: { ...t.context, ...updatedFields.context } } : t))
//         );
//         setInProgress((prev: Task[]) =>
//           prev.map((t: Task) => (t.id === task.id ? { ...t, ...updatedFields, context: { ...t.context, ...updatedFields.context } } : t))
//         );
//         setTodaysRecurrings((prev: Task[]) =>
//           prev.map((t: Task) => (t.id === task.id ? { ...t, ...updatedFields, context: { ...t.context, ...updatedFields.context } } : t))
//         );
//       }

//       fetchFocusData();
//       setEditingTask(null);
//     } catch (error) {
//       console.error("Error updating/editing task:", error);
//     }
//   };

//   const refreshTasks = () => {
//     fetchFocusData();
//   };

//   const onEditTask = (task: Task) => {
//     setEditingTask(task);
//     console.log("Editing task:", task);
//   };

//   return (
//     <div style={{ flex: 1, padding: "20px", backgroundColor: "#f4f4f4" }}>
//       <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>Focus</h2>
//       <p style={{ fontSize: "18px", color: "#666", marginBottom: "15px" }}>{displayDate}</p>

//       <TaskInput refreshTasks={refreshTasks} />

//       {loading ? (
//         <p>Loading tasks...</p>
//       ) : (
//         <div style={{ display: "flex", gap: "20px" }}>
//           <div style={{ flex: 1 }}>
//             <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "20px", padding: "15px" }}>
//               <h3>Today's Focus <span style={{ fontSize: "12px" }}>+</span></h3>
//               <p>These are your priorities for today</p>
//               {todaysFocus.map((task: Task) => (
//                 <TaskItem
//                   key={task.id}
//                   task={task}
//                   refreshTasks={refreshTasks}
//                   onEditTask={onEditTask}
//                 />
//               ))}
//             </div>

//             <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "20px", padding: "15px" }}>
//               <h3>In progress</h3>
//               <p>These are your currently in progress items</p>
//               {inProgress.map((task: Task) => (
//                 <TaskItem
//                   key={task.id}
//                   task={task}
//                   refreshTasks={refreshTasks}
//                   onEditTask={onEditTask}
//                 />
//               ))}
//             </div>
//           </div>

//           <div style={{ flex: 1 }}>
//             <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "20px", padding: "15px" }}>
//               <h3>Today's Rituals <span style={{ fontSize: "12px" }}>🌱</span></h3>
//               <p>These are the ritual tasks that you want to do today</p>
//               {todaysRituals.map((task: Task) => (
//                 <TaskItem
//                   key={task.id}
//                   task={task}
//                   refreshTasks={refreshTasks}
//                   onEditTask={onEditTask}
//                 />
//               ))}
//             </div>

//             <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "20px", padding: "15px" }}>
//               <h3>Today's Recurrings</h3>
//               <p>These are the recurring tasks that you want to do today</p>
//               {todaysRecurrings.map((task: Task) => (
//                 <TaskItem
//                   key={task.id}
//                   task={task}
//                   refreshTasks={refreshTasks}
//                   onEditTask={onEditTask}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {editingTask && (
//         <EditTaskModal
//           task={editingTask}
//           isOpen={!!editingTask}
//           onClose={() => setEditingTask(null)}
//           refreshTasks={refreshTasks}
//         />
//       )}
//     </div>
//   );
// };

// export default Focus;




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
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // Formats as "2025-03-05"

  const fetchFocusData = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      console.warn("AUTH_TOKEN not available, skipping fetch.");
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log("Starting fetchFocusData with token:", token);

    try {
      console.log("Fetching Today's Focus...");
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
      console.log("getFocusList response status:", focusResponse.status);
      if (!focusResponse.ok) {
        const errorText = await focusResponse.text();
        console.error("getFocusList failed with status:", focusResponse.status, "Details:", errorText);
        throw new Error(`HTTP error for Today's Focus! Status: ${focusResponse.status}, Details: ${errorText}`);
      }
      const focusData = await focusResponse.json();
      console.log("getFocusList succeeded, data:", focusData);

      console.log("Fetching Today's Rituals...");
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
      console.log("getRitualItems response status:", ritualsResponse.status);
      if (!ritualsResponse.ok) {
        const errorText = await ritualsResponse.text();
        console.error("getRitualItems failed with status:", ritualsResponse.status, "Details:", errorText);
        throw new Error(`HTTP error for Today's Rituals! Status: ${ritualsResponse.status}, Details: ${errorText}`);
      }
      const ritualsData = await ritualsResponse.json();
      console.log("getRitualItems succeeded, data:", ritualsData);

      console.log("Fetching In Progress...");
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
      console.log("getInProgressItems response status:", inProgressResponse.status);
      if (!inProgressResponse.ok) {
        const errorText = await inProgressResponse.text();
        console.error("getInProgressItems failed with status:", inProgressResponse.status, "Details:", errorText);
        throw new Error(`HTTP error for In Progress! Status: ${inProgressResponse.status}, Details: ${errorText}`);
      }
      const inProgressData = await inProgressResponse.json();
      console.log("getInProgressItems succeeded, data:", inProgressData);

      console.log("Fetching Today's Recurrings...");
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
      console.log("getRecurrenceItems response status:", recurringsResponse.status);
      if (!recurringsResponse.ok) {
        const errorText = await recurringsResponse.text();
        console.error("getRecurrenceItems failed with status:", recurringsResponse.status, "Details:", errorText);
        throw new Error(`HTTP error for Today's Recurrings! Status: ${recurringsResponse.status}, Details: ${errorText}`);
      }
      const recurringsData = await recurringsResponse.json();
      console.log("getRecurrenceItems succeeded, data:", recurringsData);

      const processTasks = (data: any): Task[] => {
        if (data.status === 200 && data.reports && data.reports.length > 0) {
          return data.reports[0].map((item: any) => ({
            id: String(item.id),
            name: item.context.name,
            isFocused: item.context.is_focused || false,
            parentId: item.context.parent_item_id || null,
            children: [],
            context: {
              name: item.context.name,
              itype: item.context.itype || "task",
              status: item.context.status || "running",
            },
          }));
        }
        return [];
      };

      const focusTasks = processTasks(focusData);
      const ritualsTasks = processTasks(ritualsData);
      const inProgressTasks = processTasks(inProgressData);
      const recurringsTasks = processTasks(recurringsData);

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
      console.log("fetchFocusData finished");
    }
  };

  useEffect(() => {
    console.log("Focus useEffect running, authToken:", authToken);
    if (authToken) {
      setTimeout(() => fetchFocusData(), 500);
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

  const handleUpdateTask = async (task: Task, updatedFields: Partial<Task>) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) return;

    const encodedTaskId = encodeURIComponent(task.id);
    console.log("Updating/Editing task with ID:", encodedTaskId, "Data:", updatedFields);

    try {
      const response = await fetch(`${BASE_URL}/updateItem`, {
        method: "POST",
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
        const errorText = await response.text();
        console.error("updateItem failed with status:", response.status, "Details:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      if (task.isFocused) {
        setTodaysFocus((prev: Task[]) =>
          prev.map((t: Task) => (t.id === task.id ? { ...t, ...updatedFields, context: { ...t.context, ...updatedFields.context } } : t))
        );
      } else {
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

      fetchFocusData();
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating/editing task:", error);
    }
  };

  const refreshTasks = () => {
    fetchFocusData();
  };

  const onEditTask = (task: Task) => {
    setEditingTask(task);
    console.log("Editing task:", task);
  };

  return (
    <div style={{ flex: 1, padding: "20px", backgroundColor: "#f4f4f4" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>Focus</h2>
      <p style={{ fontSize: "18px", color: "#666", marginBottom: "15px" }}>{displayDate}</p>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "20px", padding: "15px" }}>
              <h3>Today's Focus <span style={{ fontSize: "12px" }}>+</span></h3>
              <p>These are your priorities for today</p>
              <TaskInput refreshTasks={refreshTasks} isFocused={true} /> {/* Set isFocused here */}
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