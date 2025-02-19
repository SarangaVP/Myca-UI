import React, { useEffect, useState } from "react";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";

const BASE_URL = "http://localhost:8000/walker";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjQzNGMzMTAyNTBmMDgzZDA0ZjhmMiIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvb3RfaWQiOiI2N2I0MzRjMzEwMjUwZjA4M2QwNGY4ZjEiLCJpc19hY3RpdmF0ZWQiOnRydWUsImlzX2FkbWluIjpmYWxzZSwiZXhwaXJhdGlvbiI6MTczOTk5OTUxMiwic3RhdGUiOiJRMnl2Ym9JcyJ9.MCHlZblcSJMPF1HZiDtiyQUViHt8MqTdHEhyj8LA6KY"; // Replace with actual API token

interface Task {
  id: string;
  name: string;
  parentId?: string;
  children?: Task[];
}

interface PlanProps {
  tasks: Task[];
  addTask: (name: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Plan: React.FC<PlanProps> = ({ tasks, addTask, setTasks }) => {
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  useEffect(() => {
    fetch(`${BASE_URL}/getItemsForNodes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`,
      },
      credentials: "include",
      body: JSON.stringify({ date_input: formattedDate, items_list: [] }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 200 && data.reports.length > 0) {
          const rawTasks: Task[] = data.reports[0].map((item: any) => ({
            id: String(item.id),
            name: item.context.name,
            parentId: item.context.parent_item_id || null,
          }));

          const taskMap = new Map<string, Task>();

          // Create a map of tasks
          rawTasks.forEach((task) => {
            taskMap.set(task.id, { ...task, children: [] });
          });

          // Organize into nested structure
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
  }, [setTasks]);

  const displayDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ flex: 1, padding: "20px", backgroundColor: "#f4f4f4" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>Plan</h2>
      <p style={{ fontSize: "18px", color: "#666", marginBottom: "15px" }}>{displayDate}</p>

      <TaskInput addTask={addTask} />

      {loading ? <p>Loading tasks...</p> : <TaskList tasks={tasks} />}
    </div>
  );
};

export default Plan;

