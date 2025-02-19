import React from "react";
import TaskItem from "./TaskItem";

interface Task {
  id: string;
  name: string;
  children?: Task[];
}

interface TaskListProps {
  tasks: Task[];
  refreshTasks: () => void;
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, refreshTasks }) => {
  return (
    <ul style={taskListContainerStyle}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} refreshTasks={refreshTasks} onEditTask={onEditTask} />
      ))}
    </ul>
  );
};

// 🔹 Styles
const taskListContainerStyle: React.CSSProperties = {
  marginTop: "20px",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

export default TaskList;

