import React, { useState } from "react";

const Journal: React.FC = () => {
  const [journalEntry, setJournalEntry] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJournalEntry(e.target.value);
  };

  const today = new Date();
  const displayDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Journal</h2>
      <p style={dateStyle}>{displayDate}</p>
 
      <p style={instructionStyle}>Add any thoughts or reflections for the day here</p>

      <textarea
        value={journalEntry}
        onChange={handleChange}
        style={textAreaStyle}
      />
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  flex: 1,
  padding: "20px",
  backgroundColor: "#f4f4f4",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "5px",
};

const dateStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "#666",
  marginBottom: "15px",
};

const instructionStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#333",
  marginTop: "20px",
  marginBottom: "10px",
};

const textAreaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "250px",
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  resize: "vertical",
  fontSize: "16px",
};

export default Journal;

