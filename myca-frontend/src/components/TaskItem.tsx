import React from "react";

interface Task {
  id: string;
  name: string;
}

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div style={{ padding: "10px", borderBottom: "1px solid #ddd", backgroundColor: "#f8f9fa", borderRadius: "6px", marginBottom: "8px" }}>
      {task.name}
    </div>
  );
};

export default TaskItem;
