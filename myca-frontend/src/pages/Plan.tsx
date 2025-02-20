import React, { useEffect, useState } from "react";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import EditTaskModal from "../components/EditTaskModal";
import { BASE_URL, AUTH_TOKEN } from "../config";

interface Task {
  id: string;
  name: string;
  parentId?: string;
  children?: Task[];
}

const Plan: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Track task being edited

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  // 🔹 Fetch Tasks from API
  const fetchTasks = () => {
    setLoading(true);
    fetch(`${BASE_URL}/getItems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      credentials: "include",
      body: JSON.stringify({ date_input: formattedDate, items_list: [] }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200 && data.reports.length > 0) {
          const rawTasks: Task[] = data.reports[0].map((item: any) => ({
            id: String(item.id),
            name: item.context.name,
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
    fetchTasks();
  }, []);

  const displayDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ flex: 1, padding: "20px", backgroundColor: "#f4f4f4" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>Plan</h2>
      <p style={{ fontSize: "18px", color: "#666", marginBottom: "15px" }}>{displayDate}</p>

      {/* ✅ Use `refreshTasks` Instead of `addTask` */}
      <TaskInput refreshTasks={fetchTasks} />

      {/* ✅ Pass `refreshTasks` & `onEditTask` Correctly */}
      {loading ? <p>Loading tasks...</p> : <TaskList tasks={tasks} refreshTasks={fetchTasks} onEditTask={setEditingTask} />}

      {/* ✅ Modal for Editing Tasks */}
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
