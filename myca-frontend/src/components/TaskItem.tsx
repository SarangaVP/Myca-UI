// import React, { useState, useEffect, useRef } from "react";
// import { FaEdit, FaPlus, FaStar, FaSyncAlt, FaStickyNote, FaBellSlash, FaTrash, FaEllipsisV } from "react-icons/fa";
// import TaskInput from "./TaskInput";
// import RecurrenceModal from "./RecurrenceModal";
// import NoteModal from "./NoteModal";
// import SnoozeModal from "./SnoozeModal";
// import { BASE_URL } from "../config";
// import "./TaskItem.css";

// export interface Task {
//   context: any;
//   id: string;
//   name: string;
//   isFocused: boolean;
//   note?: string;
//   isSnoozed: boolean;
//   children?: Task[];
// }

// interface TaskItemProps {
//   task: Task;
//   refreshTasks: () => void;
//   onEditTask: (task: Task) => void;
//   draggable?: boolean;
//   onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
//   onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
//   onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
//   onDragEnd?: () => void;
// }

// const TaskItem: React.FC<TaskItemProps> = ({ task, refreshTasks, onEditTask }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isAddingChild, setIsAddingChild] = useState(false);
//   const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);
//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
//   const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
//   const [isSnoozed, setIsSnoozed] = useState(task.isSnoozed || false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // Drag and Drop State
//   const [dragOverItem, setDragOverItem] = useState<string | null>(null);

//   // Drag and Drop Handlers
//   const handleDragStart = (e: React.DragEvent, itemId: string) => {
//     e.stopPropagation();
//     e.dataTransfer.setData("text/plain", itemId);
//     e.dataTransfer.effectAllowed = "move";
//     console.log("Setting Dragging Item:", itemId);
//   };

//   const handleDragOver = (e: React.DragEvent, itemId: string) => {
//     e.stopPropagation();
//     e.preventDefault();
//     setDragOverItem(itemId);
//   };

//   const handleDragEnd = () => {
//     setDragOverItem(null);
//   };

//   const handleDrop = async (e: React.DragEvent, newParentId: string) => {
//     const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
//     e.preventDefault();
//     e.stopPropagation();
//     const itemId = e.dataTransfer.getData("text/plain");

//     console.log("Dropped Item:", itemId);
//     console.log("New Parent:", newParentId);

//     if (itemId && newParentId && itemId !== newParentId) {
//       try {
//         const response = await fetch(`${BASE_URL}/moveItem`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${AUTH_TOKEN}`,
//           },
//           body: JSON.stringify({
//             date: new Date().toISOString().split("T")[0],
//             item_id: itemId,
//             new_parent_id: newParentId,
//           }),
//         });

//         const data = await response.json();
//         if (data.status === 200) {
//           refreshTasks();
//         } else {
//           console.error("Failed to move item");
//         }
//       } catch (error) {
//         console.error("Error moving item:", error);
//       }
//     }

//     setDragOverItem(null);
//   };

//   // Delete Handler
//   const handleDeleteTask = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       console.error("No auth token found!");
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/deleteItem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: new Date().toISOString().split("T")[0],
//           item_id: task.id,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("deleteItem failed with status:", response.status, "Details:", errorText);
//         throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }

//       console.log("Task deleted successfully:", task.id);
//       refreshTasks();
//       setIsMenuOpen(false);
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   // Toggle Menu Handler
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   // Close Menu on Outside Click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div
//       draggable
//       onDragStart={(e) => handleDragStart(e, task.id)}
//       onDragOver={(e) => handleDragOver(e, task.id)}
//       onDrop={(e) => handleDrop(e, task.id)}
//       onDragEnd={handleDragEnd}
//       style={{
//         ...taskContainerStyle,
//         border: dragOverItem === task.id ? "2px dashed #007bff" : "1px solid #ccc",
//         backgroundColor: dragOverItem === task.id ? "#e6f7ff" : "#fff",
//       }}
//     >
//       <div style={taskRowStyle}>
//         {/* Expand/Collapse Button */}
//         {task.children && task.children.length > 0 && (
//           <button onClick={() => setIsExpanded(!isExpanded)} style={toggleButtonStyle}>
//             {isExpanded ? "▼" : "▶"}
//           </button>
//         )}

//         {/* Task Name with Star Icon for Focused Items */}
//         <span style={taskTextStyle}>
//           {task.name}
//           {task.isFocused && <FaStar style={starIconStyle} />}
//         </span>

//         {/* Add Child Button (Separate) */}
//         <button onClick={() => setIsAddingChild(!isAddingChild)} style={addButtonStyle}>
//           <FaPlus />
//         </button>

//         {/* Menu Container with Relative Positioning */}
//         <div style={{ position: "relative" }}>
//           <button onClick={toggleMenu} style={menuButtonStyle}>
//             <FaEllipsisV />
//           </button>

//           {/* Dropdown Menu */}
//           {isMenuOpen && (
//             <div ref={menuRef} style={menuStyle}>
//               <button
//                 onClick={() => {
//                   setIsSnoozeModalOpen(true);
//                   setIsMenuOpen(false);
//                 }}
//                 style={menuItemStyle}
//                 className="task-item-menu-item"
//               >
//                 <FaBellSlash /> Snooze
//               </button>
//               <button
//                 onClick={() => {
//                   setIsNoteModalOpen(true);
//                   setIsMenuOpen(false);
//                 }}
//                 style={menuItemStyle}
//                 className="task-item-menu-item"
//               >
//                 <FaStickyNote /> Note
//               </button>
//               <button
//                 onClick={() => {
//                   setIsRecurrenceModalOpen(true);
//                   setIsMenuOpen(false);
//                 }}
//                 style={menuItemStyle}
//                 className="task-item-menu-item"
//               >
//                 <FaSyncAlt /> Recurrence
//               </button>
//               <button
//                 onClick={() => {
//                   onEditTask(task);
//                   setIsMenuOpen(false);
//                 }}
//                 style={menuItemStyle}
//                 className="task-item-menu-item"
//               >
//                 <FaEdit /> Edit
//               </button>
//               <button
//                 onClick={handleDeleteTask}
//                 style={menuItemStyle}
//                 className="task-item-menu-item"
//               >
//                 <FaTrash /> Delete
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Task Input for Adding a Child Task */}
//       {isAddingChild && (
//         <TaskInput refreshTasks={refreshTasks} parentId={task.id} onClose={() => setIsAddingChild(false)} />
//       )}

//       {isExpanded && task.children && (
//         <div style={childTaskContainerStyle}>
//           {task.children.map((child) => (
//             <TaskItem
//               key={child.id}
//               task={child}
//               refreshTasks={refreshTasks}
//               onEditTask={onEditTask}
//               draggable
//               onDragStart={(e) => handleDragStart(e, child.id)}
//               onDragOver={(e) => handleDragOver(e, child.id)}
//               onDrop={(e) => handleDrop(e, child.id)}
//               onDragEnd={handleDragEnd}
//             />
//           ))}
//         </div>
//       )}

//       {/* Snooze Modal */}
//       {isSnoozeModalOpen && (
//         <SnoozeModal
//           isOpen={isSnoozeModalOpen}
//           onClose={() => setIsSnoozeModalOpen(false)}
//           itemId={task.id}
//           initialSnoozeStatus={isSnoozed}
//           refreshTasks={() => {
//             refreshTasks();
//             setIsSnoozed(true);
//           }}
//         />
//       )}

//       {/* Recurrence Modal */}
//       {isRecurrenceModalOpen && (
//         <RecurrenceModal
//           isOpen={isRecurrenceModalOpen}
//           onClose={() => setIsRecurrenceModalOpen(false)}
//           task={task}
//           refreshTasks={refreshTasks}
//         />
//       )}

//       {/* Note Modal */}
//       {isNoteModalOpen && (
//         <NoteModal
//           isOpen={isNoteModalOpen}
//           onClose={() => setIsNoteModalOpen(false)}
//           taskId={task.id}
//           refreshTasks={refreshTasks}
//         />
//       )}
//     </div>
//   );
// };

// // Styles
// const taskContainerStyle: React.CSSProperties = {
//   padding: "12px",
//   backgroundColor: "#fff",
//   borderRadius: "8px",
//   boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
//   marginBottom: "8px",
//   transition: "0.3s ease-in-out",
// };

// const taskRowStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   padding: "8px 12px",
//   borderRadius: "6px",
//   backgroundColor: "#f8f9fa",
//   cursor: "pointer",
// };

// const taskTextStyle: React.CSSProperties = {
//   fontSize: "16px",
//   fontWeight: "bold",
//   flex: 1,
//   marginLeft: "8px",
//   display: "flex",
//   alignItems: "center",
//   gap: "5px",
// };

// const starIconStyle: React.CSSProperties = {
//   color: "#FFA500",
//   marginLeft: "5px",
// };

// const toggleButtonStyle: React.CSSProperties = {
//   background: "none",
//   border: "none",
//   fontSize: "16px",
//   cursor: "pointer",
//   marginRight: "8px",
// };

// const addButtonStyle: React.CSSProperties = {
//   backgroundColor: "#28a745",
//   color: "white",
//   padding: "6px 10px",
//   borderRadius: "5px",
//   border: "none",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   gap: "5px",
//   transition: "0.2s ease-in-out",
//   marginRight: "5px",
// };

// const menuButtonStyle: React.CSSProperties = {
//   backgroundColor: "transparent",
//   color: "#555",
//   padding: "6px 10px",
//   borderRadius: "5px",
//   border: "none",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   gap: "5px",
//   transition: "color 0.2s ease-in-out",
// };

// const menuStyle: React.CSSProperties = {
//   position: "absolute",
//   right: "0", 
//   top: "100%", 
//   transform: "translateY(-160px)", 
//   backgroundColor: "#fff",
//   borderRadius: "8px",
//   border: "1px solid #ddd",
//   boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
//   display: "flex",
//   flexDirection: "column",
//   zIndex: 1000,
//   padding: "5px 0",
//   minWidth: "150px",
// };

// const menuItemStyle: React.CSSProperties = {
//   backgroundColor: "transparent",
//   color: "#333",
//   padding: "8px 12px",
//   border: "none",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   gap: "8px",
//   textAlign: "left" as const,
//   width: "100%",
//   transition: "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
// };

// const childTaskContainerStyle: React.CSSProperties = {
//   paddingLeft: "20px",
//   marginTop: "8px",
//   borderLeft: "2px solid #ccc",
// };

// export default TaskItem;


































// import React, { useState, useEffect, useRef } from "react";
// import { FaEdit, FaPlus, FaStar, FaSyncAlt, FaStickyNote, FaBellSlash, FaTrash, FaEllipsisV, FaPlay, FaCheck, FaTimes, FaFolderOpen } from "react-icons/fa";
// import ReactDOM from "react-dom";
// import TaskInput from "./TaskInput";
// import RecurrenceModal from "./RecurrenceModal";
// import NoteModal from "./NoteModal";
// import SnoozeModal from "./SnoozeModal";
// import { BASE_URL } from "../config";
// import "./TaskItem.css";

// export interface Task {
//   context: {
//     status?: string;
//     [key: string]: any;
//   };
//   id: string;
//   name: string;
//   isFocused: boolean;
//   note?: string;
//   isSnoozed: boolean;
//   children?: Task[];
//   parentId?: string; // Keep this for potential future use
// }

// interface TaskItemProps {
//   task: Task;
//   refreshTasks: () => void;
//   onEditTask: (task: Task) => void;
//   draggable?: boolean;
//   onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
//   onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
//   onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
//   onDragEnd?: () => void;
//   index?: number;
//   parentId?: string;
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

//   console.log("Status Dropdown button position:", {
//     top: buttonRect.top,
//     bottom: buttonRect.bottom,
//     left: buttonRect.left,
//     scrollY,
//     viewportHeight,
//   });

//   const isCutOff = buttonRect.bottom + dropdownHeight + scrollY > viewportHeight + scrollY;
//   const topPosition = isCutOff
//     ? `${buttonRect.top + scrollY - dropdownHeight - 5}px`
//     : `${buttonRect.bottom + scrollY + 5}px`;

//   return ReactDOM.createPortal(
//     <div
//       ref={dropdownRef}
//       className="status-dropdown"
//       style={{
//         position: "absolute",
//         top: topPosition,
//         left: `${buttonRect.left}px`,
//         zIndex: 20000,
//         minWidth: "120px",
//         boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//         animation: "fadeIn 0.2s ease-in",
//       }}
//     >
//       {children}
//     </div>,
//     document.body
//   );
// };

// const MenuDropdownPortal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   menuButtonRef: React.RefObject<HTMLButtonElement | null>;
//   children: React.ReactNode;
// }> = ({ isOpen, onClose, menuButtonRef, children }) => {
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
//         menuButtonRef.current &&
//         !menuButtonRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     if (isOpen && menuButtonRef.current) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, onClose, menuButtonRef, initialClick]);

//   useEffect(() => {
//     if (!isOpen) {
//       setInitialClick(false);
//     }
//   }, [isOpen]);

//   if (!isOpen || !menuButtonRef.current) return null;

//   const buttonRect = menuButtonRef.current.getBoundingClientRect();
//   const scrollY = window.scrollY;
//   const viewportHeight = window.innerHeight;
//   const dropdownHeight = 160;

//   console.log("Menu Dropdown button position:", {
//     top: buttonRect.top,
//     bottom: buttonRect.bottom,
//     left: buttonRect.left,
//     right: buttonRect.right,
//     scrollY,
//     viewportHeight,
//   });

//   const isCutOff = buttonRect.bottom + dropdownHeight + scrollY > viewportHeight + scrollY;
//   const topPosition = isCutOff
//     ? `${buttonRect.top + scrollY - dropdownHeight - 5}px`
//     : `${buttonRect.bottom + scrollY + 5}px`;

//   return ReactDOM.createPortal(
//     <div
//       ref={dropdownRef}
//       className="menu-dropdown"
//       style={{
//         position: "absolute",
//         top: topPosition,
//         left: `${buttonRect.right - 150}px`,
//         zIndex: 20000,
//         minWidth: "150px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//         animation: "fadeIn 0.2s ease-in",
//       }}
//     >
//       {children}
//     </div>,
//     document.body
//   );
// };

// const TaskItem: React.FC<TaskItemProps> = ({
//   task,
//   refreshTasks,
//   onEditTask,
//   draggable = true,
//   onDragStart,
//   onDragOver,
//   onDrop,
//   onDragEnd,
//   index = 0,
//   parentId,
// }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isAddingChild, setIsAddingChild] = useState(false);
//   const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);
//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
//   const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
//   const [isSnoozed, setIsSnoozed] = useState(task.isSnoozed || false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const statusRef = useRef<HTMLDivElement>(null);
//   const statusButtonRef = useRef<HTMLButtonElement | null>(null);
//   const menuButtonRef = useRef<HTMLButtonElement | null>(null);
//   const taskContainerRef = useRef<HTMLDivElement>(null);

//   const [dragOverItem, setDragOverItem] = useState<string | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isDraggable, setIsDraggable] = useState(false);
//   const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const baseZIndex = 1000 - index * 10;

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
//         return <FaPlay size={10} style={{ marginRight: "2px" }} />;
//       case "done":
//         return <FaCheck size={10} style={{ marginRight: "2px" }} />;
//       case "canceled":
//         return <FaTimes size={10} style={{ marginRight: "2px" }} />;
//       case "open":
//       default:
//         return <FaFolderOpen size={10} style={{ marginRight: "2px" }} />;
//     }
//   };

//   const handleStatusChange = async (newStatus: string) => {
//     const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
//     const today = new Date().toISOString().split("T")[0];

//     const updateData = {
//       date: today,
//       item_id: task.id,
//       new_name: task.name,
//       new_type: task.context?.itype || "task",
//       new_status: newStatus,
//       isFocused: task.isFocused,
//     };

//     try {
//       const response = await fetch(`${BASE_URL}/updateItem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${AUTH_TOKEN}`,
//         },
//         credentials: "include",
//         body: JSON.stringify(updateData),
//       });

//       if (response.ok) {
//         refreshTasks();
//         setIsStatusDropdownOpen(false);
//       } else {
//         console.error("Failed to update status");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     console.log("Mouse down detected on task container:", task.id, "Target:", e.target);
//     if ((e.target as HTMLElement).closest(".status-button, .toggle-button, .add-button, .menu-button")) {
//       console.log("Mouse down on button, ignoring drag");
//       return;
//     }

//     setIsDraggable(true);
//     longPressTimer.current = setTimeout(() => {
//       setIsDragging(true);
//       if (taskContainerRef.current) {
//         taskContainerRef.current.classList.add("dragging");
//       }
//       console.log("Long press detected, enabling drag for item:", task.id);
//     }, 500);
//   };

//   const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
//     console.log("Mouse up detected, isDragging:", isDragging);
//     if (longPressTimer.current) {
//       clearTimeout(longPressTimer.current);
//       longPressTimer.current = null;
//     }
//     if (!isDragging) {
//       setIsDraggable(false);
//     }
//   };

//   const handleMouseLeave = () => {
//     console.log("Mouse leave detected, isDragging:", isDragging);
//     if (longPressTimer.current && !isDragging) {
//       clearTimeout(longPressTimer.current);
//       longPressTimer.current = null;
//     }
//   };

//   const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
//     e.stopPropagation();
//     console.log("Drag start for item:", itemId, "isDraggable:", isDraggable);
//     if (!isDraggable) {
//       console.log("Drag start prevented: isDraggable is false");
//       return;
//     }
//     e.dataTransfer.setData("text/plain", itemId);
//     e.dataTransfer.effectAllowed = "move";
//     setIsDragging(true);
//     if (taskContainerRef.current) {
//       taskContainerRef.current.classList.add("dragging");
//     }
//     onDragStart?.(e);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
//     e.stopPropagation();
//     e.preventDefault();
//     console.log("Drag over item:", itemId);
//     if (taskContainerRef.current && !taskContainerRef.current.classList.contains("dragging")) {
//       setDragOverItem(itemId);
//       taskContainerRef.current.classList.add("drag-over");
//     }
//     onDragOver?.(e);
//   };

//   const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
//     console.log("Drag end for item:", task.id);
//     setDragOverItem(null);
//     setIsDragging(false);
//     setIsDraggable(false);
//     if (taskContainerRef.current) {
//       taskContainerRef.current.classList.remove("dragging");
//       taskContainerRef.current.classList.remove("drag-over");
//     }
//     onDragEnd?.();
//   };

//   const handleDrop = async (e: React.DragEvent<HTMLDivElement>, dropTargetId: string) => {
//     const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
//     e.preventDefault();
//     e.stopPropagation();
//     const itemId = e.dataTransfer.getData("text/plain");
//     console.log("Drop detected, item:", itemId, "dropTargetId:", dropTargetId, "parentId:", parentId);

//     // Simplify to use dropTargetId directly as newParentId
//     const newParentId = dropTargetId;

//     // Skip if dropping on itself
//     if (!itemId || !newParentId || itemId === newParentId) {
//       console.log("Invalid drop: itemId and newParentId are the same or invalid");
//       setDragOverItem(null);
//       setIsDragging(false);
//       setIsDraggable(false);
//       if (taskContainerRef.current) {
//         taskContainerRef.current.classList.remove("drag-over");
//       }
//       onDrop?.(e);
//       return;
//     }

//     try {
//       console.log("Making moveItem API call:", { item_id: itemId, new_parent_id: newParentId });
//       const response = await fetch(`${BASE_URL}/moveItem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${AUTH_TOKEN}`,
//         },
//         body: JSON.stringify({
//           date: new Date().toISOString().split("T")[0],
//           item_id: itemId,
//           new_parent_id: newParentId,
//         }),
//       });

//       const data = await response.json();
//       if (data.status === 200) {
//         console.log("Move successful, response:", data);
//         refreshTasks();
//       } else {
//         console.error("Failed to move item, response:", data);
//       }
//     } catch (error) {
//       console.error("Error moving item:", error);
//     }

//     setDragOverItem(null);
//     setIsDragging(false);
//     setIsDraggable(false);
//     if (taskContainerRef.current) {
//       taskContainerRef.current.classList.remove("dragging");
//       taskContainerRef.current.classList.remove("drag-over");
//     }
//     onDrop?.(e);
//   };

//   const handleDeleteTask = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       console.error("No auth token found!");
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/deleteItem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: new Date().toISOString().split("T")[0],
//           item_id: task.id,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       refreshTasks();
//       setIsMenuOpen(false);
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         !isSnoozeModalOpen &&
//         !isRecurrenceModalOpen &&
//         !isNoteModalOpen &&
//         menuRef.current &&
//         !menuRef.current.contains(event.target as Node) &&
//         menuButtonRef.current &&
//         !menuButtonRef.current.contains(event.target as Node)
//       ) {
//         setIsMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isSnoozeModalOpen, isRecurrenceModalOpen, isNoteModalOpen]);

//   return (
//     <div
//       ref={taskContainerRef}
//       draggable={isDraggable || draggable}
//       onMouseDown={handleMouseDown}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={handleMouseLeave}
//       onDragStart={(e) => handleDragStart(e, task.id)}
//       onDragOver={(e) => handleDragOver(e, task.id)}
//       onDrop={(e) => handleDrop(e, task.id)}
//       onDragEnd={handleDragEnd}
//       className={`task-container ${isDragging ? "dragging" : ""} ${dragOverItem === task.id ? "drag-over" : ""}`}
//       style={{ zIndex: isDragging ? 10002 : baseZIndex, cursor: isDragging ? "grabbing" : "grab" }}
//     >
//       <div className="task-row">
//         {task.children && task.children.length > 0 && (
//           <button onClick={() => setIsExpanded(!isExpanded)} className="toggle-button">
//             {isExpanded ? "▼" : "▶"}
//           </button>
//         )}
//         <span className="task-text">
//           {task.name}
//           {task.isFocused && <FaStar className="star-icon" />}
//         </span>
//         <div className="button-group">
//           <div ref={statusRef} style={{ position: "relative", display: "inline-block" }}>
//             <button
//               ref={statusButtonRef}
//               onClick={() => setIsStatusDropdownOpen((prev) => !prev)}
//               className="status-button"
//               style={{
//                 backgroundColor: getStatusColor(task.context?.status),
//                 color: task.context?.status === "open" ? "#555" : "#fff",
//                 zIndex: baseZIndex + 5,
//               }}
//             >
//               {getStatusIcon(task.context?.status)}
//               {task.context?.status
//                 ? task.context.status.charAt(0).toUpperCase() + task.context.status.slice(1)
//                 : "Open"}
//             </button>
//             <StatusDropdownPortal
//               isOpen={isStatusDropdownOpen}
//               onClose={() => setIsStatusDropdownOpen(false)}
//               statusButtonRef={statusButtonRef}
//             >
//               <button onClick={() => handleStatusChange("open")} className="status-item">
//                 <FaFolderOpen size={10} style={{ marginRight: "2px" }} /> Open
//               </button>
//               <button onClick={() => handleStatusChange("running")} className="status-item">
//                 <FaPlay size={10} style={{ marginRight: "2px" }} /> Running
//               </button>
//               <button onClick={() => handleStatusChange("done")} className="status-item">
//                 <FaCheck size={10} style={{ marginRight: "2px" }} /> Completed
//               </button>
//               <button onClick={() => handleStatusChange("canceled")} className="status-item">
//                 <FaTimes size={10} style={{ marginRight: "2px" }} /> Canceled
//               </button>
//             </StatusDropdownPortal>
//           </div>
//           <button onClick={() => setIsAddingChild(!isAddingChild)} className="add-button">
//             <FaPlus />
//           </button>
//           <div style={{ position: "relative", display: "inline-block" }}>
//             <button ref={menuButtonRef} onClick={toggleMenu} className="menu-button">
//               <FaEllipsisV />
//             </button>
//             <MenuDropdownPortal
//               isOpen={isMenuOpen}
//               onClose={() => setIsMenuOpen(false)}
//               menuButtonRef={menuButtonRef}
//             >
//               <button
//                 onClick={() => {
//                   setIsSnoozeModalOpen(true);
//                   setIsMenuOpen(false);
//                 }}
//                 className="task-item-menu-item"
//               >
//                 <FaBellSlash /> Snooze
//               </button>
//               <button
//                 onClick={() => {
//                   setIsNoteModalOpen(true);
//                   setIsMenuOpen(false);
//                 }}
//                 className="task-item-menu-item"
//               >
//                 <FaStickyNote /> Note
//               </button>
//               <button
//                 onClick={() => {
//                   setIsRecurrenceModalOpen(true);
//                   setIsMenuOpen(false);
//                 }}
//                 className="task-item-menu-item"
//               >
//                 <FaSyncAlt /> Recurrence
//               </button>
//               <button
//                 onClick={() => {
//                   onEditTask(task);
//                   setIsMenuOpen(false);
//                 }}
//                 className="task-item-menu-item"
//               >
//                 <FaEdit /> Edit
//               </button>
//               <button onClick={handleDeleteTask} className="task-item-menu-item">
//                 <FaTrash /> Delete
//               </button>
//             </MenuDropdownPortal>
//           </div>
//         </div>
//       </div>
//       {isAddingChild && (
//         <TaskInput refreshTasks={refreshTasks} parentId={task.id} onClose={() => setIsAddingChild(false)} />
//       )}
//       {isExpanded && task.children && (
//         <div className="child-task-container">
//           {task.children.map((child, childIndex) => (
//             <TaskItem
//               key={child.id}
//               task={child}
//               refreshTasks={refreshTasks}
//               onEditTask={onEditTask}
//               draggable={draggable}
//               onDragStart={onDragStart}
//               onDragOver={onDragOver}
//               onDrop={onDrop}
//               onDragEnd={onDragEnd}
//               index={index + childIndex + 1}
//               parentId={task.id}
//             />
//           ))}
//         </div>
//       )}
//       {isSnoozeModalOpen && (
//         <SnoozeModal
//           isOpen={isSnoozeModalOpen}
//           onClose={() => setIsSnoozeModalOpen(false)}
//           itemId={task.id}
//           initialSnoozeStatus={isSnoozed}
//           refreshTasks={() => {
//             refreshTasks();
//             setIsSnoozed(true);
//           }}
//         />
//       )}
//       {isRecurrenceModalOpen && (
//         <RecurrenceModal
//           isOpen={isRecurrenceModalOpen}
//           onClose={() => setIsRecurrenceModalOpen(false)}
//           task={task}
//           refreshTasks={refreshTasks}
//         />
//       )}
//       {isNoteModalOpen && (
//         <NoteModal
//           isOpen={isNoteModalOpen}
//           onClose={() => setIsNoteModalOpen(false)}
//           taskId={task.id}
//           refreshTasks={refreshTasks}
//         />
//       )}
//     </div>
//   );
// };

// export default TaskItem;


















// import React, { useState, useEffect, useRef } from "react";
// import { FaEdit, FaPlus, FaStar, FaSyncAlt, FaStickyNote, FaBellSlash, FaTrash, FaEllipsisV, FaPlay, FaCheck, FaTimes, FaFolderOpen } from "react-icons/fa";
// import ReactDOM from "react-dom";
// import TaskInput from "./TaskInput";
// import RecurrenceModal from "./RecurrenceModal";
// import NoteModal from "./NoteModal";
// import SnoozeModal from "./SnoozeModal";
// import { BASE_URL } from "../config";
// import "./TaskItem.css";

// export interface Task {
//   context: {
//     status?: string;
//     [key: string]: any;
//   };
//   id: string;
//   name: string;
//   isFocused: boolean;
//   note?: string;
//   isSnoozed: boolean;
//   children?: Task[];
//   parentId?: string;
// }

// interface TaskItemProps {
//   task: Task;
//   refreshTasks: () => void;
//   onEditTask: (task: Task) => void;
//   draggable?: boolean;
//   onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
//   onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
//   onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
//   onDragEnd?: () => void;
//   index?: number;
//   parentId?: string;
//   onAddSubGoal?: (parentId: string) => void; // Add this prop
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

//   console.log("Status Dropdown button position:", {
//     top: buttonRect.top,
//     bottom: buttonRect.bottom,
//     left: buttonRect.left,
//     scrollY,
//     viewportHeight,
//   });

//   const isCutOff = buttonRect.bottom + dropdownHeight + scrollY > viewportHeight + scrollY;
//   const topPosition = isCutOff
//     ? `${buttonRect.top + scrollY - dropdownHeight - 5}px`
//     : `${buttonRect.bottom + scrollY + 5}px`;

//   return ReactDOM.createPortal(
//     <div
//       ref={dropdownRef}
//       className="status-dropdown"
//       style={{
//         position: "absolute",
//         top: topPosition,
//         left: `${buttonRect.left}px`,
//         zIndex: 20000,
//         minWidth: "120px",
//         boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//         animation: "fadeIn 0.2s ease-in",
//       }}
//     >
//       {children}
//     </div>,
//     document.body
//   );
// };

// const MenuDropdownPortal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   menuButtonRef: React.RefObject<HTMLButtonElement | null>;
//   children: React.ReactNode;
// }> = ({ isOpen, onClose, menuButtonRef, children }) => {
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
//         menuButtonRef.current &&
//         !menuButtonRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     if (isOpen && menuButtonRef.current) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, onClose, menuButtonRef, initialClick]);

//   useEffect(() => {
//     if (!isOpen) {
//       setInitialClick(false);
//     }
//   }, [isOpen]);

//   if (!isOpen || !menuButtonRef.current) return null;

//   const buttonRect = menuButtonRef.current.getBoundingClientRect();
//   const scrollY = window.scrollY;
//   const viewportHeight = window.innerHeight;
//   const dropdownHeight = 160;

//   console.log("Menu Dropdown button position:", {
//     top: buttonRect.top,
//     bottom: buttonRect.bottom,
//     left: buttonRect.left,
//     right: buttonRect.right,
//     scrollY,
//     viewportHeight,
//   });

//   const isCutOff = buttonRect.bottom + dropdownHeight + scrollY > viewportHeight + scrollY;
//   const topPosition = isCutOff
//     ? `${buttonRect.top + scrollY - dropdownHeight - 5}px`
//     : `${buttonRect.bottom + scrollY + 5}px`;

//   return ReactDOM.createPortal(
//     <div
//       ref={dropdownRef}
//       className="menu-dropdown"
//       style={{
//         position: "absolute",
//         top: topPosition,
//         left: `${buttonRect.right - 150}px`,
//         zIndex: 20000,
//         minWidth: "150px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//         animation: "fadeIn 0.2s ease-in",
//       }}
//     >
//       {children}
//     </div>,
//     document.body
//   );
// };

// const TaskItem: React.FC<TaskItemProps> = ({
//   task,
//   refreshTasks,
//   onEditTask,
//   draggable = true,
//   onDragStart,
//   onDragOver,
//   onDrop,
//   onDragEnd,
//   index = 0,
//   parentId,
//   onAddSubGoal, // Destructure the new prop
// }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isAddingChild, setIsAddingChild] = useState(false);
//   const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);
//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
//   const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
//   const [isSnoozed, setIsSnoozed] = useState(task.isSnoozed || false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const statusRef = useRef<HTMLDivElement>(null);
//   const statusButtonRef = useRef<HTMLButtonElement | null>(null);
//   const menuButtonRef = useRef<HTMLButtonElement | null>(null);
//   const taskContainerRef = useRef<HTMLDivElement>(null);

//   const [dragOverItem, setDragOverItem] = useState<string | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isDraggable, setIsDraggable] = useState(false);
//   const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const baseZIndex = 1000 - index * 10;

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
//         return <FaPlay size={10} style={{ marginRight: "2px" }} />;
//       case "done":
//         return <FaCheck size={10} style={{ marginRight: "2px" }} />;
//       case "canceled":
//         return <FaTimes size={10} style={{ marginRight: "2px" }} />;
//       case "open":
//       default:
//         return <FaFolderOpen size={10} style={{ marginRight: "2px" }} />;
//     }
//   };

//   const handleStatusChange = async (newStatus: string) => {
//     const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
//     const today = new Date().toISOString().split("T")[0];

//     const updateData = {
//       date: today,
//       item_id: task.id,
//       new_name: task.name,
//       new_type: task.context?.itype || "task",
//       new_status: newStatus,
//       isFocused: task.isFocused,
//     };

//     try {
//       const response = await fetch(`${BASE_URL}/updateItem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${AUTH_TOKEN}`,
//         },
//         credentials: "include",
//         body: JSON.stringify(updateData),
//       });

//       if (response.ok) {
//         refreshTasks();
//         setIsStatusDropdownOpen(false);
//       } else {
//         console.error("Failed to update status");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     console.log("Mouse down detected on task container:", task.id, "Target:", e.target);
//     if ((e.target as HTMLElement).closest(".status-button, .toggle-button, .add-button, .menu-button")) {
//       console.log("Mouse down on button, ignoring drag");
//       return;
//     }

//     setIsDraggable(true);
//     longPressTimer.current = setTimeout(() => {
//       setIsDragging(true);
//       if (taskContainerRef.current) {
//         taskContainerRef.current.classList.add("dragging");
//       }
//       console.log("Long press detected, enabling drag for item:", task.id);
//     }, 500);
//   };

//   const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
//     console.log("Mouse up detected, isDragging:", isDragging);
//     if (longPressTimer.current) {
//       clearTimeout(longPressTimer.current);
//       longPressTimer.current = null;
//     }
//     if (!isDragging) {
//       setIsDraggable(false);
//     }
//   };

//   const handleMouseLeave = () => {
//     console.log("Mouse leave detected, isDragging:", isDragging);
//     if (longPressTimer.current && !isDragging) {
//       clearTimeout(longPressTimer.current);
//       longPressTimer.current = null;
//     }
//   };

//   const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
//     e.stopPropagation();
//     console.log("Drag start for item:", itemId, "isDraggable:", isDraggable);
//     if (!isDraggable) {
//       console.log("Drag start prevented: isDraggable is false");
//       return;
//     }
//     e.dataTransfer.setData("text/plain", itemId);
//     e.dataTransfer.effectAllowed = "move";
//     setIsDragging(true);
//     if (taskContainerRef.current) {
//       taskContainerRef.current.classList.add("dragging");
//     }
//     onDragStart?.(e);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
//     e.stopPropagation();
//     e.preventDefault();
//     console.log("Drag over item:", itemId);
//     if (taskContainerRef.current && !taskContainerRef.current.classList.contains("dragging")) {
//       setDragOverItem(itemId);
//       taskContainerRef.current.classList.add("drag-over");
//     }
//     onDragOver?.(e);
//   };

//   const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
//     console.log("Drag end for item:", task.id);
//     setDragOverItem(null);
//     setIsDragging(false);
//     setIsDraggable(false);
//     if (taskContainerRef.current) {
//       taskContainerRef.current.classList.remove("dragging");
//       taskContainerRef.current.classList.remove("drag-over");
//     }
//     onDragEnd?.();
//   };

//   const handleDrop = async (e: React.DragEvent<HTMLDivElement>, dropTargetId: string) => {
//     const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
//     e.preventDefault();
//     e.stopPropagation();
//     const itemId = e.dataTransfer.getData("text/plain");
//     console.log("Drop detected, item:", itemId, "dropTargetId:", dropTargetId, "parentId:", parentId);

//     const newParentId = dropTargetId;

//     if (!itemId || !newParentId || itemId === newParentId) {
//       console.log("Invalid drop: itemId and newParentId are the same or invalid");
//       setDragOverItem(null);
//       setIsDragging(false);
//       setIsDraggable(false);
//       if (taskContainerRef.current) {
//         taskContainerRef.current.classList.remove("drag-over");
//       }
//       onDrop?.(e);
//       return;
//     }

//     try {
//       console.log("Making moveItem API call:", { item_id: itemId, new_parent_id: newParentId });
//       const response = await fetch(`${BASE_URL}/moveItem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${AUTH_TOKEN}`,
//         },
//         body: JSON.stringify({
//           date: new Date().toISOString().split("T")[0],
//           item_id: itemId,
//           new_parent_id: newParentId,
//         }),
//       });

//       const data = await response.json();
//       if (data.status === 200) {
//         console.log("Move successful, response:", data);
//         refreshTasks();
//       } else {
//         console.error("Failed to move item, response:", data);
//       }
//     } catch (error) {
//       console.error("Error moving item:", error);
//     }

//     setDragOverItem(null);
//     setIsDragging(false);
//     setIsDraggable(false);
//     if (taskContainerRef.current) {
//       taskContainerRef.current.classList.remove("dragging");
//       taskContainerRef.current.classList.remove("drag-over");
//     }
//     onDrop?.(e);
//   };

//   const handleDeleteTask = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       console.error("No auth token found!");
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/deleteItem`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           date: new Date().toISOString().split("T")[0],
//           item_id: task.id,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       refreshTasks();
//       setIsMenuOpen(false);
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen((prev) => !prev);
//   };

//   const handleAddChildClick = () => {
//     if (onAddSubGoal) {
//       onAddSubGoal(task.id); // Call the custom handler if provided
//       setIsAddingChild(false); // Prevent default TaskInput from showing
//     } else {
//       setIsAddingChild(!isAddingChild); // Default behavior
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         !isSnoozeModalOpen &&
//         !isRecurrenceModalOpen &&
//         !isNoteModalOpen &&
//         menuRef.current &&
//         !menuRef.current.contains(event.target as Node) &&
//         menuButtonRef.current &&
//         !menuButtonRef.current.contains(event.target as Node)
//       ) {
//         setIsMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isSnoozeModalOpen, isRecurrenceModalOpen, isNoteModalOpen]);

//   return (
//     <div
//       ref={taskContainerRef}
//       draggable={isDraggable || draggable}
//       onMouseDown={handleMouseDown}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={handleMouseLeave}
//       onDragStart={(e) => handleDragStart(e, task.id)}
//       onDragOver={(e) => handleDragOver(e, task.id)}
//       onDrop={(e) => handleDrop(e, task.id)}
//       onDragEnd={handleDragEnd}
//       className={`task-container ${isDragging ? "dragging" : ""} ${dragOverItem === task.id ? "drag-over" : ""}`}
//       style={{ zIndex: isDragging ? 10002 : baseZIndex, cursor: isDragging ? "grabbing" : "grab" }}
//     >
//       <div className="task-row">
//         {task.children && task.children.length > 0 && (
//           <button onClick={() => setIsExpanded(!isExpanded)} className="toggle-button">
//             {isExpanded ? "▼" : "▶"}
//           </button>
//         )}
//         <span className="task-text">
//           {task.name}
//           {task.isFocused && <FaStar className="star-icon" />}
//         </span>
//         <div className="button-group">
//           <div ref={statusRef} style={{ position: "relative", display: "inline-block" }}>
//             <button
//               ref={statusButtonRef}
//               onClick={() => setIsStatusDropdownOpen((prev) => !prev)}
//               className="status-button"
//               style={{
//                 backgroundColor: getStatusColor(task.context?.status),
//                 color: task.context?.status === "open" ? "#555" : "#fff",
//                 zIndex: baseZIndex + 5,
//               }}
//             >
//               {getStatusIcon(task.context?.status)}
//               {task.context?.status
//                 ? task.context.status.charAt(0).toUpperCase() + task.context.status.slice(1)
//                 : "Open"}
//             </button>
//             <StatusDropdownPortal
//               isOpen={isStatusDropdownOpen}
//               onClose={() => setIsStatusDropdownOpen(false)}
//               statusButtonRef={statusButtonRef}
//             >
//               <button onClick={() => handleStatusChange("open")} className="status-item">
//                 <FaFolderOpen size={10} style={{ marginRight: "2px" }} /> Open
//               </button>
//               <button onClick={() => handleStatusChange("running")} className="status-item">
//                 <FaPlay size={10} style={{ marginRight: "2px" }} /> Running
//               </button>
//               <button onClick={() => handleStatusChange("done")} className="status-item">
//                 <FaCheck size={10} style={{ marginRight: "2px" }} /> Completed
//               </button>
//               <button onClick={() => handleStatusChange("canceled")} className="status-item">
//                 <FaTimes size={10} style={{ marginRight: "2px" }} /> Canceled
//               </button>
//             </StatusDropdownPortal>
//           </div>
//           <button onClick={handleAddChildClick} className="add-button">
//             <FaPlus />
//           </button>
//           <div style={{ position: "relative", display: "inline-block" }}>
//             <button ref={menuButtonRef} onClick={toggleMenu} className="menu-button">
//               <FaEllipsisV />
//             </button>
//             <MenuDropdownPortal
//               isOpen={isMenuOpen}
//               onClose={() => setIsMenuOpen(false)}
//               menuButtonRef={menuButtonRef}
//             >
//               <button
//                 onClick={() => {
//                   setIsSnoozeModalOpen(true);
//                   setIsMenuOpen(false);
//                 }}
//                 className="task-item-menu-item"
//               >
//                 <FaBellSlash /> Snooze
//               </button>
//               <button
//                 onClick={() => {
//                   setIsNoteModalOpen(true);
//                   setIsMenuOpen(false);
//                 }}
//                 className="task-item-menu-item"
//               >
//                 <FaStickyNote /> Note
//               </button>
//               <button
//                 onClick={() => {
//                   setIsRecurrenceModalOpen(true);
//                   setIsMenuOpen(false);
//                 }}
//                 className="task-item-menu-item"
//               >
//                 <FaSyncAlt /> Recurrence
//               </button>
//               <button
//                 onClick={() => {
//                   onEditTask(task);
//                   setIsMenuOpen(false);
//                 }}
//                 className="task-item-menu-item"
//               >
//                 <FaEdit /> Edit
//               </button>
//               <button onClick={handleDeleteTask} className="task-item-menu-item">
//                 <FaTrash /> Delete
//               </button>
//             </MenuDropdownPortal>
//           </div>
//         </div>
//       </div>
//       {isAddingChild && !onAddSubGoal && ( // Only show TaskInput if onAddSubGoal is not provided
//         <TaskInput refreshTasks={refreshTasks} parentId={task.id} onClose={() => setIsAddingChild(false)} />
//       )}
//       {isExpanded && task.children && (
//         <div className="child-task-container">
//           {task.children.map((child, childIndex) => (
//             <TaskItem
//               key={child.id}
//               task={child}
//               refreshTasks={refreshTasks}
//               onEditTask={onEditTask}
//               draggable={draggable}
//               onDragStart={onDragStart}
//               onDragOver={onDragOver}
//               onDrop={onDrop}
//               onDragEnd={onDragEnd}
//               index={index + childIndex + 1}
//               parentId={task.id}
//               onAddSubGoal={onAddSubGoal} // Pass the prop down to nested items
//             />
//           ))}
//         </div>
//       )}
//       {isSnoozeModalOpen && (
//         <SnoozeModal
//           isOpen={isSnoozeModalOpen}
//           onClose={() => setIsSnoozeModalOpen(false)}
//           itemId={task.id}
//           initialSnoozeStatus={isSnoozed}
//           refreshTasks={() => {
//             refreshTasks();
//             setIsSnoozed(true);
//           }}
//         />
//       )}
//       {isRecurrenceModalOpen && (
//         <RecurrenceModal
//           isOpen={isRecurrenceModalOpen}
//           onClose={() => setIsRecurrenceModalOpen(false)}
//           task={task}
//           refreshTasks={refreshTasks}
//         />
//       )}
//       {isNoteModalOpen && (
//         <NoteModal
//           isOpen={isNoteModalOpen}
//           onClose={() => setIsNoteModalOpen(false)}
//           taskId={task.id}
//           refreshTasks={refreshTasks}
//         />
//       )}
//     </div>
//   );
// };

// export default TaskItem;


import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaPlus, FaStar, FaSyncAlt, FaStickyNote, FaBellSlash, FaTrash, FaEllipsisV, FaPlay, FaCheck, FaTimes, FaFolderOpen } from "react-icons/fa";
import ReactDOM from "react-dom";
import TaskInput from "./TaskInput";
import RecurrenceModal from "./RecurrenceModal";
import NoteModal from "./NoteModal";
import SnoozeModal from "./SnoozeModal";
import { BASE_URL } from "../config";
import "./TaskItem.css";

export interface Task {
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
  id: string;
  name: string;
  isFocused: boolean;
  note?: string;
  isSnoozed: boolean;
  children?: Task[];
  parentId?: string;
}

interface TaskItemProps {
  task: Task;
  refreshTasks: () => void;
  onEditTask: (task: Task) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
  index?: number;
  parentId?: string;
  onAddSubGoal?: (parentId: string) => void;
  onShowPlanItems?: () => void; // Added for "A" button compatibility with Goals.tsx
}

const StatusDropdownPortal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  statusButtonRef: React.RefObject<HTMLButtonElement | null>;
  children: React.ReactNode;
}> = ({ isOpen, onClose, statusButtonRef, children }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [initialClick, setInitialClick] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!initialClick) {
        setInitialClick(true);
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        statusButtonRef.current &&
        !statusButtonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen && statusButtonRef.current) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, statusButtonRef, initialClick]);

  useEffect(() => {
    if (!isOpen) {
      setInitialClick(false);
    }
  }, [isOpen]);

  if (!isOpen || !statusButtonRef.current) return null;

  const buttonRect = statusButtonRef.current.getBoundingClientRect();
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const dropdownHeight = 120;

  console.log("Status Dropdown button position:", {
    top: buttonRect.top,
    bottom: buttonRect.bottom,
    left: buttonRect.left,
    scrollY,
    viewportHeight,
  });

  const isCutOff = buttonRect.bottom + dropdownHeight + scrollY > viewportHeight + scrollY;
  const topPosition = isCutOff
    ? `${buttonRect.top + scrollY - dropdownHeight - 5}px`
    : `${buttonRect.bottom + scrollY + 5}px`;

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      className="status-dropdown"
      style={{
        position: "absolute",
        top: topPosition,
        left: `${buttonRect.left}px`,
        zIndex: 20000,
        minWidth: "120px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        animation: "fadeIn 0.2s ease-in",
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const MenuDropdownPortal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
  children: React.ReactNode;
}> = ({ isOpen, onClose, menuButtonRef, children }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [initialClick, setInitialClick] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!initialClick) {
        setInitialClick(true);
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen && menuButtonRef.current) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, menuButtonRef, initialClick]);

  useEffect(() => {
    if (!isOpen) {
      setInitialClick(false);
    }
  }, [isOpen]);

  if (!isOpen || !menuButtonRef.current) return null;

  const buttonRect = menuButtonRef.current.getBoundingClientRect();
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const dropdownHeight = 160;

  console.log("Menu Dropdown button position:", {
    top: buttonRect.top,
    bottom: buttonRect.bottom,
    left: buttonRect.left,
    right: buttonRect.right,
    scrollY,
    viewportHeight,
  });

  const isCutOff = buttonRect.bottom + dropdownHeight + scrollY > viewportHeight + scrollY;
  const topPosition = isCutOff
    ? `${buttonRect.top + scrollY - dropdownHeight - 5}px`
    : `${buttonRect.bottom + scrollY + 5}px`;

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      className="menu-dropdown"
      style={{
        position: "absolute",
        top: topPosition,
        left: `${buttonRect.right - 150}px`,
        zIndex: 20000,
        minWidth: "150px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        animation: "fadeIn 0.2s ease-in",
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  refreshTasks,
  onEditTask,
  draggable = true,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  index = 0,
  parentId,
  onAddSubGoal,
  onShowPlanItems, // Added prop
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(task.isSnoozed || false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const taskContainerRef = useRef<HTMLDivElement>(null);

  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const baseZIndex = 1000 - index * 10;

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "running":
        return "#007bff";
      case "done":
        return "#28a745";
      case "canceled":
        return "#dc3545";
      case "open":
      default:
        return "#fff";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "running":
        return <FaPlay size={10} style={{ marginRight: "2px" }} />;
      case "done":
        return <FaCheck size={10} style={{ marginRight: "2px" }} />;
      case "canceled":
        return <FaTimes size={10} style={{ marginRight: "2px" }} />;
      case "open":
      default:
        return <FaFolderOpen size={10} style={{ marginRight: "2px" }} />;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
    const today = new Date().toISOString().split("T")[0];

    const updateData = {
      date: today,
      item_id: task.id,
      new_name: task.name,
      new_type: task.context?.itype || "task",
      new_status: newStatus,
      isFocused: task.isFocused,
    };

    try {
      const response = await fetch(`${BASE_URL}/update_item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        refreshTasks();
        setIsStatusDropdownOpen(false);
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Mouse down detected on task container:", task.id, "Target:", e.target);
    if ((e.target as HTMLElement).closest(".status-button, .toggle-button, .add-button, .menu-button, .plan-button")) {
      console.log("Mouse down on button, ignoring drag");
      return;
    }

    setIsDraggable(true);
    longPressTimer.current = setTimeout(() => {
      setIsDragging(true);
      if (taskContainerRef.current) {
        taskContainerRef.current.classList.add("dragging");
      }
      console.log("Long press detected, enabling drag for item:", task.id);
    }, 500);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Mouse up detected, isDragging:", isDragging);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!isDragging) {
      setIsDraggable(false);
    }
  };

  const handleMouseLeave = () => {
    console.log("Mouse leave detected, isDragging:", isDragging);
    if (longPressTimer.current && !isDragging) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    e.stopPropagation();
    console.log("Drag start for item:", itemId, "isDraggable:", isDraggable);
    if (!isDraggable) {
      console.log("Drag start prevented: isDraggable is false");
      return;
    }
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    if (taskContainerRef.current) {
      taskContainerRef.current.classList.add("dragging");
    }
    onDragStart?.(e);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Drag over item:", itemId);
    if (taskContainerRef.current && !taskContainerRef.current.classList.contains("dragging")) {
      setDragOverItem(itemId);
      taskContainerRef.current.classList.add("drag-over");
    }
    onDragOver?.(e);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drag end for item:", task.id);
    setDragOverItem(null);
    setIsDragging(false);
    setIsDraggable(false);
    if (taskContainerRef.current) {
      taskContainerRef.current.classList.remove("dragging");
      taskContainerRef.current.classList.remove("drag-over");
    }
    onDragEnd?.();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, dropTargetId: string) => {
    const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
    e.preventDefault();
    e.stopPropagation();
    const itemId = e.dataTransfer.getData("text/plain");
    console.log("Drop detected, item:", itemId, "dropTargetId:", dropTargetId, "parentId:", parentId);

    const newParentId = dropTargetId;

    if (!itemId || !newParentId || itemId === newParentId) {
      console.log("Invalid drop: itemId and newParentId are the same or invalid");
      setDragOverItem(null);
      setIsDragging(false);
      setIsDraggable(false);
      if (taskContainerRef.current) {
        taskContainerRef.current.classList.remove("drag-over");
      }
      onDrop?.(e);
      return;
    }

    try {
      console.log("Making move_item API call:", { item_id: itemId, new_parent_id: newParentId });
      const response = await fetch(`${BASE_URL}/move_item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          item_id: itemId,
          new_parent_id: newParentId,
        }),
      });

      const data = await response.json();
      if (data.status === 200) {
        console.log("Move successful, response:", data);
        refreshTasks();
      } else {
        console.error("Failed to move item, response:", data);
      }
    } catch (error) {
      console.error("Error moving item:", error);
    }

    setDragOverItem(null);
    setIsDragging(false);
    setIsDraggable(false);
    if (taskContainerRef.current) {
      taskContainerRef.current.classList.remove("dragging");
      taskContainerRef.current.classList.remove("drag-over");
    }
    onDrop?.(e);
  };

  const handleDeleteTask = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      console.error("No auth token found!");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/delete_item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          item_id: task.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      refreshTasks();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleAddChildClick = () => {
    if (onAddSubGoal) {
      onAddSubGoal(task.id); // Call the custom handler if provided
      setIsAddingChild(false); // Prevent default TaskInput from showing
    } else {
      setIsAddingChild(!isAddingChild); // Default behavior
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isSnoozeModalOpen &&
        !isRecurrenceModalOpen &&
        !isNoteModalOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSnoozeModalOpen, isRecurrenceModalOpen, isNoteModalOpen]);

  return (
    <div
      ref={taskContainerRef}
      draggable={isDraggable || draggable}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDragStart={(e) => handleDragStart(e, task.id)}
      onDragOver={(e) => handleDragOver(e, task.id)}
      onDrop={(e) => handleDrop(e, task.id)}
      onDragEnd={handleDragEnd}
      className={`task-container ${isDragging ? "dragging" : ""} ${dragOverItem === task.id ? "drag-over" : ""}`}
      style={{ zIndex: isDragging ? 10002 : baseZIndex, cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div className="task-row">
        {task.children && task.children.length > 0 && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="toggle-button">
            {isExpanded ? "▼" : "▶"}
          </button>
        )}
        <span className="task-text">
          {task.name}
          {task.isFocused && <FaStar className="star-icon" />}
        </span>
        <div className="button-group">
          <div ref={statusRef} style={{ position: "relative", display: "inline-block" }}>
            <button
              ref={statusButtonRef}
              onClick={() => setIsStatusDropdownOpen((prev) => !prev)}
              className="status-button"
              style={{
                backgroundColor: getStatusColor(task.context?.status),
                color: task.context?.status === "open" ? "#555" : "#fff",
                zIndex: baseZIndex + 5,
              }}
            >
              {getStatusIcon(task.context?.status)}
              {task.context?.status
                ? task.context.status.charAt(0).toUpperCase() + task.context.status.slice(1)
                : "Open"}
            </button>
            <StatusDropdownPortal
              isOpen={isStatusDropdownOpen}
              onClose={() => setIsStatusDropdownOpen(false)}
              statusButtonRef={statusButtonRef}
            >
              <button onClick={() => handleStatusChange("open")} className="status-item">
                <FaFolderOpen size={10} style={{ marginRight: "2px" }} /> Open
              </button>
              <button onClick={() => handleStatusChange("running")} className="status-item">
                <FaPlay size={10} style={{ marginRight: "2px" }} /> Running
              </button>
              <button onClick={() => handleStatusChange("done")} className="status-item">
                <FaCheck size={10} style={{ marginRight: "2px" }} /> Completed
              </button>
              <button onClick={() => handleStatusChange("canceled")} className="status-item">
                <FaTimes size={10} style={{ marginRight: "2px" }} /> Canceled
              </button>
            </StatusDropdownPortal>
          </div>
          <button onClick={handleAddChildClick} className="add-button">
            <FaPlus />
          </button>
          {onShowPlanItems && ( 
            <button onClick={onShowPlanItems} className="plan-button" style={{ marginLeft: "5px", backgroundColor: "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}>
              Associate Items
            </button>
          )}
          <div style={{ position: "relative", display: "inline-block" }}>
            <button ref={menuButtonRef} onClick={toggleMenu} className="menu-button">
              <FaEllipsisV />
            </button>
            <MenuDropdownPortal
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              menuButtonRef={menuButtonRef}
            >
              <button
                onClick={() => {
                  setIsSnoozeModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="task-item-menu-item"
              >
                <FaBellSlash /> Snooze
              </button>
              <button
                onClick={() => {
                  setIsNoteModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="task-item-menu-item"
              >
                <FaStickyNote /> Note
              </button>
              <button
                onClick={() => {
                  setIsRecurrenceModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="task-item-menu-item"
              >
                <FaSyncAlt /> Recurrence
              </button>
              <button
                onClick={() => {
                  onEditTask(task);
                  setIsMenuOpen(false);
                }}
                className="task-item-menu-item"
              >
                <FaEdit /> Edit
              </button>
              <button onClick={handleDeleteTask} className="task-item-menu-item">
                <FaTrash /> Delete
              </button>
            </MenuDropdownPortal>
          </div>
        </div>
      </div>
      {isAddingChild && !onAddSubGoal && (
        <TaskInput refreshTasks={refreshTasks} parentId={task.id} onClose={() => setIsAddingChild(false)} />
      )}
      {isExpanded && task.children && (
        <div className="child-task-container">
          {task.children.map((child, childIndex) => (
            <TaskItem
              key={child.id}
              task={child}
              refreshTasks={refreshTasks}
              onEditTask={onEditTask}
              draggable={draggable}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              index={index + childIndex + 1}
              parentId={task.id}
              onAddSubGoal={onAddSubGoal}
              onShowPlanItems={onShowPlanItems} // Pass down to children
            />
          ))}
        </div>
      )}
      {isSnoozeModalOpen && (
        <SnoozeModal
          isOpen={isSnoozeModalOpen}
          onClose={() => setIsSnoozeModalOpen(false)}
          itemId={task.id}
          initialSnoozeStatus={isSnoozed}
          refreshTasks={() => {
            refreshTasks();
            setIsSnoozed(true);
          }}
        />
      )}
      {isRecurrenceModalOpen && (
        <RecurrenceModal
          isOpen={isRecurrenceModalOpen}
          onClose={() => setIsRecurrenceModalOpen(false)}
          task={task}
          refreshTasks={refreshTasks}
        />
      )}
      {isNoteModalOpen && (
        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          taskId={task.id}
          refreshTasks={refreshTasks}
        />
      )}
    </div>
  );
};

export default TaskItem;