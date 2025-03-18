// Goals.tsx
import React, { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import EditTaskModal from "../components/EditTaskModal";
import { BASE_URL } from "../config";

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

interface TimePeriodProps {
  timePeriod: "life" | "year" | "month" | "week";
}

const Goals: React.FC<TimePeriodProps> = ({ timePeriod }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("AUTH_TOKEN"));

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const getDisplayText = () => {
    switch (timePeriod) {
      case "year":
        return today.getFullYear().toString(); 
        case "month":
            return today.toLocaleDateString("en-US", { month: "long", year: "numeric" }); 
          case "week":
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay() + 1); 
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + (7 - today.getDay())); 
            return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`; // e.g., "Mar 17, 2025 - Mar 23, 2025"
          case "life":
            return "Life Goals"; 
          default:
            return "";
    }
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      console.warn("AUTH_TOKEN not available, skipping fetch.");
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log(`Starting fetchTasks for ${timePeriod} with token:`, token);

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
      console.log(`${endpoint} response status:`, response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Request failed with status:", response.status, "Details:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const data = await response.json();
      console.log("Request succeeded, got data:", data);

      let rawTasks: Task[] = [];
      if (data.status === 200 && data.reports && data.reports.length > 0) {
        rawTasks = data.reports[0].map((item: any) => ({
          id: String(item.id),
          name: item.context.name,
          isFocused: item.context.is_focused || false,
          parentId: item.context.parent_item_id || null,
          children: [],
          context: {
            name: item.context.name,
            itype: item.context.itype || "task",
            status: item.context.status || "open",
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
        console.log("Request returned no tasks:", data);
        setTasks([]);
      }
    } catch (error) {
      console.error(`Error fetching tasks for ${timePeriod}:`, error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`Goals useEffect running for ${timePeriod}, authToken:`, authToken);
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
  }, [authToken, timePeriod]);

  useEffect(() => {
    console.log(`Tasks updated for ${timePeriod}:`, tasks);
  }, [tasks]);

  return (
    <div style={containerStyle} className="plan-container">
      <header style={headerStyle} className="plan-header">
        <h2 style={titleStyle} className="plan-title">Goals</h2>
        <p style={dateStyle} className="plan-date">{getDisplayText()}</p>
      </header>

      {loading ? (
        <div style={loadingStyle} className="plan-loading">
          <span className="spinner"></span> Loading tasks...
        </div>
      ) : (
        <TaskList tasks={tasks} refreshTasks={fetchTasks} onEditTask={setEditingTask} />
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

const loadingStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  color: "#666",
  marginTop: "30px",
  gap: "15px",
};

export default Goals;