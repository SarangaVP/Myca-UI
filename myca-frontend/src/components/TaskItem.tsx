import React, { useState } from "react";
import { FaEdit, FaPlus, FaStar, FaSyncAlt, FaStickyNote } from "react-icons/fa";
import TaskInput from "./TaskInput";
import RecurrenceModal from "./RecurrenceModal";
import NoteModal from "./NoteModal";
import { BASE_URL } from "../config";

export interface Task {
  id: string;
  name: string;
  isFocused: boolean;
  note?: string;
  children?: Task[];
}

interface TaskItemProps {
  task: Task;
  refreshTasks: () => void;
  onEditTask: (task: Task) => void;
  //check below
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, refreshTasks, onEditTask }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // Drag and Drop State
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.stopPropagation(); // Add this line
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "move";
    console.log("Setting Dragging Item:", itemId);
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setDragOverItem(itemId);
  };

  const handleDragEnd = () => {
    setDragOverItem(null);
  };

  // const isDescendant = (parent: Task, childId: string): boolean => {
  //   if (!parent.children) return false;
  //   for (const child of parent.children) {
  //     if (child.id === childId || isDescendant(child, childId)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  const handleDrop = async (e: React.DragEvent, newParentId: string) => {
    const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
    e.preventDefault();
    e.stopPropagation(); 
    const itemId = e.dataTransfer.getData("text/plain");

    console.log("Dropped Item:", itemId);
    console.log("New Parent:", newParentId);

    // if (isDescendant(task, itemId)) {
    //   console.error("Cannot drop a parent item onto one of its descendants.");
    //   return;
    // }

    if (itemId && newParentId && itemId !== newParentId) {
      try {
        const response = await fetch(`${BASE_URL}/moveItem`, {
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
          refreshTasks();
        } else {
          console.error("Failed to move item");
        }
      } catch (error) {
        console.error("Error moving item:", error);
      }
    }

    setDragOverItem(null);
  };

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      onDragOver={(e) => handleDragOver(e, task.id)}
      onDrop={(e) => handleDrop(e, task.id)}
      onDragEnd={handleDragEnd}
      style={{
        ...taskContainerStyle,
        border: dragOverItem === task.id ? "2px dashed #007bff" : "1px solid #ccc",
        backgroundColor: dragOverItem === task.id ? "#e6f7ff" : "#fff",
      }}
    >
      <div style={taskRowStyle}>
        {/* Expand/Collapse Button */}
        {task.children && task.children.length > 0 && (
          <button onClick={() => setIsExpanded(!isExpanded)} style={toggleButtonStyle}>
            {isExpanded ? "▼" : "▶"}
          </button>
        )}

        {/* Task Name with Star Icon for Focused Items */}
        <span style={taskTextStyle}>
          {task.name}
          {task.isFocused && <FaStar style={starIconStyle} />}
        </span>

        {/* Note Icon */}
        <button onClick={() => setIsNoteModalOpen(true)} style={noteButtonStyle}>
          <FaStickyNote />
        </button>

        {/* Recurrence Icon */}
        <button onClick={() => setIsRecurrenceModalOpen(true)} style={recurrenceButtonStyle}>
          <FaSyncAlt />
        </button>

        {/* Add Child Task Button */}
        <button onClick={() => setIsAddingChild(!isAddingChild)} style={addButtonStyle}>
          <FaPlus />
        </button>

        {/* Edit Task Button */}
        <button onClick={() => onEditTask(task)} style={editButtonStyle}>
          <FaEdit />
        </button>
      </div>

      {/* Task Input for Adding a Child Task */}
      {isAddingChild && (
        <TaskInput refreshTasks={refreshTasks} parentId={task.id} onClose={() => setIsAddingChild(false)} />
      )}

      {/* Show Child Tasks */}
      {/* {isExpanded && task.children && (
        <div style={childTaskContainerStyle}>
          {task.children.map((child) => (
            <TaskItem key={child.id} task={child} refreshTasks={refreshTasks} onEditTask={onEditTask} />
          ))}
        </div>
      )} */}
      {isExpanded && task.children && (
  <div style={childTaskContainerStyle}>
    {task.children.map((child) => (
      <TaskItem 
        key={child.id} 
        task={child} 
        refreshTasks={refreshTasks} 
        onEditTask={onEditTask} 
        draggable
        onDragStart={(e) => handleDragStart(e, child.id)}
        onDragOver={(e) => handleDragOver(e, child.id)}
        onDrop={(e) => handleDrop(e, child.id)}
        onDragEnd={handleDragEnd}
      />
    ))}
  </div>
)}


      {/* Recurrence Modal */}
      {isRecurrenceModalOpen && (
        <RecurrenceModal
          isOpen={isRecurrenceModalOpen}
          onClose={() => setIsRecurrenceModalOpen(false)}
          task={task}
        />
      )}

      {/* Note Modal */}
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


// Styles
const taskContainerStyle: React.CSSProperties = {
  padding: "12px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
  marginBottom: "8px",
  transition: "0.3s ease-in-out",
};

const taskRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  borderRadius: "6px",
  backgroundColor: "#f8f9fa",
  cursor: "pointer",
};

const taskTextStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  flex: 1,
  marginLeft: "8px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const starIconStyle: React.CSSProperties = {
  color: "#FFA500", 
  marginLeft: "5px",
};

const toggleButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  marginRight: "8px",
};

const addButtonStyle: React.CSSProperties = {
  backgroundColor: "#28a745",
  color: "white",
  padding: "6px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  transition: "0.2s ease-in-out",
  marginRight: "5px",
};

const recurrenceButtonStyle: React.CSSProperties = {
  backgroundColor: "#17a2b8",
  color: "white",
  padding: "6px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  transition: "0.2s ease-in-out",
  marginRight: "5px",
};

const noteButtonStyle: React.CSSProperties = {
  backgroundColor: "#ffc107",
  color: "white",
  padding: "6px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  transition: "0.2s ease-in-out",
  marginRight: "5px",
};

const editButtonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "6px 12px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  transition: "0.2s ease-in-out",
};

const childTaskContainerStyle: React.CSSProperties = {
  paddingLeft: "20px",
  marginTop: "8px",
  borderLeft: "2px solid #ccc",
};

export default TaskItem;
