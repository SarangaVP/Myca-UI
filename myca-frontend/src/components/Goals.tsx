// // // Goals.tsx
// // import React, { useEffect, useState } from "react";
// // import TaskList from "../components/TaskList";
// // import EditTaskModal from "../components/EditTaskModal";
// // import { BASE_URL } from "../config";

// // interface Task {
// //   id: string;
// //   name: string;
// //   isFocused: boolean;
// //   parentId?: string;
// //   children?: Task[];
// //   context?: {
// //     name: string;
// //     itype: string;
// //     status: string;
// //     ritual?: {
// //       start: string;
// //       frequency: string;
// //       ritual_flag: boolean;
// //       interval: number;
// //       by_day_of_week: boolean[];
// //       by_day_of_month: number;
// //       occurrence: number;
// //       end: string;
// //     };
// //     parent_item_id: string;
// //     note: string;
// //     last_updated: string;
// //     is_snoozed: boolean;
// //     snoozed_till: string;
// //     is_focused: boolean;
// //   };
// // }

// // interface TimePeriodProps {
// //   timePeriod: "life" | "year" | "month" | "week";
// // }

// // const Goals: React.FC<TimePeriodProps> = ({ timePeriod }) => {
// //   const [tasks, setTasks] = useState<Task[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [editingTask, setEditingTask] = useState<Task | null>(null);
// //   const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("AUTH_TOKEN"));

// //   const today = new Date();
// //   const formattedDate = today.toISOString().split("T")[0];

// //   const getDisplayText = () => {
// //     switch (timePeriod) {
// //       case "year":
// //         return today.getFullYear().toString(); 
// //         case "month":
// //             return today.toLocaleDateString("en-US", { month: "long", year: "numeric" }); 
// //           case "week":
// //             const weekStart = new Date(today);
// //             weekStart.setDate(today.getDate() - today.getDay() + 1); 
// //             const weekEnd = new Date(today);
// //             weekEnd.setDate(today.getDate() + (7 - today.getDay())); 
// //             return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`; // e.g., "Mar 17, 2025 - Mar 23, 2025"
// //           case "life":
// //             return "Life Goals"; 
// //           default:
// //             return "";
// //     }
// //   };

// //   const fetchTasks = async () => {
// //     const token = localStorage.getItem("AUTH_TOKEN");
// //     if (!token) {
// //       console.warn("AUTH_TOKEN not available, skipping fetch.");
// //       setLoading(false);
// //       return;
// //     }

// //     setLoading(true);
// //     console.log(`Starting fetchTasks for ${timePeriod} with token:`, token);

// //     try {
// //       const endpoint = `get${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}`; 
// //       const response = await fetch(`${BASE_URL}/${endpoint}`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         credentials: "include",
// //         body: JSON.stringify({ date: formattedDate, goal_list: [] }),
// //       });
// //       console.log(`${endpoint} response status:`, response.status);

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error("Request failed with status:", response.status, "Details:", errorText);
// //         throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
// //       }

// //       const data = await response.json();
// //       console.log("Request succeeded, got data:", data);

// //       let rawTasks: Task[] = [];
// //       if (data.status === 200 && data.reports && data.reports.length > 0) {
// //         rawTasks = data.reports[0].map((item: any) => ({
// //           id: String(item.id),
// //           name: item.context.name,
// //           isFocused: item.context.is_focused || false,
// //           parentId: item.context.parent_item_id || null,
// //           children: [],
// //           context: {
// //             name: item.context.name,
// //             itype: item.context.itype || "task",
// //             status: item.context.status || "open",
// //           },
// //         }));

// //         const taskMap = new Map<string, Task>();
// //         rawTasks.forEach((task) => taskMap.set(task.id, { ...task, children: [] }));

// //         const rootTasks: Task[] = [];
// //         rawTasks.forEach((task) => {
// //           if (task.parentId && taskMap.has(task.parentId)) {
// //             taskMap.get(task.parentId)!.children!.push(taskMap.get(task.id)!);
// //           } else {
// //             rootTasks.push(taskMap.get(task.id)!);
// //           }
// //         });

// //         setTasks(rootTasks);
// //       } else {
// //         console.log("Request returned no tasks:", data);
// //         setTasks([]);
// //       }
// //     } catch (error) {
// //       console.error(`Error fetching tasks for ${timePeriod}:`, error);
// //       setTasks([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     console.log(`Goals useEffect running for ${timePeriod}, authToken:`, authToken);
// //     if (authToken) {
// //       setTimeout(() => fetchTasks(), 500);
// //     } else {
// //       const interval = setInterval(() => {
// //         const newToken = localStorage.getItem("AUTH_TOKEN");
// //         if (newToken) {
// //           setAuthToken(newToken);
// //           clearInterval(interval);
// //         }
// //       }, 500);
// //       return () => clearInterval(interval);
// //     }
// //   }, [authToken, timePeriod]);

// //   useEffect(() => {
// //     console.log(`Tasks updated for ${timePeriod}:`, tasks);
// //   }, [tasks]);

// //   return (
// //     <div style={containerStyle} className="plan-container">
// //       <header style={headerStyle} className="plan-header">
// //         <h2 style={titleStyle} className="plan-title">Goals</h2>
// //         <p style={dateStyle} className="plan-date">{getDisplayText()}</p>
// //       </header>

// //       {loading ? (
// //         <div style={loadingStyle} className="plan-loading">
// //           <span className="spinner"></span> Loading tasks...
// //         </div>
// //       ) : (
// //         <TaskList tasks={tasks} refreshTasks={fetchTasks} onEditTask={setEditingTask} />
// //       )}

// //       {editingTask && (
// //         <EditTaskModal
// //           task={editingTask}
// //           isOpen={true}
// //           onClose={() => setEditingTask(null)}
// //           refreshTasks={fetchTasks}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // // Styles
// // const containerStyle: React.CSSProperties = {
// //   flex: 1,
// //   padding: "40px",
// //   backgroundColor: "#f4f4f4",
// //   minHeight: "100vh",
// //   fontFamily: "Poppins, sans-serif",
// // };

// // const headerStyle: React.CSSProperties = {
// //   background: "linear-gradient(135deg, #f5f5f5, #e0e0e0)",
// //   padding: "25px 30px",
// //   borderRadius: "15px",
// //   boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
// //   marginBottom: "20px",
// //   position: "relative",
// //   overflow: "hidden",
// //   display: "flex",
// //   justifyContent: "space-between",
// //   alignItems: "center",
// // };

// // const titleStyle: React.CSSProperties = {
// //   fontSize: "36px",
// //   fontWeight: "800",
// //   marginBottom: "0",
// //   color: "#000000",
// //   letterSpacing: "1px",
// //   textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
// // };

// // const dateStyle: React.CSSProperties = {
// //   fontSize: "22px",
// //   color: "#000000",
// //   marginBottom: "0",
// //   fontWeight: "500",
// //   textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
// // };

// // const loadingStyle: React.CSSProperties = {
// //   display: "flex",
// //   alignItems: "center",
// //   justifyContent: "center",
// //   fontSize: "20px",
// //   color: "#666",
// //   marginTop: "30px",
// //   gap: "15px",
// // };

// // export default Goals;






// import React, { useEffect, useState, useRef } from "react";
// import TaskItem from "../components/TaskItem";
// import EditTaskModal from "../components/EditTaskModal";
// import { BASE_URL } from "../config";

// // Align the Task interface with TaskItem.tsx
// interface Task {
//   id: string;
//   name: string;
//   isFocused: boolean;
//   isSnoozed: boolean;
//   note?: string;
//   children?: Task[];
//   parentId?: string;
//   context: {
//     status?: string;
//     itype?: string;
//     name?: string;
//     parent_item_id?: string;
//     note?: string;
//     is_focused?: boolean;
//     is_snoozed?: boolean;
//     ritual?: {
//       start: string;
//       frequency: string;
//       ritual_flag: boolean;
//       interval: number;
//       by_day_of_week: boolean[];
//       by_day_of_month: number;
//       occurrence: number;
//       end: string;
//     };
//     last_updated?: string;
//     snoozed_till?: string;
//     [key: string]: any; // Allow additional properties
//   };
// }

// interface TimePeriodProps {
//   timePeriod: "life" | "year" | "month" | "week";
// }

// const Goals: React.FC<TimePeriodProps> = ({ timePeriod }) => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("AUTH_TOKEN"));
//   const [error, setError] = useState<string | null>(null);
//   const [isAddingGoal, setIsAddingGoal] = useState(false);
//   const [newGoalName, setNewGoalName] = useState("");
//   const [isAddingSubGoal, setIsAddingSubGoal] = useState(false);
//   const [subGoalName, setSubGoalName] = useState("");
//   const [subGoalParentId, setSubGoalParentId] = useState<string | null>(null);

//   const today = new Date();
//   const formattedDate = today.toISOString().split("T")[0]; // e.g., "2025-03-18"

//   const getDisplayText = () => {
//     switch (timePeriod) {
//       case "year":
//         return today.getFullYear().toString();
//       case "month":
//         return today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
//       case "week":
//         const weekStart = new Date(today);
//         weekStart.setDate(today.getDate() - today.getDay() + 1);
//         const weekEnd = new Date(today);
//         weekEnd.setDate(today.getDate() + (7 - today.getDay()));
//         return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
//       case "life":
//         return "Life Goals";
//       default:
//         return "";
//     }
//   };

//   const getHeaderTitle = () => {
//     switch (timePeriod) {
//       case "life":
//         return "Life Goals";
//       case "week":
//         return "Weekly Goals";
//       case "month":
//         return "Monthly Goals";
//       case "year":
//         return "Yearly Goals";
//       default:
//         return "Goals";
//     }
//   };

//   const fetchTasks = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       console.warn("AUTH_TOKEN not available, skipping fetch.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     console.log(`Starting fetchTasks for ${timePeriod} with token:`, token);

//     try {
//       const endpoint = `get${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}`;
//       const response = await fetch(`${BASE_URL}/${endpoint}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({ date: formattedDate, goal_list: [] }),
//       });
//       console.log(`${endpoint} response status:`, response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Request failed with status:", response.status, "Details:", errorText);
//         throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("Request succeeded, got data:", data);

//       let rawTasks: Task[] = [];
//       if (data.status === 200 && data.reports && data.reports.length > 0) {
//         rawTasks = data.reports[0].map((item: any) => ({
//           id: String(item.id),
//           name: item.context.name,
//           isFocused: item.context.is_focused || false,
//           isSnoozed: item.context.is_snoozed || false,
//           note: item.context.note || "",
//           children: [],
//           parentId: item.context.parent_item_id || null,
//           context: {
//             status: item.context.status || "open",
//             itype: item.context.itype || "goal",
//             name: item.context.name,
//             parent_item_id: item.context.parent_item_id || "",
//             note: item.context.note || "",
//             is_focused: item.context.is_focused || false,
//             is_snoozed: item.context.is_snoozed || false,
//             ritual: item.context.ritual || {
//               start: "",
//               frequency: "",
//               ritual_flag: false,
//               interval: 1,
//               by_day_of_week: [false, false, false, false, false, false, false],
//               by_day_of_month: 0,
//               occurrence: 0,
//               end: "",
//             },
//             last_updated: item.context.last_updated || "",
//             snoozed_till: item.context.snoozed_till || "",
//           },
//         }));

//         const taskMap = new Map<string, Task>();
//         rawTasks.forEach((task) => taskMap.set(task.id, { ...task, children: [] }));

//         const rootTasks: Task[] = [];
//         rawTasks.forEach((task) => {
//           if (task.parentId && taskMap.has(task.parentId)) {
//             taskMap.get(task.parentId)!.children!.push(taskMap.get(task.id)!);
//           } else {
//             rootTasks.push(taskMap.get(task.id)!);
//           }
//         });

//         setTasks(rootTasks);
//       } else {
//         console.log("Request returned no tasks:", data);
//         setTasks([]);
//       }
//     } catch (error) {
//       console.error(`Error fetching tasks for ${timePeriod}:`, error);
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddGoal = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       setError("Authentication token not found. Please log in.");
//       return;
//     }

//     if (!newGoalName || newGoalName.trim() === "") {
//       setError("Goal name cannot be empty.");
//       return;
//     }

//     const requestBody = {
//       date: formattedDate,
//       goal_name: newGoalName.trim(),
//       goal_period: timePeriod, // Dynamically set based on timePeriod
//       parent_goal_id: "",
//     };

//     try {
//       const response = await fetch(`${BASE_URL}/createGoal`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to create goal: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       if (data.status === 200) {
//         console.log("Goal created successfully:", data);
//         fetchTasks();
//         setIsAddingGoal(false);
//         setNewGoalName("");
//         setError(null);
//       } else {
//         throw new Error(`Unexpected response status: ${data.status}`);
//       }
//     } catch (error) {
//       console.error("Error creating goal:", error);
//       setError("Failed to create goal. Please try again.");
//     }
//   };

//   const handleAddSubGoal = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       setError("Authentication token not found. Please log in.");
//       return;
//     }

//     if (!subGoalName || subGoalName.trim() === "") {
//       setError("Sub-goal name cannot be empty.");
//       return;
//     }

//     if (!subGoalParentId) {
//       setError("Parent goal ID is missing.");
//       return;
//     }

//     const requestBody = {
//       date: formattedDate,
//       goal_name: subGoalName.trim(),
//       goal_period: timePeriod, // Dynamically set based on timePeriod
//       parent_goal_id: subGoalParentId,
//     };

//     try {
//       const response = await fetch(`${BASE_URL}/createGoal`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to create sub-goal: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       if (data.status === 200) {
//         console.log("Sub-goal created successfully:", data);
//         fetchTasks();
//         setIsAddingSubGoal(false);
//         setSubGoalName("");
//         setSubGoalParentId(null);
//         setError(null);
//       } else {
//         throw new Error(`Unexpected response status: ${data.status}`);
//       }
//     } catch (error) {
//       console.error("Error creating sub-goal:", error);
//       setError("Failed to create sub-goal. Please try again.");
//     }
//   };

//   const handleCancelAddGoal = () => {
//     setIsAddingGoal(false);
//     setNewGoalName("");
//     setError(null);
//   };

//   const handleCancelAddSubGoal = () => {
//     setIsAddingSubGoal(false);
//     setSubGoalName("");
//     setSubGoalParentId(null);
//     setError(null);
//   };

//   const handleEditTask = (task: Task) => {
//     setEditingTask(task);
//   };

//   const handleStartAddSubGoal = (parentId: string) => {
//     setIsAddingSubGoal(true);
//     setSubGoalParentId(parentId);
//   };

//   // Handle "Enter" key press for adding a goal
//   const handleGoalInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.preventDefault(); // Prevent form submission or other default behavior
//       handleAddGoal();
//     }
//   };

//   // Handle "Enter" key press for adding a sub-goal
//   const handleSubGoalInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.preventDefault(); // Prevent form submission or other default behavior
//       handleAddSubGoal();
//     }
//   };

//   useEffect(() => {
//     console.log(`Goals useEffect running for ${timePeriod}, authToken:`, authToken);
//     if (authToken) {
//       setTimeout(() => fetchTasks(), 500);
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
//   }, [authToken, timePeriod]);

//   useEffect(() => {
//     console.log("Tasks updated:", tasks);
//   }, [tasks]);

//   return (
//     <div style={containerStyle} className="goals-container">
//       <header style={headerStyle} className="goals-header">
//         <h2 style={titleStyle} className="goals-title">{getHeaderTitle()}</h2>
//         {!isAddingGoal && (
//           <button
//             style={addButtonStyle}
//             onClick={() => setIsAddingGoal(true)}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = addButtonHoverStyle.backgroundColor ?? addButtonStyle.backgroundColor ?? "")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = addButtonStyle.backgroundColor ?? "")}
//           >
//             + Add Goal
//           </button>
//         )}
//       </header>

//       {error && <div style={errorStyle}>{error}</div>}

//       {isAddingGoal && (
//         <div style={addGoalRowStyle} className="add-goal-row">
//           <input
//             type="text"
//             value={newGoalName}
//             onChange={(e) => setNewGoalName(e.target.value)}
//             onKeyDown={handleGoalInputKeyDown} // Add Enter key handler
//             placeholder={`Enter the name of your new ${timePeriod} goal`}
//             style={addGoalInputStyle}
//             autoFocus // Automatically focus the input when it appears
//           />
//           <button style={addGoalButtonStyle} onClick={handleAddGoal}>
//             OK
//           </button>
//           <button style={cancelButtonStyle} onClick={handleCancelAddGoal}>
//             Cancel
//           </button>
//         </div>
//       )}

//       {loading ? (
//         <div style={loadingStyle} className="goals-loading">
//           <span className="spinner"></span> Loading goals...
//         </div>
//       ) : tasks.length === 0 ? (
//         <div style={noTasksStyle}>No goals found. Add a new goal to get started!</div>
//       ) : (
//         <div style={taskListStyle}>
//           {tasks.map((task, index) => (
//             <div key={task.id}>
//               <TaskItem
//                 task={task}
//                 refreshTasks={fetchTasks}
//                 onEditTask={handleEditTask}
//                 draggable={true}
//                 index={index}
//                 onAddSubGoal={handleStartAddSubGoal} // Intercept "+" click to start sub-goal addition
//               />
//               {isAddingSubGoal && subGoalParentId === task.id && (
//                 <div style={addSubGoalRowStyle} className="add-sub-goal-row">
//                   <input
//                     type="text"
//                     value={subGoalName}
//                     onChange={(e) => setSubGoalName(e.target.value)}
//                     onKeyDown={handleSubGoalInputKeyDown} // Add Enter key handler
//                     placeholder={`Enter the name of your new sub-goal`}
//                     style={addGoalInputStyle}
//                     autoFocus // Automatically focus the input when it appears
//                   />
//                   <button style={addGoalButtonStyle} onClick={handleAddSubGoal}>
//                     OK
//                   </button>
//                   <button style={cancelButtonStyle} onClick={handleCancelAddSubGoal}>
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {editingTask && (
//         <EditTaskModal
//           task={editingTask}
//           isOpen={true}
//           onClose={() => setEditingTask(null)}
//           refreshTasks={fetchTasks}
//         />
//       )}
//     </div>
//   );
// };

// // Styles
// const containerStyle: React.CSSProperties = {
//   flex: 1,
//   padding: "20px",
//   backgroundColor: "#f9f9f9",
//   minHeight: "100vh",
//   fontFamily: "Arial, sans-serif",
// };

// const headerStyle: React.CSSProperties = {
//   background: "#f0f0f0",
//   padding: "15px 20px",
//   borderRadius: "5px",
//   marginBottom: "20px",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
// };

// const titleStyle: React.CSSProperties = {
//   fontSize: "24px",
//   fontWeight: "600",
//   margin: "0",
//   color: "#333",
// };

// const addButtonStyle: React.CSSProperties = {
//   backgroundColor: "#6a0dad",
//   color: "white",
//   padding: "8px 15px",
//   border: "none",
//   borderRadius: "4px",
//   fontSize: "14px",
//   fontWeight: "500",
//   cursor: "pointer",
//   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
// };

// const addButtonHoverStyle: React.CSSProperties = {
//   backgroundColor: "#5a099d",
// };

// const addGoalRowStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   gap: "10px",
//   padding: "10px",
//   backgroundColor: "#fff",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
//   marginBottom: "20px",
//   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
// };

// const addSubGoalRowStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   gap: "10px",
//   padding: "10px",
//   backgroundColor: "#fff",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
//   marginLeft: "20px",
//   marginBottom: "5px",
//   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
// };

// const addGoalInputStyle: React.CSSProperties = {
//   flex: 1,
//   padding: "8px",
//   fontSize: "14px",
//   border: "1px solid #6a0dad",
//   borderRadius: "4px",
//   outline: "none",
// };

// const addGoalButtonStyle: React.CSSProperties = {
//   backgroundColor: "#007bff",
//   color: "white",
//   padding: "8px 15px",
//   border: "none",
//   borderRadius: "4px",
//   fontSize: "14px",
//   cursor: "pointer",
//   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
// };

// const cancelButtonStyle: React.CSSProperties = {
//   backgroundColor: "#6c757d",
//   color: "white",
//   padding: "8px 15px",
//   border: "none",
//   borderRadius: "4px",
//   fontSize: "14px",
//   cursor: "pointer",
//   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
// };

// const taskListStyle: React.CSSProperties = {
//   marginBottom: "20px",
// };

// const loadingStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: "16px",
//   color: "#666",
//   marginTop: "20px",
//   gap: "10px",
// };

// const noTasksStyle: React.CSSProperties = {
//   textAlign: "center",
//   color: "#666",
//   marginTop: "20px",
//   fontSize: "16px",
// };

// const errorStyle: React.CSSProperties = {
//   backgroundColor: "#f8d7da",
//   color: "#721c24",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   marginBottom: "20px",
//   fontSize: "14px",
//   fontWeight: "500",
//   textAlign: "center",
// };

// export default Goals;


import React, { useEffect, useState } from "react";
import TaskItem from "../components/TaskItem";
import EditTaskModal from "../components/EditTaskModal";
import { BASE_URL } from "../config";

interface Task {
  id: string;
  name: string;
  isFocused: boolean;
  isSnoozed: boolean;
  note?: string;
  children?: Task[];
  parentId?: string;
  context: {
    status?: string;
    itype?: string;
    name?: string;
    parent_item_id?: string;
    note?: string;
    is_focused?: boolean;
    is_snoozed?: boolean;
    ritual?: {
      start: string;
      frequency: string;
      ritual_flag: boolean;
      interval: number;
      by_day_of_week: boolean[];
      by_day_of_month: number;
      occurrence: number;
      end: string;
    };
    last_updated?: string;
    snoozed_till?: string;
    [key: string]: any;
  };
}

interface TimePeriodProps {
  timePeriod: "life" | "year" | "month" | "week";
}

const Goals: React.FC<TimePeriodProps> = ({ timePeriod }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [isAddingSubGoal, setIsAddingSubGoal] = useState(false);
  const [subGoalName, setSubGoalName] = useState("");
  const [subGoalParentId, setSubGoalParentId] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [noteLoading, setNoteLoading] = useState(true);
  const [noteSaving, setNoteSaving] = useState(false);

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const getDisplayText = () => {
    switch (timePeriod) {
      case "year": return today.getFullYear().toString();
      case "month": return today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      case "week": {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + (7 - today.getDay()));
        return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
      }
      case "life": return "Life Goals";
      default: return "";
    }
  };

  const getHeaderTitle = () => {
    switch (timePeriod) {
      case "life": return "Life Goals";
      case "week": return "Weekly Goals";
      case "month": return "Monthly Goals";
      case "year": return "Yearly Goals";
      default: return "Goals";
    }
  };

  const fetchTasks = async (token: string) => {
    setLoading(true);
    console.log(`Fetching tasks for ${timePeriod} with token:`, token);
    try {
      const endpoint = `get${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}`;
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ date: formattedDate, goal_list: [] }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const data = await response.json();
      console.log(`Tasks data received for ${timePeriod}:`, data);
      let rawTasks: Task[] = [];
      if (data.status === 200 && data.reports && data.reports.length > 0) {
        rawTasks = data.reports[0].map((item: any) => ({
          id: String(item.id),
          name: item.context.name,
          isFocused: item.context.is_focused || false,
          isSnoozed: item.context.is_snoozed || false,
          note: item.context.note || "",
          children: [],
          parentId: item.context.parent_item_id || null,
          context: {
            status: item.context.status || "open",
            itype: item.context.itype || "goal",
            name: item.context.name,
            parent_item_id: item.context.parent_item_id || "",
            note: item.context.note || "",
            is_focused: item.context.is_focused || false,
            is_snoozed: item.context.is_snoozed || false,
            ritual: item.context.ritual || {
              start: "", frequency: "", ritual_flag: false, interval: 1,
              by_day_of_week: [false, false, false, false, false, false, false],
              by_day_of_month: 0, occurrence: 0, end: "",
            },
            last_updated: item.context.last_updated || "",
            snoozed_till: item.context.snoozed_till || "",
          },
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
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error(`Error fetching tasks for ${timePeriod}:`, error);
      setTasks([]);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNote = async (token: string) => {
    setNoteLoading(true);
    console.log(`Fetching note from ${BASE_URL}/addEnvisionNotes for ${timePeriod} with token:`, token);
    console.log("Request body:", { date: formattedDate, note: "", time_period: timePeriod });
    try {
      const response = await fetch(`${BASE_URL}/addEnvisionNotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ date: formattedDate, note: "", time_period: timePeriod }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Fetch note failed: Status ${response.status}, Response: ${errorText}`);
        throw new Error(`Failed to fetch note: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`Note data received for ${timePeriod}:`, data);

      if (data.status === 200) {
        const existingNote = data.reports?.length > 0 ? data.reports[0].context.note || "" : data.note || "";
        setNote(existingNote);
      } else {
        setNote("");
      }
    } catch (error) {
      console.error("Error fetching note:", error);
      setNote("");
      setError("Failed to load note due to a server error. Please try again.");
    } finally {
      setNoteLoading(false);
    }
  };

  const saveNote = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      return;
    }

    setNoteSaving(true);
    console.log(`Saving note to ${BASE_URL}/addEnvisionNotes for ${timePeriod} with token:`, token);
    console.log("Request body:", { date: formattedDate, note, time_period: timePeriod });
    try {
      const response = await fetch(`${BASE_URL}/addEnvisionNotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ date: formattedDate, note: note, time_period: timePeriod }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Save note failed: Status ${response.status}, Response: ${errorText}`);
        throw new Error(`Failed to save note: ${response.status} - ${errorText}`);
      }

      console.log("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
      setError("Failed to save note due to a server error. Please try again.");
    } finally {
      setNoteSaving(false);
    }
  };

  const handleAddGoal = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token || !newGoalName.trim()) {
      setError(!token ? "Authentication token not found." : "Goal name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/createGoal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: formattedDate,
          goal_name: newGoalName.trim(),
          goal_period: timePeriod,
          parent_goal_id: "",
        }),
      });

      if (!response.ok) throw new Error(`Failed to create goal: ${response.status}`);
      await response.json();
      fetchTasks(token);
      setIsAddingGoal(false);
      setNewGoalName("");
      setError(null);
    } catch (error) {
      console.error("Error creating goal:", error);
      setError("Failed to create goal.");
    }
  };

  const handleAddSubGoal = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token || !subGoalName.trim() || !subGoalParentId) {
      setError(!token ? "Authentication token not found." : !subGoalName.trim() ? "Sub-goal name cannot be empty." : "Parent goal ID missing.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/createGoal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: formattedDate,
          goal_name: subGoalName.trim(),
          goal_period: timePeriod,
          parent_goal_id: subGoalParentId,
        }),
      });

      if (!response.ok) throw new Error(`Failed to create sub-goal: ${response.status}`);
      await response.json();
      fetchTasks(token);
      setIsAddingSubGoal(false);
      setSubGoalName("");
      setSubGoalParentId(null);
      setError(null);
    } catch (error) {
      console.error("Error creating sub-goal:", error);
      setError("Failed to create sub-goal.");
    }
  };

  const handleCancelAddGoal = () => {
    setIsAddingGoal(false);
    setNewGoalName("");
    setError(null);
  };

  const handleCancelAddSubGoal = () => {
    setIsAddingSubGoal(false);
    setSubGoalName("");
    setSubGoalParentId(null);
    setError(null);
  };

  const handleEditTask = (task: Task) => setEditingTask(task);
  const handleStartAddSubGoal = (parentId: string) => {
    setIsAddingSubGoal(true);
    setSubGoalParentId(parentId);
  };

  useEffect(() => {
    console.log(`Component mounted for ${timePeriod}. Checking auth token...`);
    const token = localStorage.getItem("AUTH_TOKEN");
    setAuthToken(token);

    if (token) {
      console.log(`Token found: ${token}. Fetching data with delay...`);
      fetchTasks(token); // Fetch tasks immediately
      const noteDelay = setTimeout(() => {
        fetchNote(token); // Fetch note after a 1-second delay
      }, 1000); // 1000ms = 1 second

      // Cleanup timeout if component unmounts
      return () => clearTimeout(noteDelay);
    } else {
      console.warn("No auth token found on mount. Please log in.");
      setLoading(false);
      setNoteLoading(false);
      setError("Please log in to view goals and notes.");
    }
  }, [timePeriod]);

  useEffect(() => {
    console.log(`Tasks updated for ${timePeriod}:`, tasks);
  }, [tasks]);

  useEffect(() => {
    console.log(`Note updated for ${timePeriod}:`, note);
  }, [note]);

  return (
    <div style={containerStyle} className="goals-container">
      <header style={headerStyle} className="goals-header">
        <h2 style={titleStyle} className="goals-title">{getHeaderTitle()}</h2>
        {!isAddingGoal && (
          <button
            style={addButtonStyle}
            onClick={() => setIsAddingGoal(true)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = addButtonHoverStyle.backgroundColor ?? "")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = addButtonStyle.backgroundColor ?? "")}
          >
            + Add Goal
          </button>
        )}
      </header>

      {error && <div style={errorStyle}>{error}</div>}

      {isAddingGoal && (
        <div style={addGoalRowStyle}>
          <input
            type="text"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            placeholder={`Enter your new ${timePeriod} goal`}
            style={addGoalInputStyle}
            autoFocus
          />
          <button style={addGoalButtonStyle} onClick={handleAddGoal}>OK</button>
          <button style={cancelButtonStyle} onClick={handleCancelAddGoal}>Cancel</button>
        </div>
      )}

      {loading ? (
        <div style={loadingStyle}>Loading goals...</div>
      ) : tasks.length === 0 ? (
        <div style={noTasksStyle}>No goals found. Add a new goal to get started!</div>
      ) : (
        <div style={taskListStyle}>
          {tasks.map((task, index) => (
            <div key={task.id}>
              <TaskItem
                task={task}
                refreshTasks={() => authToken && fetchTasks(authToken)}
                onEditTask={handleEditTask}
                draggable={true}
                index={index}
                onAddSubGoal={handleStartAddSubGoal}
              />
              {isAddingSubGoal && subGoalParentId === task.id && (
                <div style={addSubGoalRowStyle}>
                  <input
                    type="text"
                    value={subGoalName}
                    onChange={(e) => setSubGoalName(e.target.value)}
                    placeholder="Enter your new sub-goal"
                    style={addGoalInputStyle}
                    autoFocus
                  />
                  <button style={addGoalButtonStyle} onClick={handleAddSubGoal}>OK</button>
                  <button style={cancelButtonStyle} onClick={handleCancelAddSubGoal}>Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={noteSectionStyle}>
        <h3 style={noteTitleStyle}>Summary Notes</h3>
        {noteLoading ? (
          <div style={loadingStyle}>Loading note...</div>
        ) : (
          <>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`Add your thoughts or reflections for this ${timePeriod}`}
              style={noteTextAreaStyle}
            />
            <button
              style={saveNoteButtonStyle}
              onClick={saveNote}
              disabled={noteSaving}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = saveNoteHoverStyle.backgroundColor ?? "")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = saveNoteButtonStyle.backgroundColor ?? "")}
            >
              {noteSaving ? "Saving..." : "Save Note"}
            </button>
          </>
        )}
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={true}
          onClose={() => setEditingTask(null)}
          refreshTasks={() => authToken && fetchTasks(authToken)}
        />
      )}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  flex: 1,
  padding: "20px",
  backgroundColor: "#f9f9f9",
  minHeight: "100vh",
  fontFamily: "Arial, sans-serif",
};

const headerStyle: React.CSSProperties = {
  background: "#f0f0f0",
  padding: "15px 20px",
  borderRadius: "5px",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "600",
  margin: "0",
  color: "#333",
};

const addButtonStyle: React.CSSProperties = {
  backgroundColor: "#6a0dad",
  color: "white",
  padding: "8px 15px",
  border: "none",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const addButtonHoverStyle: React.CSSProperties = {
  backgroundColor: "#5a099d",
};

const addGoalRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "4px",
  marginBottom: "20px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
};

const addSubGoalRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "4px",
  marginLeft: "20px",
  marginBottom: "5px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
};

const addGoalInputStyle: React.CSSProperties = {
  flex: 1,
  padding: "8px",
  fontSize: "14px",
  border: "1px solid #6a0dad",
  borderRadius: "4px",
  outline: "none",
};

const addGoalButtonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "8px 15px",
  border: "none",
  borderRadius: "4px",
  fontSize: "14px",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: "#6c757d",
  color: "white",
  padding: "8px 15px",
  border: "none",
  borderRadius: "4px",
  fontSize: "14px",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const taskListStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const loadingStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  color: "#666",
  marginTop: "20px",
  gap: "10px",
};

const noTasksStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#666",
  marginTop: "20px",
  fontSize: "16px",
};

const errorStyle: React.CSSProperties = {
  backgroundColor: "#f8d7da",
  color: "#721c24",
  padding: "10px 15px",
  borderRadius: "5px",
  marginBottom: "20px",
  fontSize: "14px",
  fontWeight: "500",
  textAlign: "center",
};

const noteSectionStyle: React.CSSProperties = {
  padding: "20px",
  backgroundColor: "#fff",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  marginTop: "20px",
};

const noteTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "500",
  color: "#333",
  marginBottom: "10px",
};

const noteTextAreaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "150px",
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  resize: "vertical",
  fontSize: "14px",
  outline: "none",
};

const saveNoteButtonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "8px 15px",
  border: "none",
  borderRadius: "4px",
  fontSize: "14px",
  cursor: "pointer",
  marginTop: "10px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const saveNoteHoverStyle: React.CSSProperties = {
  backgroundColor: "#0056b3",
};

export default Goals;