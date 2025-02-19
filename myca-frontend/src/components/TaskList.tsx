import React from "react";
import TaskItem from "./TaskItem";

interface Task {
  id: string;
  name: string;
  children?: Task[];
}

const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        width: "100%",
      }}
    >
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
