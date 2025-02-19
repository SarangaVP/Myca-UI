import React, { useState } from "react";

interface Task {
  id: string;
  name: string;
  children?: Task[];
}

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ marginBottom: "10px", width: "100%" }}>
      {/* Parent Task */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "16px",
          color: "#333",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
          width: "100%",
          cursor: task.children && task.children.length > 0 ? "pointer" : "default",
        }}
        onClick={() => {
          if (task.children && task.children.length > 0) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {task.children && task.children.length > 0 && (
          <span style={{ marginRight: "10px" }}>{isExpanded ? "▼" : "▶"}</span>
        )}
        {task.name}
      </div>

      {/* Child Tasks (Hidden/Shown Based on Toggle) */}
      {isExpanded && task.children && task.children.length > 0 && (
        <div
          style={{
            paddingLeft: "20px",
            marginTop: "5px",
            borderLeft: "3px solid #ccc",
            width: "100%",
          }}
        >
          {task.children.map((child) => (
            <TaskItem key={child.id} task={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
