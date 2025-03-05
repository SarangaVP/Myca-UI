import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config"; 

const Journal: React.FC = () => {
  const [journalEntry, setJournalEntry] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  useEffect(() => {
    fetchJournalNote();
  }, []);

  const fetchJournalNote = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/journalNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
        },
        credentials: "include",
        body: JSON.stringify({ date: formattedDate, note:"" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 200 && data.reports.length > 0) {
        setJournalEntry(data.reports[0].context.note || "");
      } else {
        setJournalEntry("");
      }
    } catch (error) {
      console.error("Error fetching journal note:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveJournalNote = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${BASE_URL}/journalNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
        },
        credentials: "include",
        body: JSON.stringify({ date: formattedDate, note: journalEntry }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Journal note saved successfully!");
    } catch (error) {
      console.error("Error saving journal note:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Journal</h2>
      <p style={dateStyle}>{today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}</p>

      <p style={instructionStyle}>Add any thoughts or reflections for the day here</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            style={textAreaStyle}
          />
          <button onClick={saveJournalNote} style={buttonStyle} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </>
      )}
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

const buttonStyle: React.CSSProperties = {
  marginTop: "10px",
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Journal;

