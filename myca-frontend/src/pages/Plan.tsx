
// import React, { useEffect, useState, useRef } from "react";
// import TaskInput from "../components/TaskInput";
// import TaskList from "../components/TaskList";
// import EditTaskModal from "../components/EditTaskModal";
// import { BASE_URL } from "../config";
// import "./Plan.css";

// interface Task {
//   id: string;
//   name: string;
//   isFocused: boolean;
//   parentId?: string;
//   children?: Task[];
//   context?: {
//     name: string;
//     itype: string;
//     status: string;
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
//     parent_item_id: string;
//     note: string;
//     last_updated: string;
//     is_snoozed: boolean;
//     snoozed_till: string;
//     is_focused: boolean;
//   };
// }

// const Plan: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("AUTH_TOKEN"));
//   const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [suggestions, setSuggestions] = useState<Task[]>([]);
//   const filterRef = useRef<HTMLDivElement>(null);

//   const today = new Date();
//   const formattedDate = today.toISOString().split("T")[0];

//   const filterOptions: { [key: string]: string } = {
//     "Inactive Rituals": "inactive",
//     Snoozed: "snoozed",
//     Completed: "done",
//     Canceled: "canceled",
//     "In Progress": "running",
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
//         setShowFilterDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const fetchTasks = async () => {
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (!token) {
//       console.warn("AUTH_TOKEN not available, skipping fetch.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     console.log("Starting fetchTasks with token:", token);

//     try {
//       let response;
//       if (selectedFilters.length > 0) {
//         const statusList = selectedFilters.map((filter) => filterOptions[filter]);
//         response = await fetch(`${BASE_URL}/filterItem`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             date: formattedDate,
//             status_list: statusList,
//             filtered_items: {},
//           }),
//         });
//         console.log("filterItem response status:", response.status);
//       } else {
//         response = await fetch(`${BASE_URL}/getItems`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//           body: JSON.stringify({ date_input: formattedDate, items_list: [] }),
//         });
//         console.log("getItems response status:", response.status);
//       }

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Request failed with status:", response.status, "Details:", errorText);
//         throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("Request succeeded, got data:", data);

//       let rawTasks: Task[] = [];
//       if (data.status === 200 && data.reports && data.reports.length > 0) {
//         if (selectedFilters.length > 0) {
//           // Handle multiple tasks within reports[0]
//           const report = data.reports[0]; // Single report object with multiple tasks
//           rawTasks = Object.values(report).map((task: any) => ({
//             id: task.id,
//             name: task.context.name,
//             isFocused: task.context.is_focused || false,
//             parentId: task.context.parent_item_id || null,
//             children: [],
//             context: {
//               name: task.context.name,
//               itype: task.context.itype || "task",
//               status: task.context.status || "running",
//               ritual: task.context.ritual || {
//                 start: "",
//                 frequency: "",
//                 ritual_flag: false,
//                 interval: 1,
//                 by_day_of_week: [false, false, false, false, false, false, false],
//                 by_day_of_month: 0,
//                 occurrence: 0,
//                 end: "",
//               },
//               parent_item_id: task.context.parent_item_id || "",
//               note: task.context.note || "",
//               last_updated: task.context.last_updated || "",
//               is_snoozed: task.context.is_snoozed || false,
//               snoozed_till: task.context.snoozed_till || "",
//               is_focused: task.context.is_focused || false,
//             },
//           }));
//         } else {
//           rawTasks = data.reports[0].map((item: any) => ({
//             id: String(item.id),
//             name: item.context.name,
//             isFocused: item.context.is_focused || false,
//             parentId: item.context.parent_item_id || null,
//             children: [],
//           }));
//         }

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
//         setFilteredTasks(
//           rootTasks.filter((task) =>
//             task.name.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//         );
//       } else {
//         console.log("Request returned no tasks:", data);
//         setTasks([]);
//         setFilteredTasks([]);
//       }
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//       setTasks([]);
//       setFilteredTasks([]);
//     } finally {
//       setLoading(false);
//       console.log("fetchTasks finished, filteredTasks:", filteredTasks);
//     }
//   };

//   const toggleFilter = (filter: string) => {
//     setSelectedFilters((prev) =>
//       prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
//     );
//   };

//   const handleAllFilters = () => {
//     setSelectedFilters(Object.keys(filterOptions));
//   };

//   const handleNoneFilters = () => {
//     setSelectedFilters([]);
//   };

//   useEffect(() => {
//     if (searchQuery) {
//       const filtered = tasks.filter((task) =>
//         task.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setSuggestions(filtered);
//       setFilteredTasks(filtered);
//     } else {
//       setSuggestions([]);
//       setFilteredTasks(tasks);
//     }
//   }, [searchQuery, tasks]);

//   useEffect(() => {
//     console.log("Plan useEffect running, authToken:", authToken);
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
//   }, [authToken, selectedFilters]);

//   useEffect(() => {
//     console.log("Tasks updated:", tasks);
//     console.log("Filtered tasks:", filteredTasks);
//   }, [tasks, filteredTasks]);

//   const displayDate = today.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//   });

//   return (
//     <div style={containerStyle} className="plan-container">
//       <header style={headerStyle} className="plan-header">
//         <h2 style={titleStyle} className="plan-title">Plan</h2>
//         <p style={dateStyle} className="plan-date">{displayDate}</p>
//       </header>

//       <div style={filterContainerStyle}>
//         <div style={filterWrapperStyle} ref={filterRef}>
//           <button
//             onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//             style={filterButtonStyle}
//             className="filter-button"
//           >
//             ⋮
//           </button>
//           {showFilterDropdown && (
//             <div style={filterDropdownStyle}>
//               {Object.keys(filterOptions).map((option) => (
//                 <label key={option} style={filterOptionStyle}>
//                   <input
//                     type="checkbox"
//                     checked={selectedFilters.includes(option)}
//                     onChange={() => toggleFilter(option)}
//                   />
//                   {option}
//                 </label>
//               ))}
//               <div style={filterActionsStyle}>
//                 <button onClick={handleAllFilters} style={filterActionButtonStyle}>
//                   All
//                 </button>
//                 <button onClick={handleNoneFilters} style={filterActionButtonStyle}>
//                   None
//                 </button>
//                 <button onClick={() => setShowFilterDropdown(false)} style={saveButtonStyle}>
//                   Save
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//         <div style={searchWrapperStyle}>
//           <input
//             type="text"
//             placeholder="Search tasks..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             style={searchStyle}
//           />
//           {suggestions.length > 0 && (
//             <div style={suggestionsStyle}>
//               {suggestions.map((task) => (
//                 <div
//                   key={task.id}
//                   style={suggestionItemStyle}
//                   onClick={() => {
//                     setSearchQuery(task.name);
//                     setSuggestions([]);
//                     setFilteredTasks([task]);
//                   }}
//                 >
//                   {task.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <TaskInput refreshTasks={fetchTasks} />

//       {loading ? (
//         <div style={loadingStyle} className="plan-loading">
//           <span className="spinner"></span> Loading tasks...
//         </div>
//       ) : (
//         <TaskList tasks={filteredTasks} refreshTasks={fetchTasks} onEditTask={setEditingTask} />
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
//   padding: "40px",
//   backgroundColor: "#f4f4f4",
//   minHeight: "100vh",
//   fontFamily: "Poppins, sans-serif",
// };

// const headerStyle: React.CSSProperties = {
//   background: "linear-gradient(135deg, #f5f5f5, #e0e0e0)",
//   padding: "25px 30px",
//   borderRadius: "15px",
//   boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
//   marginBottom: "20px",
//   position: "relative",
//   overflow: "hidden",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
// };

// const titleStyle: React.CSSProperties = {
//   fontSize: "36px",
//   fontWeight: "800",
//   marginBottom: "0",
//   color: "#000000",
//   letterSpacing: "1px",
//   textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
// };

// const dateStyle: React.CSSProperties = {
//   fontSize: "22px",
//   color: "#000000",
//   marginBottom: "0",
//   fontWeight: "500",
//   textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
// };

// const filterContainerStyle: React.CSSProperties = {
//   display: "flex",
//   gap: "10px",
//   marginBottom: "20px",
//   alignItems: "center",
// };

// const filterWrapperStyle: React.CSSProperties = {
//   position: "relative",
// };

// const filterButtonStyle: React.CSSProperties = {
//   padding: "8px 16px",
//   fontSize: "16px",
//   borderRadius: "4px",
//   border: "1px solid #ccc",
//   backgroundColor: "#fff",
//   cursor: "pointer",
//   fontWeight: "bold",
//   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//   width: "40px",
//   textAlign: "center",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// };

// const filterDropdownStyle: React.CSSProperties = {
//   position: "absolute",
//   top: "100%",
//   left: 0,
//   backgroundColor: "#fff",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
//   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//   padding: "10px",
//   zIndex: 10,
//   width: "200px",
// };

// const filterOptionStyle: React.CSSProperties = {
//   display: "block",
//   padding: "5px 0",
// };

// const filterActionsStyle: React.CSSProperties = {
//   display: "flex",
//   gap: "5px",
//   marginTop: "10px",
// };

// const filterActionButtonStyle: React.CSSProperties = {
//   padding: "5px 10px",
//   fontSize: "14px",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
//   backgroundColor: "#f0f0f0",
//   cursor: "pointer",
// };

// const saveButtonStyle: React.CSSProperties = {
//   padding: "5px 10px",
//   fontSize: "14px",
//   border: "none",
//   borderRadius: "4px",
//   backgroundColor: "#007bff",
//   color: "#fff",
//   cursor: "pointer",
// };

// const searchWrapperStyle: React.CSSProperties = {
//   position: "relative",
//   flex: 1,
// };

// const searchStyle: React.CSSProperties = {
//   padding: "8px 12px",
//   fontSize: "16px",
//   borderRadius: "4px",
//   border: "1px solid #ccc",
//   width: "100%",
// };

// const suggestionsStyle: React.CSSProperties = {
//   position: "absolute",
//   top: "100%",
//   left: 0,
//   right: 0,
//   backgroundColor: "#fff",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
//   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//   maxHeight: "200px",
//   overflowY: "auto",
//   zIndex: 10,
// };

// const suggestionItemStyle: React.CSSProperties = {
//   padding: "5px 10px",
//   cursor: "pointer",
// };

// const loadingStyle: React.CSSProperties = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: "20px",
//   color: "#666",
//   marginTop: "30px",
//   gap: "15px",
// };

// export default Plan;








import React, { useEffect, useState, useRef } from "react";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import EditTaskModal from "../components/EditTaskModal";
import { BASE_URL } from "../config";
import { FiFilter } from "react-icons/fi"; // Filter icon
import "./Plan.css";

interface Task {
  id: string;
  name: string;
  isFocused: boolean;
  parentId?: string;
  children?: Task[];
  context?: {
    name: string;
    itype: string;
    status: string;
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
    parent_item_id: string;
    note: string;
    last_updated: string;
    is_snoozed: boolean;
    snoozed_till: string;
    is_focused: boolean;
  };
}

const Plan: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("AUTH_TOKEN"));
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Task[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const filterOptions: { [key: string]: string } = {
    "Inactive Rituals": "inactive",
    Snoozed: "snoozed",
    Completed: "done",
    Canceled: "canceled",
    "In Progress": "running",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const flattenTasks = (tasks: Task[]): Task[] => {
    const result: Task[] = [];
    const stack: Task[] = [...tasks];

    while (stack.length > 0) {
      const current = stack.pop()!;
      result.push(current);
      if (current.children && current.children.length > 0) {
        stack.push(...current.children);
      }
    }

    return result;
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      console.warn("AUTH_TOKEN not available, skipping fetch.");
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log("Starting fetchTasks with token:", token);

    try {
      let response;
      if (selectedFilters.length > 0) {
        const statusList = selectedFilters.map((filter) => filterOptions[filter]);
        response = await fetch(`${BASE_URL}/filterItem`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            date: formattedDate,
            status_list: statusList,
            filtered_items: {},
          }),
        });
        console.log("filterItem response status:", response.status);
      } else {
        response = await fetch(`${BASE_URL}/getItems`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ date_input: formattedDate, items_list: [] }),
        });
        console.log("getItems response status:", response.status);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Request failed with status:", response.status, "Details:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const data = await response.json();
      console.log("Request succeeded, got data:", data);

      let rawTasks: Task[] = [];
      if (data.status === 200 && data.reports && data.reports.length > 0) {
        if (selectedFilters.length > 0) {
          const report = data.reports[0];
          rawTasks = Object.values(report).map((task: any) => ({
            id: task.id,
            name: task.context.name,
            isFocused: task.context.is_focused || false,
            parentId: task.context.parent_item_id || null,
            children: [],
            context: {
              name: task.context.name,
              itype: task.context.itype || "task",
              status: task.context.status || "running",
              ritual: task.context.ritual || {
                start: "",
                frequency: "",
                ritual_flag: false,
                interval: 1,
                by_day_of_week: [false, false, false, false, false, false, false],
                by_day_of_month: 0,
                occurrence: 0,
                end: "",
              },
              parent_item_id: task.context.parent_item_id || "",
              note: task.context.note || "",
              last_updated: task.context.last_updated || "",
              is_snoozed: task.context.is_snoozed || false,
              snoozed_till: task.context.snoozed_till || "",
              is_focused: task.context.is_focused || false,
            },
          }));
        } else {
          rawTasks = data.reports[0].map((item: any) => ({
            id: String(item.id),
            name: item.context.name,
            isFocused: item.context.is_focused || false,
            parentId: item.context.parent_item_id || null,
            children: [],
            //check
            context: {
              name: item.context.name,
              itype: item.context.itype || "task",
              status: item.context.status || "running",
            },
          }));
        }

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
        setFilteredTasks(
          rootTasks.filter((task) =>
            task.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        console.log("Request returned no tasks:", data);
        setTasks([]);
        setFilteredTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      setFilteredTasks([]);
    } finally {
      setLoading(false);
      console.log("fetchTasks finished, filteredTasks:", filteredTasks);
    }
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const handleAllFilters = () => {
    setSelectedFilters(Object.keys(filterOptions));
  };

  const handleNoneFilters = () => {
    setSelectedFilters([]);
  };

  useEffect(() => {
    const flatTasks = flattenTasks(tasks);
    if (searchQuery) {
      const filtered = flatTasks.filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setFilteredTasks(filtered);
    } else {
      setSuggestions([]);
      setFilteredTasks(tasks);
    }
  }, [searchQuery, tasks]);

  useEffect(() => {
    console.log("Plan useEffect running, authToken:", authToken);
    if (authToken) {
      setTimeout(() => fetchTasks(), 500);
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
  }, [authToken, selectedFilters]);

  useEffect(() => {
    console.log("Tasks updated:", tasks);
    console.log("Filtered tasks:", filteredTasks);
  }, [tasks, filteredTasks]);

  const displayDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={containerStyle} className="plan-container">
      <header style={headerStyle} className="plan-header">
        <h2 style={titleStyle} className="plan-title">Plan</h2>
        <p style={dateStyle} className="plan-date">{displayDate}</p>
      </header>

      <div style={filterContainerStyle}>
        <div style={filterWrapperStyle} ref={filterRef}>
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            style={filterButtonStyle}
            className="filter-button"
          >
            <FiFilter size={25} /> {/* Increased size to 36 */}
          </button>
          {showFilterDropdown && (
            <div style={filterDropdownStyle}>
              {Object.keys(filterOptions).map((option) => (
                <label key={option} style={filterOptionStyle}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(option)}
                    onChange={() => toggleFilter(option)}
                  />
                  {option}
                </label>
              ))}
              <div style={filterActionsStyle}>
                <button onClick={handleAllFilters} style={filterActionButtonStyle}>
                  All
                </button>
                <button onClick={handleNoneFilters} style={filterActionButtonStyle}>
                  None
                </button>
                <button onClick={() => setShowFilterDropdown(false)} style={saveButtonStyle}>
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
        <div style={searchWrapperStyle}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchStyle}
          />
          {suggestions.length > 0 && (
            <div style={suggestionsStyle}>
              {suggestions.map((task) => (
                <div
                  key={task.id}
                  style={suggestionItemStyle}
                  onClick={() => {
                    setSearchQuery(task.name);
                    setSuggestions([]);
                    setFilteredTasks([task]);
                  }}
                >
                  {task.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskInput refreshTasks={fetchTasks} />

      {loading ? (
        <div style={loadingStyle} className="plan-loading">
          <span className="spinner"></span> Loading tasks...
        </div>
      ) : (
        <TaskList tasks={filteredTasks} refreshTasks={fetchTasks} onEditTask={setEditingTask} />
      )}

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

// Styles
const containerStyle: React.CSSProperties = {
  flex: 1,
  padding: "40px",
  backgroundColor: "#f4f4f4",
  minHeight: "100vh",
  fontFamily: "Poppins, sans-serif",
};

const headerStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #f5f5f5, #e0e0e0)",
  padding: "25px 30px",
  borderRadius: "15px",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
  marginBottom: "20px",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: "800",
  marginBottom: "0",
  color: "#000000",
  letterSpacing: "1px",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
};

const dateStyle: React.CSSProperties = {
  fontSize: "22px",
  color: "#000000",
  marginBottom: "0",
  fontWeight: "500",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
};

const filterContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  alignItems: "center",
};

const filterWrapperStyle: React.CSSProperties = {
  position: "relative",
};

const filterButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  width: "50px", // Kept the same
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const filterDropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  padding: "10px",
  zIndex: 10,
  width: "200px",
};

const filterOptionStyle: React.CSSProperties = {
  display: "block",
  padding: "5px 0",
};

const filterActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "5px",
  marginTop: "10px",
};

const filterActionButtonStyle: React.CSSProperties = {
  padding: "5px 10px",
  fontSize: "14px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#f0f0f0",
  cursor: "pointer",
};

const saveButtonStyle: React.CSSProperties = {
  padding: "5px 10px",
  fontSize: "14px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
};

const searchWrapperStyle: React.CSSProperties = {
  position: "relative",
  flex: 1,
};

const searchStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%",
};

const suggestionsStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: "0",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  maxHeight: "200px",
  overflowY: "auto",
  zIndex: "10",
};

const suggestionItemStyle: React.CSSProperties = {
  padding: "5px 10px",
  cursor: "pointer",
};

const loadingStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  color: "#666",
  marginTop: "30px",
  gap: "15px",
};

export default Plan;