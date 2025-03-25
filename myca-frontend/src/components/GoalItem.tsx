// GoalItem.tsx
import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaPlus, FaStar, FaSyncAlt, FaStickyNote, FaBellSlash, FaTrash, FaEllipsisV, FaPlay, FaCheck, FaTimes, FaFolderOpen } from "react-icons/fa";
import ReactDOM from "react-dom";
import TaskInput from "./TaskInput";
import RecurrenceModal from "./RecurrenceModal";
import NoteModal from "./NoteModal";
import SnoozeModal from "./SnoozeModal";
import { BASE_URL } from "../config";
import "./TaskItem.css"; // Reuse the same CSS for consistency

export interface Task {
  context: {
    status?: string;
    itype?: string;
    name?: string;
    parent_item_id?: string;
    note?: string;
    is_focused?: boolean;
    is_snoozed?: boolean;
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
    last_updated?: string;
    snoozed_till?: string;
    [key: string]: any;
  };
  id: string;
  name: string;
  isFocused: boolean;
  note?: string;
  isSnoozed: boolean;
  children?: Task[];
  parentId?: string;
}

interface GoalItemProps {
  task: Task;
  refreshTasks: () => void;
  onEditTask: (task: Task) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
  index?: number;
  parentId?: string;
  onAddSubGoal?: (parentId: string) => void;
  onShowPlanItems?: () => void;
  onToggleCollapse?: () => void; // Added for collapse integration
  isCollapsed?: boolean; // Added for collapse integration
}

const StatusDropdownPortal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  statusButtonRef: React.RefObject<HTMLButtonElement | null>;
  children: React.ReactNode;
}> = ({ isOpen, onClose, statusButtonRef, children }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [initialClick, setInitialClick] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!initialClick) {
        setInitialClick(true);
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        statusButtonRef.current &&
        !statusButtonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen && statusButtonRef.current) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, statusButtonRef, initialClick]);

  useEffect(() => {
    if (!isOpen) {
      setInitialClick(false);
    }
  }, [isOpen]);

  if (!isOpen || !statusButtonRef.current) return null;

  const buttonRect = statusButtonRef.current.getBoundingClientRect();
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const dropdownHeight = 120;

  const isCutOff = buttonRect.bottom + dropdownHeight + scrollY > viewportHeight + scrollY;
  const topPosition = isCutOff
    ? `${buttonRect.top + scrollY - dropdownHeight - 5}px`
    : `${buttonRect.bottom + scrollY + 5}px`;

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      className="status-dropdown"
      style={{
        position: "absolute",
        top: topPosition,
        left: `${buttonRect.left}px`,
        zIndex: 20000,
        minWidth: "120px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        animation: "fadeIn 0.2s ease-in",
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const MenuDropdownPortal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
  children: React.ReactNode;
}> = ({ isOpen, onClose, menuButtonRef, children }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [initialClick, setInitialClick] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!initialClick) {
        setInitialClick(true);
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen && menuButtonRef.current) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, menuButtonRef, initialClick]);

  useEffect(() => {
    if (!isOpen) {
      setInitialClick(false);
    }
  }, [isOpen]);

  if (!isOpen || !menuButtonRef.current) return null;

  const buttonRect = menuButtonRef.current.getBoundingClientRect();
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const dropdownHeight = 160;

  const isCutOff = buttonRect.bottom + dropdownHeight + scrollY > viewportHeight + scrollY;
  const topPosition = isCutOff
    ? `${buttonRect.top + scrollY - dropdownHeight - 5}px`
    : `${buttonRect.bottom + scrollY + 5}px`;

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      className="menu-dropdown"
      style={{
        position: "absolute",
        top: topPosition,
        left: `${buttonRect.right - 150}px`,
        zIndex: 20000,
        minWidth: "150px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        animation: "fadeIn 0.2s ease-in",
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const GoalItem: React.FC<GoalItemProps> = ({
  task,
  refreshTasks,
  onEditTask,
  draggable = true,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  index = 0,
  parentId,
  onAddSubGoal,
  onShowPlanItems,
  onToggleCollapse, // Added prop
  isCollapsed, // Added prop
}) => {
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(task.isSnoozed || false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const taskContainerRef = useRef<HTMLDivElement>(null);

  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const baseZIndex = 1000 - index * 10;

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "running":
        return "#007bff";
      case "done":
        return "#28a745";
      case "canceled":
        return "#dc3545";
      case "open":
      default:
        return "#fff";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "running":
        return <FaPlay size={10} style={{ marginRight: "2px" }} />;
      case "done":
        return <FaCheck size={10} style={{ marginRight: "2px" }} />;
      case "canceled":
        return <FaTimes size={10} style={{ marginRight: "2px" }} />;
      case "open":
      default:
        return <FaFolderOpen size={10} style={{ marginRight: "2px" }} />;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
    const today = new Date().toISOString().split("T")[0];

    const updateData = {
      date: today,
      item_id: task.id,
      new_name: task.name,
      new_type: task.context?.itype || "goal", // Changed to "goal" for GoalItem
      new_status: newStatus,
      isFocused: task.isFocused,
    };

    try {
      const response = await fetch(`${BASE_URL}/updateItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        refreshTasks();
        setIsStatusDropdownOpen(false);
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".status-button, .toggle-button, .add-button, .menu-button, .plan-button")) {
      return;
    }

    setIsDraggable(true);
    longPressTimer.current = setTimeout(() => {
      setIsDragging(true);
      if (taskContainerRef.current) {
        taskContainerRef.current.classList.add("dragging");
      }
    }, 500);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!isDragging) {
      setIsDraggable(false);
    }
  };

  const handleMouseLeave = () => {
    if (longPressTimer.current && !isDragging) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    e.stopPropagation();
    if (!isDraggable) {
      return;
    }
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    if (taskContainerRef.current) {
      taskContainerRef.current.classList.add("dragging");
    }
    onDragStart?.(e);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (taskContainerRef.current && !taskContainerRef.current.classList.contains("dragging")) {
      setDragOverItem(itemId);
      taskContainerRef.current.classList.add("drag-over");
    }
    onDragOver?.(e);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDragOverItem(null);
    setIsDragging(false);
    setIsDraggable(false);
    if (taskContainerRef.current) {
      taskContainerRef.current.classList.remove("dragging");
      taskContainerRef.current.classList.remove("drag-over");
    }
    onDragEnd?.();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, dropTargetId: string) => {
    const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
    e.preventDefault();
    e.stopPropagation();
    const itemId = e.dataTransfer.getData("text/plain");
    const newParentId = dropTargetId;

    if (!itemId || !newParentId || itemId === newParentId) {
      setDragOverItem(null);
      setIsDragging(false);
      setIsDraggable(false);
      if (taskContainerRef.current) {
        taskContainerRef.current.classList.remove("drag-over");
      }
      onDrop?.(e);
      return;
    }

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
        console.error("Failed to move item, response:", data);
      }
    } catch (error) {
      console.error("Error moving item:", error);
    }

    setDragOverItem(null);
    setIsDragging(false);
    setIsDraggable(false);
    if (taskContainerRef.current) {
      taskContainerRef.current.classList.remove("dragging");
      taskContainerRef.current.classList.remove("drag-over");
    }
    onDrop?.(e);
  };

  const handleDeleteTask = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      console.error("No auth token found!");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/deleteItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          item_id: task.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      refreshTasks();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleAddChildClick = () => {
    if (onAddSubGoal) {
      onAddSubGoal(task.id);
      setIsAddingChild(false);
    } else {
      setIsAddingChild(!isAddingChild);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isSnoozeModalOpen &&
        !isRecurrenceModalOpen &&
        !isNoteModalOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSnoozeModalOpen, isRecurrenceModalOpen, isNoteModalOpen]);

  return (
    <div
      ref={taskContainerRef}
      draggable={isDraggable || draggable}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDragStart={(e) => handleDragStart(e, task.id)}
      onDragOver={(e) => handleDragOver(e, task.id)}
      onDrop={(e) => handleDrop(e, task.id)}
      onDragEnd={handleDragEnd}
      className={`task-container ${isDragging ? "dragging" : ""} ${dragOverItem === task.id ? "drag-over" : ""}`}
      style={{ zIndex: isDragging ? 10002 : baseZIndex, cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div className="task-row">
        {task.children && task.children.length > 0 && (
          <button onClick={onToggleCollapse} className="toggle-button">
            {isCollapsed ? "▶" : "▼"}
          </button>
        )}
        <span className="task-text">
          {task.name}
          {task.isFocused && <FaStar className="star-icon" />}
        </span>
        <div className="button-group">
          <div ref={statusRef} style={{ position: "relative", display: "inline-block" }}>
            <button
              ref={statusButtonRef}
              onClick={() => setIsStatusDropdownOpen((prev) => !prev)}
              className="status-button"
              style={{
                backgroundColor: getStatusColor(task.context?.status),
                color: task.context?.status === "open" ? "#555" : "#fff",
                zIndex: baseZIndex + 5,
              }}
            >
              {getStatusIcon(task.context?.status)}
              {task.context?.status
                ? task.context.status.charAt(0).toUpperCase() + task.context.status.slice(1)
                : "Open"}
            </button>
            <StatusDropdownPortal
              isOpen={isStatusDropdownOpen}
              onClose={() => setIsStatusDropdownOpen(false)}
              statusButtonRef={statusButtonRef}
            >
              <button onClick={() => handleStatusChange("open")} className="status-item">
                <FaFolderOpen size={10} style={{ marginRight: "2px" }} /> Open
              </button>
              <button onClick={() => handleStatusChange("running")} className="status-item">
                <FaPlay size={10} style={{ marginRight: "2px" }} /> Running
              </button>
              <button onClick={() => handleStatusChange("done")} className="status-item">
                <FaCheck size={10} style={{ marginRight: "2px" }} /> Completed
              </button>
              <button onClick={() => handleStatusChange("canceled")} className="status-item">
                <FaTimes size={10} style={{ marginRight: "2px" }} /> Canceled
              </button>
            </StatusDropdownPortal>
          </div>
          <button onClick={handleAddChildClick} className="add-button">
            <FaPlus />
          </button>
          {onShowPlanItems && (
            <button onClick={onShowPlanItems} className="plan-button" style={{ marginLeft: "5px", backgroundColor: "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}>
              Associate Items
            </button>
          )}
          <div style={{ position: "relative", display: "inline-block" }}>
            <button ref={menuButtonRef} onClick={toggleMenu} className="menu-button">
              <FaEllipsisV />
            </button>
            <MenuDropdownPortal
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              menuButtonRef={menuButtonRef}
            >
              <button
                onClick={() => {
                  setIsSnoozeModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="task-item-menu-item"
              >
                <FaBellSlash /> Snooze
              </button>
              <button
                onClick={() => {
                  setIsNoteModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="task-item-menu-item"
              >
                <FaStickyNote /> Note
              </button>
              <button
                onClick={() => {
                  setIsRecurrenceModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="task-item-menu-item"
              >
                <FaSyncAlt /> Recurrence
              </button>
              <button
                onClick={() => {
                  onEditTask(task);
                  setIsMenuOpen(false);
                }}
                className="task-item-menu-item"
              >
                <FaEdit /> Edit
              </button>
              <button onClick={handleDeleteTask} className="task-item-menu-item">
                <FaTrash /> Delete
              </button>
            </MenuDropdownPortal>
          </div>
        </div>
      </div>
      {isAddingChild && !onAddSubGoal && (
        <TaskInput refreshTasks={refreshTasks} parentId={task.id} onClose={() => setIsAddingChild(false)} />
      )}
      {isSnoozeModalOpen && (
        <SnoozeModal
          isOpen={isSnoozeModalOpen}
          onClose={() => setIsSnoozeModalOpen(false)}
          itemId={task.id}
          initialSnoozeStatus={isSnoozed}
          refreshTasks={() => {
            refreshTasks();
            setIsSnoozed(true);
          }}
        />
      )}
      {isRecurrenceModalOpen && (
        <RecurrenceModal
          isOpen={isRecurrenceModalOpen}
          onClose={() => setIsRecurrenceModalOpen(false)}
          task={task}
          refreshTasks={refreshTasks}
        />
      )}
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

export default GoalItem;