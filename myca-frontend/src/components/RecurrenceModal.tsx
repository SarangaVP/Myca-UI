import React, { useState } from "react";
import { Task } from "./TaskItem";

interface RecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const RecurrenceModal: React.FC<RecurrenceModalProps> = ({ isOpen, onClose }) => {
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [repeatUnit, setRepeatUnit] = useState("Days");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endOption, setEndOption] = useState("never");
  const [endDate, setEndDate] = useState("");
  const [occurrences, setOccurrences] = useState(1);
  const [isRitual, setIsRitual] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => { // for checking
    console.log({
      repeatEvery,
      repeatUnit,
      startDate,
      endOption,
      endDate,
      occurrences,
      isRitual,
    });
    onClose();
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Recurrence</h2>
        <label>Repeat every:</label>
        <div style={inlineStyle}>
          <input
            type="number"
            value={repeatEvery}
            onChange={(e) => setRepeatEvery(Number(e.target.value))}
            min={1}
            style={inputStyle}
          />
          <select value={repeatUnit} onChange={(e) => setRepeatUnit(e.target.value)} style={inputStyle}>
            <option value="Days">Days</option>
            <option value="Weeks">Weeks</option>
            <option value="Months">Months</option>
          </select>
        </div>

        {repeatUnit === "Weeks" && (
          <div>
            <label>On:</label>
            <div style={inlineStyle}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <button key={day} style={dayButtonStyle}>
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        {repeatUnit === "Months" && (
          <div>
            <label>On the:</label>
            <select style={inputStyle}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            of the month
          </div>
        )}

        <label>Starting on:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={inputStyle}
        />

        <label>Ends:</label>
        <div>
          <input
            type="radio"
            checked={endOption === "never"}
            onChange={() => setEndOption("never")}
          /> Never
          <input
            type="radio"
            checked={endOption === "on"}
            onChange={() => setEndOption("on")}
            style={{ marginLeft: "10px" }}
          /> On
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={endOption !== "on"}
            style={{ marginLeft: "10px" }}
          />
          <input
            type="radio"
            checked={endOption === "after"}
            onChange={() => setEndOption("after")}
            style={{ marginLeft: "10px" }}
          /> After
          <input
            type="number"
            value={occurrences}
            onChange={(e) => setOccurrences(Number(e.target.value))}
            disabled={endOption !== "after"}
            min={1}
            style={{ marginLeft: "10px" }}
          /> occurrences
        </div>

        <label>
          <input
            type="checkbox"
            checked={isRitual}
            onChange={(e) => setIsRitual(e.target.checked)}
          /> Ritual
        </label>

        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
          <button onClick={handleSave} style={saveButtonStyle}>Save</button>
        </div>
      </div>
    </div>
  );
};

// Styles
const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};

const inputStyle: React.CSSProperties = {
  padding: "8px",
  margin: "5px 0",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const inlineStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const dayButtonStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  backgroundColor: "#f8f9fa",
  cursor: "pointer",
};

const buttonContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px",
};

const saveButtonStyle: React.CSSProperties = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: "#6c757d",
  color: "white",
  padding: "10px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};

export default RecurrenceModal;
