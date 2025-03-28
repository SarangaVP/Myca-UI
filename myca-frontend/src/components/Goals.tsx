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
















// import React, { useEffect, useState, useRef } from "react";
// import { FaPlus, FaTrash, FaFolderOpen, FaPlay, FaCheck, FaTimes } from "react-icons/fa";
// import ReactDOM from "react-dom";
// import TaskItem from "../components/TaskItem";
// import EditTaskModal from "../components/EditTaskModal";
// import { BASE_URL } from "../config";

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
//     [key: string]: any;
//   };
// }

// interface TimePeriodProps {
//   timePeriod: "life" | "year" | "month" | "week";
// }

// const StatusDropdownPortal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   statusButtonRef: React.RefObject<HTMLButtonElement | null>;
//   children: React.ReactNode;
// }> = ({ isOpen, onClose, statusButtonRef, children }) => {
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [initialClick, setInitialClick] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (!initialClick) {
//         setInitialClick(true);
//         return;
//       }

//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node) &&
//         statusButtonRef.current &&
//         !statusButtonRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     if (isOpen && statusButtonRef.current) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, onClose, statusButtonRef, initialClick]);

//   useEffect(() => {
//     if (!isOpen) {
//       setInitialClick(false);
//     }
//   }, [isOpen]);

//   if (!isOpen || !statusButtonRef.current) return null;

//   const buttonRect = statusButtonRef.current.getBoundingClientRect();
//   const scrollY = window.scrollY;
//   const viewportHeight = window.innerHeight;
//   const dropdownHeight = 120;

//   const isCutOff = buttonRect.bottom + dropdownHeight + scrollY > viewportHeight + scrollY;
//   const topPosition = isCutOff
//     ? `${buttonRect.top + scrollY - dropdownHeight - 5}px`
//     : `${buttonRect.bottom + scrollY + 5}px`;

//   return ReactDOM.createPortal(
//     <div
//       ref={dropdownRef}
//       style={{
//         position: "absolute",
//         top: topPosition,
//         left: `${buttonRect.left}px`,
//         zIndex: 20000,
//         minWidth: "120px",
//         boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//         backgroundColor: "#fff",
//         borderRadius: "6px",
//         border: "1px solid #ddd",
//         padding: "2px 0",
//         fontSize: "12px",
//         animation: "fadeIn 0.2s ease-in",
//       }}
//     >
//       {children}
//     </div>,
//     document.body
//   );
// };

// const Goals: React.FC<TimePeriodProps> = ({ timePeriod }) => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [associatedItems, setAssociatedItems] = useState<{ [goalId: string]: Task[] }>({});
//   const [loading, setLoading] = useState(true);
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [authToken, setAuthToken] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isAddingGoal, setIsAddingGoal] = useState(false);
//   const [newGoalName, setNewGoalName] = useState("");
//   const [isAddingSubGoal, setIsAddingSubGoal] = useState(false);
//   const [subGoalName, setSubGoalName] = useState("");
//   const [subGoalParentId, setSubGoalParentId] = useState<string | null>(null);
//   const [note, setNote] = useState<string>("");
//   const [noteLoading, setNoteLoading] = useState(true);
//   const [noteSaving, setNoteSaving] = useState(false);
//   const [isAssociatingTasks, setIsAssociatingTasks] = useState(false);
//   const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
//   const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
//   const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
//   const [statusDropdownOpen, setStatusDropdownOpen] = useState<{ [itemId: string]: boolean }>({});

//   const today = new Date();
//   const formattedDate = today.toISOString().split("T")[0];

//   const statusButtonRefs = useRef<{ [itemId: string]: HTMLButtonElement | null }>({});

//   const getDisplayText = () => {
//     switch (timePeriod) {
//       case "year":
//         return today.getFullYear().toString();
//       case "month":
//         return today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
//       case "week": {
//         const weekStart = new Date(today);
//         weekStart.setDate(today.getDate() - today.getDay() + 1);
//         const weekEnd = new Date(today);
//         weekEnd.setDate(today.getDate() + (7 - today.getDay()));
//         return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
//       }
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

//   const getStatusColor = (status?: string) => {
//     switch (status?.toLowerCase()) {
//       case "running":
//         return "#007bff";
//       case "done":
//         return "#28a745";
//       case "canceled":
//         return "#dc3545";
//       case "open":
//       default:
//         return "#fff";
//     }
//   };

//   const getStatusIcon = (status?: string) => {
//     switch (status?.toLowerCase()) {
//       case "running":
//         return <FaPlay size={10} style={{ marginRight: "4px" }} />;
//       case "done":
//         return <FaCheck size={10} style={{ marginRight: "4px" }} />;
//       case "canceled":
//         return <FaTimes size={10} style={{ marginRight: "4px" }} />;
//       case "open":
//       default:
//         return <FaFolderOpen size={10} style={{ marginRight: "4px" }} />;
//     }
//   };

//   const handleStatusChange = async (itemId: string, newStatus: string, goalId: string) => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       setError("Authentication token not found. Please log in.");
//       return;
//     }

//     const today = new Date().toISOString().split("T")[0];
//     const item = associatedItems[goalId]?.find((i) => i.id === itemId);
//     if (!item) return;

//     const updateData = {
//       date: today,
//       item_id: itemId,
//       new_name: item.name,
//       new_type: item.context?.itype || "task",
//       new_status: newStatus,
//       isFocused: item.isFocused,
//     };

//     try {
//       const response = await fetch(`${BASE_URL}/updateItem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify(updateData),
//       });

//       if (response.ok) {
//         await fetchAssociatedItems(goalId, token);
//         setStatusDropdownOpen((prev) => ({ ...prev, [itemId]: false }));
//       } else {
//         console.error("Failed to update status");
//         setError("Failed to update status.");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       setError("Error updating status.");
//     }
//   };

//   const fetchTasks = async (token: string) => {
//     setLoading(true);
//     console.log(`Fetching tasks for ${timePeriod} with token:`, token);
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

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log(`Tasks data received for ${timePeriod}:`, data);
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

//         // Fetch associated items for each goal and sub-goal
//         const fetchAllAssociatedItems = async (task: Task) => {
//           await fetchAssociatedItems(task.id, token);
//           if (task.children) {
//             for (const child of task.children) {
//               await fetchAllAssociatedItems(child);
//             }
//           }
//         };

//         for (const task of rootTasks) {
//           await fetchAllAssociatedItems(task);
//         }
//       } else {
//         setTasks([]);
//       }
//     } catch (error) {
//       console.error(`Error fetching tasks for ${timePeriod}:`, error);
//       setTasks([]);
//       setError("Failed to load tasks. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAssociatedItems = async (goalId: string, token: string) => {
//     try {
//       console.log(`Fetching associated items for goal ${goalId}...`);
//       const response = await fetch(`${BASE_URL}/getAssociatedItems`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           goal_id: goalId,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch associated items: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       console.log(`Associated items for goal ${goalId}:`, data);

//       if (data.status === 200 && data.reports && Array.isArray(data.reports)) {
//         const reportItems = Array.isArray(data.reports[0]) ? data.reports[0] : [];
//         const associatedTasks = reportItems.map((item: any) => ({
//           id: String(item.id),
//           name: item.context?.name || `Task ${item.id}`,
//           isFocused: item.context?.is_focused || false,
//           isSnoozed: item.context?.is_snoozed || false,
//           note: item.context?.note || "",
//           children: [],
//           parentId: item.context?.parent_item_id || null,
//           context: {
//             status: item.context?.status || "open",
//             itype: item.context?.itype || "task",
//             name: item.context?.name || `Task ${item.id}`,
//             parent_item_id: item.context?.parent_item_id || "",
//             note: item.context?.note || "",
//             is_focused: item.context?.is_focused || false,
//             is_snoozed: item.context?.is_snoozed || false,
//             ritual: item.context?.ritual || {
//               start: "",
//               frequency: "",
//               ritual_flag: false,
//               interval: 1,
//               by_day_of_week: [false, false, false, false, false, false, false],
//               by_day_of_month: 0,
//               occurrence: 0,
//               end: "",
//             },
//             last_updated: item.context?.last_updated || "",
//             snoozed_till: item.context?.snoozed_till || "",
//           },
//         }));
//         setAssociatedItems((prev) => ({
//           ...prev,
//           [goalId]: associatedTasks,
//         }));
//       } else {
//         setAssociatedItems((prev) => ({
//           ...prev,
//           [goalId]: [],
//         }));
//       }
//     } catch (error) {
//       console.error(`Error fetching associated items for goal ${goalId}:`, error);
//       setAssociatedItems((prev) => ({
//         ...prev,
//         [goalId]: [],
//       }));
//       setError(`Failed to fetch associated items for goal ${goalId}.`);
//     }
//   };

//   const fetchAvailableTasks = async (token: string) => {
//     try {
//       console.log("Fetching available tasks...");
//       const response = await fetch(`${BASE_URL}/getItems`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date_input: formattedDate,
//           items_list: [],
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch tasks: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("Available tasks:", data);

//       if (data.status === 200 && data.reports && Array.isArray(data.reports)) {
//         const reportItems = Array.isArray(data.reports[0]) ? data.reports[0] : [];
//         const tasks = reportItems.map((item: any) => ({
//           id: String(item.id),
//           name: item.context?.name || `Task ${item.id}`,
//           isFocused: item.context?.is_focused || false,
//           isSnoozed: item.context?.is_snoozed || false,
//           note: item.context?.note || "",
//           children: [],
//           parentId: item.context?.parent_item_id || null,
//           context: {
//             status: item.context?.status || "open",
//             itype: item.context?.itype || "task",
//             name: item.context?.name || `Task ${item.id}`,
//             parent_item_id: item.context?.parent_item_id || "",
//             note: item.context?.note || "",
//             is_focused: item.context?.is_focused || false,
//             is_snoozed: item.context?.is_snoozed || false,
//             ritual: item.context?.ritual || {
//               start: "",
//               frequency: "",
//               ritual_flag: false,
//               interval: 1,
//               by_day_of_week: [false, false, false, false, false, false, false],
//               by_day_of_month: 0,
//               occurrence: 0,
//               end: "",
//             },
//             last_updated: item.context?.last_updated || "",
//             snoozed_till: item.context?.snoozed_till || "",
//           },
//         }));
//         setAvailableTasks(tasks);
//       } else {
//         setAvailableTasks([]);
//       }
//     } catch (error) {
//       console.error("Error fetching available tasks:", error);
//       setAvailableTasks([]);
//       setError("Failed to fetch available tasks.");
//     }
//   };

//   const handleAssociateTasks = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       setError("Authentication token not found. Please log in.");
//       return;
//     }

//     if (!selectedGoalId) {
//       setError("No goal selected for association.");
//       return;
//     }

//     if (selectedTasks.length === 0) {
//       setError("No tasks selected for association.");
//       return;
//     }

//     try {
//       console.log("Associating tasks with goal:", selectedGoalId, selectedTasks);
//       const response = await fetch(`${BASE_URL}/associatedItemsToGoal`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           goal_id: selectedGoalId,
//           associated_items_id: selectedTasks,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to associate tasks: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("Association response:", data);

//       if (data.status === 200) {
//         await fetchAssociatedItems(selectedGoalId, token);
//         setIsAssociatingTasks(false);
//         setSelectedGoalId(null);
//         setSelectedTasks([]);
//         setError(null);
//       } else {
//         throw new Error("Failed to associate tasks.");
//       }
//     } catch (error) {
//       console.error("Error associating tasks:", error);
//       setError("Failed to associate tasks.");
//     }
//   };

//   const handleUnassociateTask = async (goalId: string, taskId: string) => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       setError("Authentication token not found. Please log in.");
//       return;
//     }

//     try {
//       console.log(`Unassociating task ${taskId} from goal ${goalId}...`);
//       const response = await fetch(`${BASE_URL}/unassociatedItemsToGoal`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           goal_id: goalId,
//           unassociated_items_id: [taskId],
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to unassociate task: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("Unassociation response:", data);

//       if (data.status === 200) {
//         await fetchAssociatedItems(goalId, token);
//         setError(null);
//       } else {
//         throw new Error("Failed to unassociate task.");
//       }
//     } catch (error) {
//       console.error("Error unassociating task:", error);
//       setError("Failed to unassociate task.");
//     }
//   };

//   const fetchNote = async (token: string) => {
//     setNoteLoading(true);
//     console.log(`Fetching note from ${BASE_URL}/addEnvisionNotes for ${timePeriod} with token:`, token);
//     console.log("Request body:", { date: formattedDate, note: "", time_period: timePeriod });
//     try {
//       const response = await fetch(`${BASE_URL}/addEnvisionNotes`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({ date: formattedDate, note: "", time_period: timePeriod }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`Fetch note failed: Status ${response.status}, Response: ${errorText}`);
//         throw new Error(`Failed to fetch note: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       console.log(`Note data received for ${timePeriod}:`, data);

//       if (data.status === 200) {
//         const existingNote = data.reports?.length > 0 ? data.reports[0].context.note || "" : data.note || "";
//         setNote(existingNote);
//       } else {
//         setNote("");
//       }
//     } catch (error) {
//       console.error("Error fetching note:", error);
//       setNote("");
//       setError("Failed to load note due to a server error. Please try again.");
//     } finally {
//       setNoteLoading(false);
//     }
//   };

//   const saveNote = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       setError("Authentication token not found. Please log in.");
//       return;
//     }

//     setNoteSaving(true);
//     console.log(`Saving note to ${BASE_URL}/addEnvisionNotes for ${timePeriod} with token:`, token);
//     console.log("Request body:", { date: formattedDate, note, time_period: timePeriod });
//     try {
//       const response = await fetch(`${BASE_URL}/addEnvisionNotes`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({ date: formattedDate, note: note, time_period: timePeriod }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`Save note failed: Status ${response.status}, Response: ${errorText}`);
//         throw new Error(`Failed to save note: ${response.status} - ${errorText}`);
//       }

//       console.log("Note saved successfully!");
//     } catch (error) {
//       console.error("Error saving note:", error);
//       setError("Failed to save note due to a server error. Please try again.");
//     } finally {
//       setNoteSaving(false);
//     }
//   };

//   const handleAddGoal = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token || !newGoalName.trim()) {
//       setError(!token ? "Authentication token not found." : "Goal name cannot be empty.");
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/createGoal`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           goal_name: newGoalName.trim(),
//           goal_period: timePeriod,
//           parent_goal_id: "",
//         }),
//       });

//       if (!response.ok) throw new Error(`Failed to create goal: ${response.status}`);
//       await response.json();
//       fetchTasks(token);
//       setIsAddingGoal(false);
//       setNewGoalName("");
//       setError(null);
//     } catch (error) {
//       console.error("Error creating goal:", error);
//       setError("Failed to create goal.");
//     }
//   };

//   const handleAddSubGoal = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token || !subGoalName.trim() || !subGoalParentId) {
//       setError(
//         !token
//           ? "Authentication token not found."
//           : !subGoalName.trim()
//           ? "Sub-goal name cannot be empty."
//           : "Parent goal ID missing."
//       );
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/createGoal`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           goal_name: subGoalName.trim(),
//           goal_period: timePeriod,
//           parent_goal_id: subGoalParentId,
//         }),
//       });

//       if (!response.ok) throw new Error(`Failed to create sub-goal: ${response.status}`);
//       await response.json();
//       fetchTasks(token);
//       setIsAddingSubGoal(false);
//       setSubGoalName("");
//       setSubGoalParentId(null);
//       setError(null);
//     } catch (error) {
//       console.error("Error creating sub-goal:", error);
//       setError("Failed to create sub-goal.");
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

//   const handleCancelAssociateTasks = () => {
//     setIsAssociatingTasks(false);
//     setSelectedGoalId(null);
//     setSelectedTasks([]);
//     setError(null);
//   };

//   const handleEditTask = (task: Task) => setEditingTask(task);

//   const handleStartAddSubGoal = (parentId: string) => {
//     setIsAddingSubGoal(true);
//     setSubGoalParentId(parentId);
//   };

//   const handleStartAssociateTasks = (goalId: string) => {
//     setSelectedGoalId(goalId);
//     setIsAssociatingTasks(true);
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (token) {
//       fetchAvailableTasks(token);
//     }
//   };

//   const handleTaskSelection = (taskId: string) => {
//     setSelectedTasks((prev) =>
//       prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
//     );
//   };

//   useEffect(() => {
//     console.log(`Component mounted for ${timePeriod}. Checking auth token...`);
//     const token = localStorage.getItem("AUTH_TOKEN");
//     setAuthToken(token);

//     if (token) {
//       console.log(`Token found: ${token}. Fetching data with delay...`);
//       fetchTasks(token);
//       const noteDelay = setTimeout(() => {
//         fetchNote(token);
//       }, 1000);
//       return () => clearTimeout(noteDelay);
//     } else {
//       console.warn("No auth token found on mount. Please log in.");
//       setLoading(false);
//       setNoteLoading(false);
//       setError("Please log in to view goals and notes.");
//     }
//   }, [timePeriod]);

//   useEffect(() => {
//     console.log(`Tasks updated for ${timePeriod}:`, tasks);
//   }, [tasks]);

//   useEffect(() => {
//     console.log(`Note updated for ${timePeriod}:`, note);
//   }, [note]);

//   useEffect(() => {
//     console.log("Associated items updated:", associatedItems);
//   }, [associatedItems]);

//   const RenderTaskItem: React.FC<{
//     task: Task;
//     index: number;
//     depth?: number;
//   }> = ({ task, index, depth = 0 }) => {
//     return (
//       <div key={task.id} style={goalItemWrapperStyle}>
//         <div style={{ ...goalItemContainerStyle, marginLeft: depth * 20 }}>
//           <TaskItem
//             task={task}
//             refreshTasks={() => authToken && fetchTasks(authToken)}
//             onEditTask={handleEditTask}
//             draggable={true}
//             index={index}
//             onAddSubGoal={handleStartAddSubGoal}
//             className="goals-task-item"
//           />
//           <button
//             style={associateButtonStyle}
//             onClick={() => handleStartAssociateTasks(task.id)}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = associateButtonHoverStyle.backgroundColor ?? "")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = associateButtonStyle.backgroundColor ?? "")}
//           >
//             <FaPlus style={{ marginRight: "6px" }} /> Associate Tasks
//           </button>
//         </div>
//         {isAddingSubGoal && subGoalParentId === task.id && (
//           <div style={{ ...addSubGoalRowStyle, marginLeft: (depth + 1) * 20 }}>
//             <input
//               type="text"
//               value={subGoalName}
//               onChange={(e) => setSubGoalName(e.target.value)}
//               placeholder="Enter your new sub-goal"
//               style={addGoalInputStyle}
//               autoFocus
//             />
//             <button style={addGoalButtonStyle} onClick={handleAddSubGoal}>Add</button>
//             <button style={cancelButtonStyle} onClick={handleCancelAddSubGoal}>Cancel</button>
//           </div>
//         )}
//         {associatedItems[task.id] && associatedItems[task.id].length > 0 ? (
//           <div style={{ ...associatedItemsContainerStyle, marginLeft: (depth + 1) * 20 }}>
//             <h4 style={associatedItemsTitleStyle}>Associated Items</h4>
//             <div style={associatedItemsListStyle}>
//               {associatedItems[task.id].map((item) => (
//                 <div key={item.id} style={associatedItemStyle}>
//                   <div style={associatedItemContentStyle}>
//                     <span style={associatedItemTextStyle}>{item.name}</span>
//                     <div style={{ position: "relative", display: "inline-block" }}>
//                       <button
//                         ref={(el) => (statusButtonRefs.current[item.id] = el)}
//                         onClick={() =>
//                           setStatusDropdownOpen((prev) => ({
//                             ...prev,
//                             [item.id]: !prev[item.id],
//                           }))
//                         }
//                         style={{
//                           padding: "4px 12px",
//                           borderRadius: "5px",
//                           border: "1px solid #ccc",
//                           fontSize: "12px",
//                           fontWeight: 500,
//                           cursor: "pointer",
//                           width: "90px",
//                           textAlign: "center",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           transition: "box-shadow 0.2s ease-in-out",
//                           boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//                           backgroundColor: getStatusColor(item.context?.status),
//                           color: item.context?.status === "open" ? "#555" : "#fff",
//                         }}
//                       >
//                         {getStatusIcon(item.context?.status)}
//                         {item.context?.status
//                           ? item.context.status.charAt(0).toUpperCase() + item.context.status.slice(1)
//                           : "Open"}
//                       </button>
//                       <StatusDropdownPortal
//                         isOpen={statusDropdownOpen[item.id] || false}
//                         onClose={() =>
//                           setStatusDropdownOpen((prev) => ({ ...prev, [item.id]: false }))
//                         }
//                         statusButtonRef={{
//                           current: statusButtonRefs.current[item.id],
//                         }}
//                       >
//                         <button
//                           onClick={() => handleStatusChange(item.id, "open", task.id)}
//                           style={{
//                             backgroundColor: "transparent",
//                             color: "#333",
//                             padding: "4px 8px",
//                             border: "none",
//                             cursor: "pointer",
//                             textAlign: "left",
//                             width: "100%",
//                             transition: "background-color 0.2s ease-in-out",
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "4px",
//                           }}
//                         >
//                           <FaFolderOpen size={10} style={{ marginRight: "2px" }} /> Open
//                         </button>
//                         <button
//                           onClick={() => handleStatusChange(item.id, "running", task.id)}
//                           style={{
//                             backgroundColor: "transparent",
//                             color: "#333",
//                             padding: "4px 8px",
//                             border: "none",
//                             cursor: "pointer",
//                             textAlign: "left",
//                             width: "100%",
//                             transition: "background-color 0.2s ease-in-out",
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "4px",
//                           }}
//                         >
//                           <FaPlay size={10} style={{ marginRight: "2px" }} /> Running
//                         </button>
//                         <button
//                           onClick={() => handleStatusChange(item.id, "done", task.id)}
//                           style={{
//                             backgroundColor: "transparent",
//                             color: "#333",
//                             padding: "4px 8px",
//                             border: "none",
//                             cursor: "pointer",
//                             textAlign: "left",
//                             width: "100%",
//                             transition: "background-color 0.2s ease-in-out",
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "4px",
//                           }}
//                         >
//                           <FaCheck size={10} style={{ marginRight: "2px" }} /> Completed
//                         </button>
//                         <button
//                           onClick={() => handleStatusChange(item.id, "canceled", task.id)}
//                           style={{
//                             backgroundColor: "transparent",
//                             color: "#333",
//                             padding: "4px 8px",
//                             border: "none",
//                             cursor: "pointer",
//                             textAlign: "left",
//                             width: "100%",
//                             transition: "background-color 0.2s ease-in-out",
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "4px",
//                           }}
//                         >
//                           <FaTimes size={10} style={{ marginRight: "2px" }} /> Canceled
//                         </button>
//                       </StatusDropdownPortal>
//                     </div>
//                   </div>
//                   <button
//                     style={unassociateButtonStyle}
//                     onClick={() => handleUnassociateTask(task.id, item.id)}
//                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = unassociateButtonHoverStyle.backgroundColor ?? "")}
//                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = unassociateButtonStyle.backgroundColor ?? "")}
//                   >
//                     <FaTrash size={14} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div style={{ ...noAssociatedItemsStyle, marginLeft: (depth + 1) * 20 }}>
//             No associated items for this goal.
//           </div>
//         )}
//         {task.children && task.children.length > 0 && (
//           <div style={{ marginLeft: (depth + 1) * 20 }}>
//             {task.children.map((child, childIndex) => (
//               <RenderTaskItem
//                 key={child.id}
//                 task={child}
//                 index={childIndex}
//                 depth={depth + 1}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div style={containerStyle} className="goals-container">
//       <style>
//         {`
//           .goals-task-item .task-container {
//             width: 1100px;
//           }
//         `}
//       </style>
//       <header style={headerStyle} className="goals-header">
//         <h2 style={titleStyle} className="goals-title">{getHeaderTitle()}</h2>
//         {!isAddingGoal && (
//           <button
//             style={addButtonStyle}
//             onClick={() => setIsAddingGoal(true)}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = addButtonHoverStyle.backgroundColor ?? "")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = addButtonStyle.backgroundColor ?? "")}
//           >
//             + Add Goal
//           </button>
//         )}
//       </header>

//       {error && <div style={errorStyle}>{error}</div>}

//       {isAddingGoal && (
//         <div style={addGoalRowStyle}>
//           <input
//             type="text"
//             value={newGoalName}
//             onChange={(e) => setNewGoalName(e.target.value)}
//             placeholder={`Enter your new ${timePeriod} goal`}
//             style={addGoalInputStyle}
//             autoFocus
//           />
//           <button style={addGoalButtonStyle} onClick={handleAddGoal}>Add</button>
//           <button style={cancelButtonStyle} onClick={handleCancelAddGoal}>Cancel</button>
//         </div>
//       )}

//       {loading ? (
//         <div style={loadingStyle}>Loading goals...</div>
//       ) : tasks.length === 0 ? (
//         <div style={noTasksStyle}>No goals found. Add a new goal to get started!</div>
//       ) : (
//         <div style={taskListStyle}>
//           {tasks.map((task, index) => (
//             <RenderTaskItem key={task.id} task={task} index={index} depth={0} />
//           ))}
//         </div>
//       )}

//       {isAssociatingTasks && selectedGoalId && (
//         <div style={modalOverlayStyle}>
//           <div style={modalStyle}>
//             <h3 style={modalTitleStyle}>Associate Tasks with Goal</h3>
//             {availableTasks.length === 0 ? (
//               <p style={modalMessageStyle}>No tasks available to associate.</p>
//             ) : (
//               <div style={taskSelectionListStyle}>
//                 {availableTasks.map((task) => (
//                   <div key={task.id} style={taskSelectionItemStyle}>
//                     <input
//                       type="checkbox"
//                       checked={selectedTasks.includes(task.id)}
//                       onChange={() => handleTaskSelection(task.id)}
//                       style={checkboxStyle}
//                     />
//                     <span style={taskSelectionTextStyle}>{task.name}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <div style={modalButtonRowStyle}>
//               <button
//                 style={addGoalButtonStyle}
//                 onClick={handleAssociateTasks}
//                 disabled={selectedTasks.length === 0}
//               >
//                 Associate
//               </button>
//               <button style={cancelButtonStyle} onClick={handleCancelAssociateTasks}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div style={noteSectionStyle}>
//         <h3 style={noteTitleStyle}>Summary Notes</h3>
//         {noteLoading ? (
//           <div style={loadingStyle}>Loading note...</div>
//         ) : (
//           <>
//             <textarea
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               placeholder={`Add your thoughts or reflections for this ${timePeriod}`}
//               style={noteTextAreaStyle}
//             />
//             <button
//               style={saveNoteButtonStyle}
//               onClick={saveNote}
//               disabled={noteSaving}
//               onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = saveNoteHoverStyle.backgroundColor ?? "")}
//               onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = saveNoteButtonStyle.backgroundColor ?? "")}
//             >
//               {noteSaving ? "Saving..." : "Save Note"}
//             </button>
//           </>
//         )}
//       </div>

//       {editingTask && (
//         <EditTaskModal
//           task={editingTask}
//           isOpen={true}
//           onClose={() => setEditingTask(null)}
//           refreshTasks={() => authToken && fetchTasks(authToken)}
//         />
//       )}
//     </div>
//   );
// };

// // Styles
// const containerStyle: React.CSSProperties = {
//   flex: 1,
//   padding: "30px",
//   backgroundColor: "#f5f7fa",
//   minHeight: "100vh",
//   fontFamily: "'Inter', sans-serif",
// };

// const headerStyle: React.CSSProperties = {
//   background: "#ffffff",
//   padding: "20px",
//   borderRadius: "10px",
//   marginBottom: "30px",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
// };

// const titleStyle: React.CSSProperties = {
//   fontSize: "28px",
//   fontWeight: 700,
//   margin: 0,
//   color: "#1a1a1a",
// };

// const addButtonStyle: React.CSSProperties = {
//   backgroundColor: "#6a0dad",
//   color: "white",
//   padding: "10px 20px",
//   border: "none",
//   borderRadius: "8px",
//   fontSize: "16px",
//   fontWeight: 600,
//   cursor: "pointer",
//   boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
//   transition: "background-color 0.2s ease-in-out, transform 0.1s ease-in-out",
// };

// const addButtonHoverStyle: React.CSSProperties = {
//   backgroundColor: "#5a099d",
// };

// const goalItemWrapperStyle: React.CSSProperties = {
//   marginBottom: "30px",
// };

// const goalItemContainerStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   padding: "10px 15px",
//   backgroundColor: "#ffffff",
//   borderRadius: "10px",
//   boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
//   minWidth: "1100px",
// };

// const associateButtonStyle: React.CSSProperties = {
//   backgroundColor: "#28a745",
//   color: "white",
//   padding: "8px 16px",
//   border: "none",
//   borderRadius: "8px",
//   fontSize: "14px",
//   fontWeight: 600,
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   transition: "background-color 0.2s ease-in-out, transform 0.1s ease-in-out",
// };

// const associateButtonHoverStyle: React.CSSProperties = {
//   backgroundColor: "#218838",
// };

// const associatedItemsContainerStyle: React.CSSProperties = {
//   marginTop: "15px",
//   padding: "15px",
//   backgroundColor: "#fafafa",
//   borderRadius: "8px",
//   borderLeft: "3px solid #6a0dad",
// };

// const associatedItemsTitleStyle: React.CSSProperties = {
//   fontSize: "16px",
//   fontWeight: 600,
//   color: "#6a0dad",
//   marginBottom: "12px",
// };

// const associatedItemsListStyle: React.CSSProperties = {
//   display: "flex",
//   flexDirection: "column",
//   gap: "10px",
// };

// const associatedItemStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   padding: "10px 15px",
//   backgroundColor: "#ffffff",
//   borderRadius: "6px",
//   boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
//   transition: "transform 0.1s ease-in-out",
// };

// const associatedItemContentStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   gap: "15px",
//   flex: 1,
// };

// const associatedItemTextStyle: React.CSSProperties = {
//   fontSize: "15px",
//   fontWeight: 500,
//   color: "#333",
// };

// const unassociateButtonStyle: React.CSSProperties = {
//   backgroundColor: "#dc3545",
//   color: "white",
//   padding: "6px 10px",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//   transition: "background-color 0.2s ease-in-out",
// };

// const unassociateButtonHoverStyle: React.CSSProperties = {
//   backgroundColor: "#c82333",
// };

// const addGoalRowStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   gap: "15px",
//   padding: "15px",
//   backgroundColor: "#ffffff",
//   border: "1px solid #e0e0e0",
//   borderRadius: "8px",
//   marginBottom: "30px",
//   boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
// };

// const addSubGoalRowStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   gap: "15px",
//   padding: "15px",
//   backgroundColor: "#ffffff",
//   border: "1px solid #e0e0e0",
//   borderRadius: "8px",
//   marginTop: "10px",
//   marginBottom: "15px",
//   boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
// };

// const addGoalInputStyle: React.CSSProperties = {
//   flex: 1,
//   padding: "10px",
//   fontSize: "15px",
//   border: "1px solid #d0d0d0",
//   borderRadius: "6px",
//   outline: "none",
//   transition: "border-color 0.2s ease-in-out",
// };

// const addGoalButtonStyle: React.CSSProperties = {
//   backgroundColor: "#007bff",
//   color: "white",
//   padding: "10px 20px",
//   border: "none",
//   borderRadius: "6px",
//   fontSize: "15px",
//   fontWeight: 600,
//   cursor: "pointer",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   transition: "background-color 0.2s ease-in-out, transform 0.1s ease-in-out",
// };

// const cancelButtonStyle: React.CSSProperties = {
//   backgroundColor: "#6c757d",
//   color: "white",
//   padding: "10px 20px",
//   border: "none",
//   borderRadius: "6px",
//   fontSize: "15px",
//   fontWeight: 600,
//   cursor: "pointer",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   transition: "background-color 0.2s ease-in-out, transform 0.1s ease-in-out",
// };

// const taskListStyle: React.CSSProperties = {
//   marginBottom: "40px",
// };

// const loadingStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: "16px",
//   fontWeight: 500,
//   color: "#666",
//   marginTop: "30px",
//   gap: "10px",
// };

// const noTasksStyle: React.CSSProperties = {
//   textAlign: "center",
//   color: "#666",
//   marginTop: "30px",
//   fontSize: "16px",
//   fontWeight: 500,
// };

// const noAssociatedItemsStyle: React.CSSProperties = {
//   marginTop: "15px",
//   color: "#888",
//   fontSize: "14px",
//   fontStyle: "italic",
// };

// const errorStyle: React.CSSProperties = {
//   backgroundColor: "#f8d7da",
//   color: "#721c24",
//   padding: "12px 20px",
//   borderRadius: "8px",
//   marginBottom: "30px",
//   fontSize: "15px",
//   fontWeight: 500,
//   textAlign: "center",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
// };

// const noteSectionStyle: React.CSSProperties = {
//   padding: "25px",
//   backgroundColor: "#ffffff",
//   borderRadius: "10px",
//   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
//   marginTop: "40px",
//   border: "1px solid #e0e0e0",
// };

// const noteTitleStyle: React.CSSProperties = {
//   fontSize: "20px",
//   fontWeight: 600,
//   color: "#1a1a1a",
//   marginBottom: "15px",
// };

// const noteTextAreaStyle: React.CSSProperties = {
//   width: "100%",
//   minHeight: "180px",
//   padding: "15px",
//   borderRadius: "8px",
//   border: "1px solid #d0d0d0",
//   resize: "vertical",
//   fontSize: "15px",
//   fontFamily: "'Inter', sans-serif",
//   outline: "none",
//   transition: "border-color 0.2s ease-in-out",
// };

// const saveNoteButtonStyle: React.CSSProperties = {
//   backgroundColor: "#007bff",
//   color: "white",
//   padding: "10px 20px",
//   border: "none",
//   borderRadius: "8px",
//   fontSize: "15px",
//   fontWeight: 600,
//   cursor: "pointer",
//   marginTop: "15px",
//   boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//   transition: "background-color 0.2s ease-in-out, transform 0.1s ease-in-out",
// };

// const saveNoteHoverStyle: React.CSSProperties = {
//   backgroundColor: "#0056b3",
// };

// const modalOverlayStyle: React.CSSProperties = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.6)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };

// const modalStyle: React.CSSProperties = {
//   backgroundColor: "#ffffff",
//   padding: "30px",
//   borderRadius: "12px",
//   width: "450px",
//   maxHeight: "80vh",
//   overflowY: "auto",
//   boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
// };

// const modalTitleStyle: React.CSSProperties = {
//   fontSize: "20px",
//   fontWeight: 600,
//   color: "#1a1a1a",
//   marginBottom: "20px",
// };

// const modalMessageStyle: React.CSSProperties = {
//   fontSize: "15px",
//   color: "#666",
//   marginBottom: "20px",
//   textAlign: "center",
// };

// const taskSelectionListStyle: React.CSSProperties = {
//   margin: "15px 0",
//   maxHeight: "300px",
//   overflowY: "auto",
//   padding: "10px",
//   backgroundColor: "rgba(0, 0, 0, 0.05)",
//   borderRadius: "8px",
//   border: "1px solid #e0e0e0",
// };

// const taskSelectionItemStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   gap: "12px",
//   padding: "8px 10px",
//   borderBottom: "1px solid #e0e0e0",
//   transition: "background-color 0.2s ease-in-out",
// };

// const taskSelectionTextStyle: React.CSSProperties = {
//   fontSize: "15px",
//   color: "#333",
// };

// const checkboxStyle: React.CSSProperties = {
//   width: "18px",
//   height: "18px",
//   cursor: "pointer",
// };

// const modalButtonRowStyle: React.CSSProperties = {
//   display: "flex",
//   justifyContent: "flex-end",
//   gap: "15px",
//   marginTop: "25px",
// };

// export default Goals;
















// import React, { useEffect, useState } from "react";
// import TaskItem from "../components/TaskItem";
// import EditTaskModal from "../components/EditTaskModal";
// import { BASE_URL } from "../config";
// import ReactDOM from "react-dom";

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
//     [key: string]: any;
//   };
// }

// interface TimePeriodProps {
//   timePeriod: "life" | "year" | "month" | "week";
// }

// // Modal for displaying and managing plan items with association/unassociation
// const ItemsModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   items: Task[];
//   selectedGoalId: string | null;
//   associatedItems: Task[];
//   onAssociate: (itemId: string) => Promise<void>;
//   onUnassociate: (itemId: string) => Promise<void>;
// }> = ({ isOpen, onClose, items, selectedGoalId, associatedItems, onAssociate, onUnassociate }) => {
//   if (!isOpen || !selectedGoalId) return null;

//   const associatedItemIds = associatedItems.map((item) => item.id);

//   // Recursive component to render tasks with checkboxes
//   const TaskTree: React.FC<{ task: Task; level?: number }> = ({ task, level = 0 }) => {
//     const isAssociated = associatedItemIds.includes(task.id);

//     const handleCheckboxChange = async () => {
//       if (isAssociated) {
//         await onUnassociate(task.id);
//       } else {
//         await onAssociate(task.id);
//       }
//     };

//     return (
//       <div style={{ marginLeft: `${level * 20}px` }}>
//         <div style={{ padding: "8px 0", borderBottom: "1px solid #eee", display: "flex", alignItems: "center" }}>
//           <input
//             type="checkbox"
//             checked={isAssociated}
//             onChange={handleCheckboxChange}
//             style={{ marginRight: "10px" }}
//           />
//           {task.name}
//         </div>
//         {task.children && task.children.length > 0 && (
//           <div>
//             {task.children.map((child) => (
//               <TaskTree key={child.id} task={child} level={level + 1} />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return ReactDOM.createPortal(
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 20001,
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: "#fff",
//           padding: "20px",
//           borderRadius: "8px",
//           maxWidth: "500px",
//           width: "100%",
//           maxHeight: "80vh",
//           overflowY: "auto",
//         }}
//       >
//         <h3>Associate Items for Goal</h3>
//         {items.length === 0 ? (
//           <p>No items found.</p>
//         ) : (
//           <div style={{ listStyle: "none", padding: 0 }}>
//             {items.map((item) => (
//               <TaskTree key={item.id} task={item} />
//             ))}
//           </div>
//         )}
//         <button onClick={onClose} style={{ marginTop: "10px", padding: "5px 10px" }}>
//           Close
//         </button>
//       </div>
//     </div>,
//     document.body
//   );
// };

// const Goals: React.FC<TimePeriodProps> = ({ timePeriod }) => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [authToken, setAuthToken] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isAddingGoal, setIsAddingGoal] = useState(false);
//   const [newGoalName, setNewGoalName] = useState("");
//   const [isAddingSubGoal, setIsAddingSubGoal] = useState(false);
//   const [subGoalName, setSubGoalName] = useState("");
//   const [subGoalParentId, setSubGoalParentId] = useState<string | null>(null);
//   const [note, setNote] = useState<string>("");
//   const [noteLoading, setNoteLoading] = useState(true);
//   const [noteSaving, setNoteSaving] = useState(false);
//   const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
//   const [planItems, setPlanItems] = useState<Task[]>([]);
//   const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
//   const [associatedItems, setAssociatedItems] = useState<{ [goalId: string]: Task[] }>({});

//   const today = new Date();
//   const formattedDate = today.toISOString().split("T")[0];

//   const getDisplayText = () => {
//     switch (timePeriod) {
//       case "year": return today.getFullYear().toString();
//       case "month": return today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
//       case "week": {
//         const weekStart = new Date(today);
//         weekStart.setDate(today.getDate() - today.getDay() + 1);
//         const weekEnd = new Date(today);
//         weekEnd.setDate(today.getDate() + (7 - today.getDay()));
//         return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
//       }
//       case "life": return "Life Goals";
//       default: return "";
//     }
//   };

//   const getHeaderTitle = () => {
//     switch (timePeriod) {
//       case "life": return "Life Goals";
//       case "week": return "Weekly Goals";
//       case "month": return "Monthly Goals";
//       case "year": return "Yearly Goals";
//       default: return "Goals";
//     }
//   };

//   const fetchTasks = async (token: string) => {
//     setLoading(true);
//     console.log(`Fetching tasks for ${timePeriod} with token:`, token);
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

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log(`Tasks data received for ${timePeriod}:`, data);
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
//               start: "", frequency: "", ritual_flag: false, interval: 1,
//               by_day_of_week: [false, false, false, false, false, false, false],
//               by_day_of_month: 0, occurrence: 0, end: "",
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
//         setTasks([]);
//       }
//     } catch (error) {
//       console.error(`Error fetching tasks for ${timePeriod}:`, error);
//       setTasks([]);
//       setError("Failed to load tasks. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPlanItems = async (goalId: string) => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       setError("Authentication token not found. Please log in.");
//       setPlanItems([]);
//       setIsItemsModalOpen(true);
//       return;
//     }

//     setSelectedGoalId(goalId);

//     try {
//       const response = await fetch(`${BASE_URL}/getItems`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({ date_input: formattedDate, items_list: [] }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("Fetched items data:", data);

//       let rawTasks: Task[] = [];
//       if (data.status === 200 && data.reports && data.reports.length > 0) {
//         rawTasks = data.reports[0].map((item: any) => ({
//           id: String(item.id),
//           name: item.context.name || "",
//           isFocused: item.context.is_focused || false,
//           isSnoozed: item.context.is_snoozed || false,
//           note: item.context.note || "",
//           children: [],
//           parentId: item.context.parent_item_id || null,
//           context: {
//             status: item.context.status || "open",
//             itype: item.context.itype || "task",
//             name: item.context.name || "",
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

//         setPlanItems(rootTasks);
//       } else {
//         setPlanItems([]);
//       }

//       // Fetch associated items for the selected goal
//       await fetchAssociatedItems(goalId, token);
//       setIsItemsModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching plan items:", error);
//       setPlanItems([]);
//       setError("Failed to fetch plan items.");
//       setIsItemsModalOpen(true);
//     }
//   };

//   const fetchAssociatedItems = async (goalId: string, token: string) => {
//     try {
//       const response = await fetch(`${BASE_URL}/getAssociatedItems`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           goal_id: goalId,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch associated items: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       console.log(`Associated items for goal ${goalId}:`, data);

//       if (data.status === 200 && data.reports && Array.isArray(data.reports)) {
//         const reportItems = Array.isArray(data.reports[0]) ? data.reports[0] : [];
//         const associatedTasks = reportItems.map((item: any) => ({
//           id: String(item.id),
//           name: item.context?.name || `Task ${item.id}`,
//           isFocused: item.context?.is_focused || false,
//           isSnoozed: item.context?.is_snoozed || false,
//           note: item.context?.note || "",
//           children: [],
//           parentId: item.context?.parent_item_id || null,
//           context: {
//             status: item.context?.status || "open",
//             itype: item.context?.itype || "task",
//             name: item.context?.name || `Task ${item.id}`,
//             parent_item_id: item.context?.parent_item_id || "",
//             note: item.context?.note || "",
//             is_focused: item.context?.is_focused || false,
//             is_snoozed: item.context?.is_snoozed || false,
//             ritual: item.context?.ritual || {
//               start: "",
//               frequency: "",
//               ritual_flag: false,
//               interval: 1,
//               by_day_of_week: [false, false, false, false, false, false, false],
//               by_day_of_month: 0,
//               occurrence: 0,
//               end: "",
//             },
//             last_updated: item.context?.last_updated || "",
//             snoozed_till: item.context?.snoozed_till || "",
//           },
//         }));
//         setAssociatedItems((prev) => ({
//           ...prev,
//           [goalId]: associatedTasks,
//         }));
//       } else {
//         setAssociatedItems((prev) => ({
//           ...prev,
//           [goalId]: [],
//         }));
//       }
//     } catch (error) {
//       console.error(`Error fetching associated items for goal ${goalId}:`, error);
//       setAssociatedItems((prev) => ({
//         ...prev,
//         [goalId]: [],
//       }));
//     }
//   };

//   const handleAssociateItem = async (itemId: string) => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token || !selectedGoalId) {
//       setError("Authentication token or goal ID missing.");
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/associatedItemsToGoal`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           goal_id: selectedGoalId,
//           associated_items_id: [itemId],
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to associate item: ${response.status} - ${errorText}`);
//       }

//       await fetchAssociatedItems(selectedGoalId, token);
//     } catch (error) {
//       console.error("Error associating item:", error);
//       setError("Failed to associate item.");
//     }
//   };

//   const handleUnassociateItem = async (itemId: string) => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token || !selectedGoalId) {
//       setError("Authentication token or goal ID missing.");
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/unassociatedItemsToGoal`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           goal_id: selectedGoalId,
//           unassociated_items_id: [itemId],
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to unassociate item: ${response.status} - ${errorText}`);
//       }

//       await fetchAssociatedItems(selectedGoalId, token);
//     } catch (error) {
//       console.error("Error unassociating item:", error);
//       setError("Failed to unassociate item.");
//     }
//   };

//   const fetchNote = async (token: string) => {
//     setNoteLoading(true);
//     console.log(`Fetching note from ${BASE_URL}/addEnvisionNotes for ${timePeriod} with token:`, token);
//     console.log("Request body:", { date: formattedDate, note: "", time_period: timePeriod });
//     try {
//       const response = await fetch(`${BASE_URL}/addEnvisionNotes`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({ date: formattedDate, note: "", time_period: timePeriod }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`Fetch note failed: Status ${response.status}, Response: ${errorText}`);
//         throw new Error(`Failed to fetch note: ${response.status} - ${errorText}`);
//       }

//       const data = await response.json();
//       console.log(`Note data received for ${timePeriod}:`, data);

//       if (data.status === 200) {
//         const existingNote = data.reports?.length > 0 ? data.reports[0].context.note || "" : data.note || "";
//         setNote(existingNote);
//       } else {
//         setNote("");
//       }
//     } catch (error) {
//       console.error("Error fetching note:", error);
//       setNote("");
//       setError("Failed to load note due to a server error. Please try again.");
//     } finally {
//       setNoteLoading(false);
//     }
//   };

//   const saveNote = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       setError("Authentication token not found. Please log in.");
//       return;
//     }

//     setNoteSaving(true);
//     console.log(`Saving note to ${BASE_URL}/addEnvisionNotes for ${timePeriod} with token:`, token);
//     console.log("Request body:", { date: formattedDate, note, time_period: timePeriod });
//     try {
//       const response = await fetch(`${BASE_URL}/addEnvisionNotes`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({ date: formattedDate, note: note, time_period: timePeriod }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`Save note failed: Status ${response.status}, Response: ${errorText}`);
//         throw new Error(`Failed to save note: ${response.status} - ${errorText}`);
//       }

//       console.log("Note saved successfully!");
//     } catch (error) {
//       console.error("Error saving note:", error);
//       setError("Failed to save note due to a server error. Please try again.");
//     } finally {
//       setNoteSaving(false);
//     }
//   };

//   const handleAddGoal = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token || !newGoalName.trim()) {
//       setError(!token ? "Authentication token not found." : "Goal name cannot be empty.");
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/createGoal`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           goal_name: newGoalName.trim(),
//           goal_period: timePeriod,
//           parent_goal_id: "",
//         }),
//       });

//       if (!response.ok) throw new Error(`Failed to create goal: ${response.status}`);
//       await response.json();
//       fetchTasks(token);
//       setIsAddingGoal(false);
//       setNewGoalName("");
//       setError(null);
//     } catch (error) {
//       console.error("Error creating goal:", error);
//       setError("Failed to create goal.");
//     }
//   };

//   const handleAddSubGoal = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token || !subGoalName.trim() || !subGoalParentId) {
//       setError(!token ? "Authentication token not found." : !subGoalName.trim() ? "Sub-goal name cannot be empty." : "Parent goal ID missing.");
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/createGoal`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: formattedDate,
//           goal_name: subGoalName.trim(),
//           goal_period: timePeriod,
//           parent_goal_id: subGoalParentId,
//         }),
//       });

//       if (!response.ok) throw new Error(`Failed to create sub-goal: ${response.status}`);
//       await response.json();
//       fetchTasks(token);
//       setIsAddingSubGoal(false);
//       setSubGoalName("");
//       setSubGoalParentId(null);
//       setError(null);
//     } catch (error) {
//       console.error("Error creating sub-goal:", error);
//       setError("Failed to create sub-goal.");
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

//   const handleEditTask = (task: Task) => setEditingTask(task);
//   const handleStartAddSubGoal = (parentId: string) => {
//     setIsAddingSubGoal(true);
//     setSubGoalParentId(parentId);
//   };

//   useEffect(() => {
//     console.log(`Component mounted for ${timePeriod}. Checking auth token...`);
//     const token = localStorage.getItem("AUTH_TOKEN");
//     setAuthToken(token);

//     if (token) {
//       console.log(`Token found: ${token}. Fetching data with delay...`);
//       fetchTasks(token);
//       const noteDelay = setTimeout(() => {
//         fetchNote(token);
//       }, 1000);
//       return () => clearTimeout(noteDelay);
//     } else {
//       console.warn("No auth token found on mount. Please log in.");
//       setLoading(false);
//       setNoteLoading(false);
//       setError("Please log in to view goals and notes.");
//     }
//   }, [timePeriod]);

//   useEffect(() => {
//     console.log(`Tasks updated for ${timePeriod}:`, tasks);
//   }, [tasks]);

//   useEffect(() => {
//     console.log(`Note updated for ${timePeriod}:`, note);
//   }, [note]);

//   return (
//     <div style={containerStyle} className="goals-container">
//       <header style={headerStyle} className="goals-header">
//         <h2 style={titleStyle} className="goals-title">{getHeaderTitle()}</h2>
//         {!isAddingGoal && (
//           <button
//             style={addButtonStyle}
//             onClick={() => setIsAddingGoal(true)}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = addButtonHoverStyle.backgroundColor ?? "")}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = addButtonStyle.backgroundColor ?? "")}
//           >
//             + Add Goal
//           </button>
//         )}
//       </header>

//       {error && <div style={errorStyle}>{error}</div>}

//       {isAddingGoal && (
//         <div style={addGoalRowStyle}>
//           <input
//             type="text"
//             value={newGoalName}
//             onChange={(e) => setNewGoalName(e.target.value)}
//             placeholder={`Enter your new ${timePeriod} goal`}
//             style={addGoalInputStyle}
//             autoFocus
//           />
//           <button style={addGoalButtonStyle} onClick={handleAddGoal}>OK</button>
//           <button style={cancelButtonStyle} onClick={handleCancelAddGoal}>Cancel</button>
//         </div>
//       )}

//       {loading ? (
//         <div style={loadingStyle}>Loading goals...</div>
//       ) : tasks.length === 0 ? (
//         <div style={noTasksStyle}>No goals found. Add a new goal to get started!</div>
//       ) : (
//         <div style={taskListStyle}>
//           {tasks.map((task, index) => (
//             <div key={task.id}>
//               <TaskItem
//                 task={task}
//                 refreshTasks={() => authToken && fetchTasks(authToken)}
//                 onEditTask={handleEditTask}
//                 draggable={true}
//                 index={index}
//                 onAddSubGoal={handleStartAddSubGoal}
//                 onShowPlanItems={() => fetchPlanItems(task.id)}
//               />
//               {isAddingSubGoal && subGoalParentId === task.id && (
//                 <div style={addSubGoalRowStyle}>
//                   <input
//                     type="text"
//                     value={subGoalName}
//                     onChange={(e) => setSubGoalName(e.target.value)}
//                     placeholder="Enter your new sub-goal"
//                     style={addGoalInputStyle}
//                     autoFocus
//                   />
//                   <button style={addGoalButtonStyle} onClick={handleAddSubGoal}>OK</button>
//                   <button style={cancelButtonStyle} onClick={handleCancelAddSubGoal}>Cancel</button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       <div style={noteSectionStyle}>
//         <h3 style={noteTitleStyle}>Summary Notes</h3>
//         {noteLoading ? (
//           <div style={loadingStyle}>Loading note...</div>
//         ) : (
//           <>
//             <textarea
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               placeholder={`Add your thoughts or reflections for this ${timePeriod}`}
//               style={noteTextAreaStyle}
//             />
//             <button
//               style={saveNoteButtonStyle}
//               onClick={saveNote}
//               disabled={noteSaving}
//               onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = saveNoteHoverStyle.backgroundColor ?? "")}
//               onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = saveNoteButtonStyle.backgroundColor ?? "")}
//             >
//               {noteSaving ? "Saving..." : "Save Note"}
//             </button>
//           </>
//         )}
//       </div>

//       {editingTask && (
//         <EditTaskModal
//           task={editingTask}
//           isOpen={true}
//           onClose={() => setEditingTask(null)}
//           refreshTasks={() => authToken && fetchTasks(authToken)}
//         />
//       )}

//       <ItemsModal
//         isOpen={isItemsModalOpen}
//         onClose={() => setIsItemsModalOpen(false)}
//         items={planItems}
//         selectedGoalId={selectedGoalId}
//         associatedItems={associatedItems[selectedGoalId || ""] || []}
//         onAssociate={handleAssociateItem}
//         onUnassociate={handleUnassociateItem}
//       />
//     </div>
//   );
// };

// // Existing styles remain unchanged
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

// const noteSectionStyle: React.CSSProperties = {
//   padding: "20px",
//   backgroundColor: "#fff",
//   borderRadius: "5px",
//   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//   marginTop: "20px",
// };

// const noteTitleStyle: React.CSSProperties = {
//   fontSize: "18px",
//   fontWeight: "500",
//   color: "#333",
//   marginBottom: "10px",
// };

// const noteTextAreaStyle: React.CSSProperties = {
//   width: "100%",
//   minHeight: "150px",
//   padding: "10px",
//   borderRadius: "4px",
//   border: "1px solid #ccc",
//   resize: "vertical",
//   fontSize: "14px",
//   outline: "none",
// };

// const saveNoteButtonStyle: React.CSSProperties = {
//   backgroundColor: "#007bff",
//   color: "white",
//   padding: "8px 15px",
//   border: "none",
//   borderRadius: "4px",
//   fontSize: "14px",
//   cursor: "pointer",
//   marginTop: "10px",
//   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
// };

// const saveNoteHoverStyle: React.CSSProperties = {
//   backgroundColor: "#0056b3",
// };

// export default Goals;














import React, { useEffect, useState, useMemo } from "react";
import GoalItem from "../components/GoalItem";
import EditTaskModal from "../components/EditTaskModal";
import { BASE_URL } from "../config";
import ReactDOM from "react-dom";

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

const ItemsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: Task[];
  selectedGoalId: string | null;
  associatedItems: Task[];
  onAssociate: (itemId: string) => Promise<void>;
  onUnassociate: (itemId: string) => Promise<void>;
}> = ({ isOpen, onClose, items, selectedGoalId, associatedItems, onAssociate, onUnassociate }) => {
  if (!isOpen || !selectedGoalId) return null;

  const associatedItemIds = associatedItems.map((item) => item.id);

  const TaskTree: React.FC<{ task: Task; level?: number }> = ({ task, level = 0 }) => {
    const isAssociated = associatedItemIds.includes(task.id);

    const handleCheckboxChange = async () => {
      if (isAssociated) {
        await onUnassociate(task.id);
      } else {
        await onAssociate(task.id);
      }
    };

    return (
      <div style={{ marginLeft: `${level * 20}px` }}>
        <div style={{ padding: "8px 0", borderBottom: "1px solid #eee", display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isAssociated}
            onChange={handleCheckboxChange}
            style={{ marginRight: "10px" }}
          />
          {task.name}
        </div>
        {task.children && task.children.length > 0 && (
          <div>
            {task.children.map((child) => (
              <TaskTree key={child.id} task={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20001,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h3>Associate Items for Goal</h3>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div style={{ listStyle: "none", padding: 0 }}>
            {items.map((item) => (
              <TaskTree key={item.id} task={item} />
            ))}
          </div>
        )}
        <button onClick={onClose} style={{ marginTop: "10px", padding: "5px 10px" }}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

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
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [planItems, setPlanItems] = useState<Task[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [associatedItems, setAssociatedItems] = useState<{ [goalId: string]: Task[] }>({});
  const [isAssociatedItemsVisible, setIsAssociatedItemsVisible] = useState<{ [goalId: string]: boolean }>({});
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "running" | "done">("all");

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
    try {
      const endpoint = `get_${timePeriod.charAt(0) + timePeriod.slice(1)}`;
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
      let rawTasks: Task[] = [];
      if (data.status === 200 && data.reports && data.reports.length > 0) {
        rawTasks = data.reports[0]
          .filter((item: any) => item.context.itype === "goal")
          .map((item: any) => ({
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
                start: "",
                frequency: "",
                ritual_flag: false,
                interval: 1,
                by_day_of_week: [false, false, false, false, false, false, false],
                by_day_of_month: 0,
                occurrence: 0,
                end: "",
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

        if (timePeriod === "week") {
          const fetchAssociatedForTask = async (task: Task) => {
            await fetchAssociatedItems(task.id, token);
            if (task.children && task.children.length > 0) {
              for (const child of task.children) {
                await fetchAssociatedForTask(child);
              }
            }
          };

          for (const task of rootTasks) {
            await fetchAssociatedForTask(task);
          }
        }
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

  const fetchPlanItems = async (goalId: string) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setPlanItems([]);
      setIsItemsModalOpen(true);
      return;
    }

    setSelectedGoalId(goalId);

    try {
      const response = await fetch(`${BASE_URL}/get_items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ date_input: formattedDate, items_list: [] }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const data = await response.json();
      let rawTasks: Task[] = [];
      if (data.status === 200 && data.reports && data.reports.length > 0) {
        rawTasks = data.reports[0].map((item: any) => ({
          id: String(item.id),
          name: item.context.name || "",
          isFocused: item.context.is_focused || false,
          isSnoozed: item.context.is_snoozed || false,
          note: item.context.note || "",
          children: [],
          parentId: item.context.parent_item_id || null,
          context: {
            status: item.context.status || "open",
            itype: item.context.itype || "task",
            name: item.context.name || "",
            parent_item_id: item.context.parent_item_id || "",
            note: item.context.note || "",
            is_focused: item.context.is_focused || false,
            is_snoozed: item.context.is_snoozed || false,
            ritual: item.context.ritual || {
              start: "",
              frequency: "",
              ritual_flag: false,
              interval: 1,
              by_day_of_week: [false, false, false, false, false, false, false],
              by_day_of_month: 0,
              occurrence: 0,
              end: "",
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

        setPlanItems(rootTasks);
      } else {
        setPlanItems([]);
      }

      await fetchAssociatedItems(goalId, token);
      setIsItemsModalOpen(true);
    } catch (error) {
      console.error("Error fetching plan items:", error);
      setPlanItems([]);
      setError("Failed to fetch plan items.");
      setIsItemsModalOpen(true);
    }
  };

  const fetchAssociatedItems = async (goalId: string, token: string) => {
    try {
      const response = await fetch(`${BASE_URL}/get_associated_items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: formattedDate,
          goal_id: goalId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch associated items: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (data.status === 200 && data.reports && Array.isArray(data.reports)) {
        const reportItems = Array.isArray(data.reports[0]) ? data.reports[0] : [];
        const associatedTasks = reportItems.map((item: any) => ({
          id: String(item.id),
          name: item.context?.name || `Task ${item.id}`,
          isFocused: item.context?.is_focused || false,
          isSnoozed: item.context?.is_snoozed || false,
          note: item.context?.note || "",
          children: [],
          parentId: item.context?.parent_item_id || null,
          context: {
            status: item.context?.status || "open",
            itype: item.context?.itype || "task",
            name: item.context?.name || `Task ${item.id}`,
            parent_item_id: item.context?.parent_item_id || "",
            note: item.context?.note || "",
            is_focused: item.context?.is_focused || false,
            is_snoozed: item.context?.is_snoozed || false,
            ritual: item.context?.ritual || {
              start: "",
              frequency: "",
              ritual_flag: false,
              interval: 1,
              by_day_of_week: [false, false, false, false, false, false, false],
              by_day_of_month: 0,
              occurrence: 0,
              end: "",
            },
            last_updated: item.context?.last_updated || "",
            snoozed_till: item.context?.snoozed_till || "",
          },
        }));
        setAssociatedItems((prev) => ({
          ...prev,
          [goalId]: associatedTasks,
        }));
      } else {
        setAssociatedItems((prev) => ({
          ...prev,
          [goalId]: [],
        }));
      }
    } catch (error) {
      console.error(`Error fetching associated items for goal ${goalId}:`, error);
      setAssociatedItems((prev) => ({
        ...prev,
        [goalId]: [],
      }));
    }
  };

  const handleAssociateItem = async (itemId: string) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token || !selectedGoalId) {
      setError("Authentication token or goal ID missing.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/associated_items_to_goal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: formattedDate,
          goal_id: selectedGoalId,
          associated_items_id: [itemId],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to associate item: ${response.status} - ${errorText}`);
      }

      await fetchAssociatedItems(selectedGoalId, token);
      fetchTasks(token);
    } catch (error) {
      console.error("Error associating item:", error);
      setError("Failed to associate item.");
    }
  };

  const handleUnassociateItem = async (itemId: string) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token || !selectedGoalId) {
      setError("Authentication token or goal ID missing.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/unassociated_items_to_goal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: formattedDate,
          goal_id: selectedGoalId,
          unassociated_items_id: [itemId],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to unassociate item: ${response.status} - ${errorText}`);
      }

      await fetchAssociatedItems(selectedGoalId, token);
      fetchTasks(token);
    } catch (error) {
      console.error("Error unassociating item:", error);
      setError("Failed to unassociate item.");
    }
  };

  const fetchNote = async (token: string) => {
    setNoteLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/add_envision_notes`, {
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
        throw new Error(`Failed to fetch note: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
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
    try {
      const response = await fetch(`${BASE_URL}/add_envision_notes`, {
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
        throw new Error(`Failed to save note: ${response.status} - ${errorText}`);
      }
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
      const response = await fetch(`${BASE_URL}/create_goal`, {
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
      const response = await fetch(`${BASE_URL}/create_goal`, {
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

  const toggleAssociatedItemsVisibility = (goalId: string) => {
    setIsAssociatedItemsVisible((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("AUTH_TOKEN");
    setAuthToken(token);

    if (token) {
      fetchTasks(token);
      const noteDelay = setTimeout(() => {
        fetchNote(token);
      }, 1000);
      return () => clearTimeout(noteDelay);
    } else {
      setLoading(false);
      setNoteLoading(false);
      setError("Please log in to view goals and notes.");
    }
  }, [timePeriod]);

  const categorizeItemsByStatus = useMemo(() => (items: Task[]) => {
    const notStartedItems = items.filter((item) => item.context.status === "open");
    const inProgressItems = items.filter((item) => item.context.status === "running");
    const completedItems = items.filter((item) => item.context.status === "done");

    const notStarted = notStartedItems.length;
    const inProgress = inProgressItems.length;
    const completed = completedItems.length;
    const total = items.length;

    const progress = total > 0 ? (completed / total) * 100 : 0;
    const inProgressPercentage = total > 0 ? (inProgress / total) * 100 : 0;

    return { notStarted, inProgress, completed, total, progress, inProgressPercentage, notStartedItems, inProgressItems, completedItems };
  }, []);

  const GoalTree: React.FC<{ task: Task; level?: number; index: number }> = ({ task, level = 0, index }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const items = associatedItems[task.id] || [];
    const { notStarted, inProgress, completed, total, progress, inProgressPercentage, notStartedItems, inProgressItems, completedItems } = categorizeItemsByStatus(items);
    const isAssociatedVisible = isAssociatedItemsVisible[task.id] ?? true;

    const filteredNotStartedItems = filterStatus === "all" || filterStatus === "open" ? notStartedItems : [];
    const filteredInProgressItems = filterStatus === "all" || filterStatus === "running" ? inProgressItems : [];
    const filteredCompletedItems = filterStatus === "all" || filterStatus === "done" ? completedItems : [];

    const handleToggleCollapse = () => {
      setIsCollapsed((prev) => !prev);
    };

    const handleToggleAssociatedItems = () => {
      toggleAssociatedItemsVisibility(task.id);
    };

    const handleEditAssociatedItem = (item: Task) => {
      setEditingTask(item);
    };

    const tooltipContent = `Not Started: ${notStarted}, In Progress: ${inProgress}, Completed: ${completed}`;

    return (
      <div style={{ marginLeft: `${level * 20}px`, marginBottom: "15px" }}>
        <GoalItem
          task={task}
          refreshTasks={() => authToken && fetchTasks(authToken)}
          onEditTask={handleEditTask}
          draggable={true}
          index={index}
          onAddSubGoal={handleStartAddSubGoal}
          onShowPlanItems={() => fetchPlanItems(task.id)}
          onToggleCollapse={handleToggleCollapse}
          isCollapsed={isCollapsed}
        />
        {!isCollapsed && (
          <>
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
            {timePeriod === "week" && (
              <div style={associatedItemsStyle}>
                <div style={progressSectionStyle}>
                  <div style={progressBarContainerStyle} title={tooltipContent} aria-label={`Progress: ${tooltipContent}`}>
                    <div style={progressBarStyle}>
                      <div style={{ ...progressSegmentStyle, width: `${inProgressPercentage}%`, backgroundColor: "#007bff" }} />
                      <div style={{ ...progressSegmentStyle, width: `${progress}%`, backgroundColor: "#28a745" }} />
                    </div>
                    <span style={progressTextStyle}>{progress.toFixed(0)}% ({completed}/{total})</span>
                  </div>
                  <div style={statusSummaryStyle}>
                    <span>Tasks Associated: {total}</span>
                    <button
                      onClick={handleToggleAssociatedItems}
                      style={toggleButtonStyle}
                      aria-label={isAssociatedVisible ? "Hide associated tasks" : "Show associated tasks"}
                    >
                      {isAssociatedVisible ? "Hide Tasks" : "Show Tasks"}
                    </button>
                  </div>
                </div>
                {isAssociatedVisible && (
                  total > 0 ? (
                    <>
                      <div style={filterSectionStyle}>
                        <label style={{ marginRight: "10px", fontSize: "14px" }}>Filter by Status:</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as "all" | "open" | "running" | "done")}
                          style={filterSelectStyle}
                        >
                          <option value="all">All</option>
                          <option value="open">Not Started</option>
                          <option value="running">In Progress</option>
                          <option value="done">Completed</option>
                        </select>
                      </div>
                      <div style={statusColumnsStyle}>
                        <div style={statusColumnStyle}>
                          <div style={{ ...statusHeaderStyle, color: "#dc3545" }}>Not Started ({filteredNotStartedItems.length})</div>
                          {filteredNotStartedItems.length > 0 ? (
                            filteredNotStartedItems.map((item) => (
                              <div
                                key={item.id}
                                style={itemStyle}
                                onClick={() => handleEditAssociatedItem(item)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === "Enter" && handleEditAssociatedItem(item)}
                              >
                                <span>{item.name}</span>
                              </div>
                            ))
                          ) : (
                            <div style={noItemsStyle}>No tasks</div>
                          )}
                        </div>
                        <div style={statusColumnStyle}>
                          <div style={{ ...statusHeaderStyle, color: "#007bff" }}>In Progress ({filteredInProgressItems.length})</div>
                          {filteredInProgressItems.length > 0 ? (
                            filteredInProgressItems.map((item) => (
                              <div
                                key={item.id}
                                style={itemStyle}
                                onClick={() => handleEditAssociatedItem(item)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === "Enter" && handleEditAssociatedItem(item)}
                              >
                                <span>{item.name}</span>
                              </div>
                            ))
                          ) : (
                            <div style={noItemsStyle}>No tasks</div>
                          )}
                        </div>
                        <div style={statusColumnStyle}>
                          <div style={{ ...statusHeaderStyle, color: "#28a745" }}>Completed ({filteredCompletedItems.length})</div>
                          {filteredCompletedItems.length > 0 ? (
                            filteredCompletedItems.map((item) => (
                              <div
                                key={item.id}
                                style={itemStyle}
                                onClick={() => handleEditAssociatedItem(item)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === "Enter" && handleEditAssociatedItem(item)}
                              >
                                <span>{item.name}</span>
                              </div>
                            ))
                          ) : (
                            <div style={noItemsStyle}>No tasks</div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={emptyAssociatedStyle}>
                      No tasks associated. Click "Associate Items" to add tasks.
                    </div>
                  )
                )}
              </div>
            )}
            {task.children && task.children.length > 0 && (
              <div>
                {task.children.map((child, childIndex) => (
                  <GoalTree key={child.id} task={child} level={level + 1} index={childIndex} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

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
            aria-label="Add a new goal"
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
            aria-label={`Enter your new ${timePeriod} goal`}
          />
          <button style={addGoalButtonStyle} onClick={handleAddGoal} aria-label="Confirm adding new goal">OK</button>
          <button style={cancelButtonStyle} onClick={handleCancelAddGoal} aria-label="Cancel adding new goal">Cancel</button>
        </div>
      )}

      {loading ? (
        <div style={loadingStyle}>Loading goals...</div>
      ) : tasks.length === 0 ? (
        <div style={noTasksStyle}>No goals found. Add a new goal to get started!</div>
      ) : (
        <div style={taskListStyle}>
          {tasks.map((task, index) => (
            <GoalTree key={task.id} task={task} index={index} />
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
              aria-label={`Summary notes for ${timePeriod}`}
            />
            <button
              style={saveNoteButtonStyle}
              onClick={saveNote}
              disabled={noteSaving}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = saveNoteHoverStyle.backgroundColor ?? "")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = saveNoteButtonStyle.backgroundColor ?? "")}
              aria-label="Save summary note"
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

      <ItemsModal
        isOpen={isItemsModalOpen}
        onClose={() => setIsItemsModalOpen(false)}
        items={planItems}
        selectedGoalId={selectedGoalId}
        associatedItems={associatedItems[selectedGoalId || ""] || []}
        onAssociate={handleAssociateItem}
        onUnassociate={handleUnassociateItem}
      />
    </div>
  );
};

// Styles for the associated items section
const associatedItemsStyle: React.CSSProperties = {
  margin: "15px 0",
  padding: "15px",
  backgroundColor: "#fff",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
};

const progressSectionStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
};

const progressBarContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  width: "50%",
  position: "relative",
  transition: "all 0.2s ease",
};

const progressBarStyle: React.CSSProperties = {
  height: "10px",
  backgroundColor: "#e0e0e0", // Gray for remaining (Not Started)
  borderRadius: "5px",
  width: "100%",
  position: "relative",
  overflow: "hidden",
  transition: "height 0.2s ease",
};

const progressSegmentStyle: React.CSSProperties = {
  height: "100%",
  position: "absolute",
  left: 0,
  top: 0,
  transition: "width 0.5s ease-in-out",
};

const progressTextStyle: React.CSSProperties = {
  marginLeft: "10px",
  fontSize: "14px",
  color: "#333",
  fontWeight: "500",
};

const statusSummaryStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#666",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const toggleButtonStyle: React.CSSProperties = {
  backgroundColor: "#6a0dad",
  color: "white",
  padding: "5px 10px",
  border: "none",
  borderRadius: "4px",
  fontSize: "12px",
  cursor: "pointer",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const filterSectionStyle: React.CSSProperties = {
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
};

const filterSelectStyle: React.CSSProperties = {
  padding: "5px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  cursor: "pointer",
};

const statusColumnsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
};

const statusColumnStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  backgroundColor: "#f9f9f9",
  borderRadius: "5px",
  minHeight: "100px",
};

const statusHeaderStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "10px",
  textAlign: "center",
};

const itemStyle: React.CSSProperties = {
  padding: "5px 0",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
  color: "#333",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
};

const noItemsStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#999",
  textAlign: "center",
};

const emptyAssociatedStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#666",
  textAlign: "center",
  padding: "10px",
  backgroundColor: "#f9f9f9",
  borderRadius: "5px",
};

// Existing styles remain unchanged
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
  marginBottom: "15px",
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
  marginBottom: "30px",
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
  marginTop: "30px",
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

// Add hover effect for progress bar
const progressBarHoverStyle = `
  .progress-bar-container:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .progress-bar-container:hover .progress-bar {
    height: 12px;
  }
  .item:hover {
    background-color: #f1f1f1;
  }
`;

// Inject hover styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = progressBarHoverStyle;
document.head.appendChild(styleSheet);

export default Goals;