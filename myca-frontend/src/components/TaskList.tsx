import React from "react";
import TaskItem from "./TaskItem";

interface Task {
  id: string;
  name: string;
}

const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  return (
    <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "6px", marginTop: "10px" }}>
      {tasks.length === 0 ? <p>No tasks for today</p> : tasks.map((task) => <TaskItem key={task.id} task={task} />)}
    </div>
  );
};

export default TaskList;
