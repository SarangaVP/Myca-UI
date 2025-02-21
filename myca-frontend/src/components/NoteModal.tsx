import React, { useState, useEffect } from "react";
import { BASE_URL, AUTH_TOKEN } from "../config";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  refreshTasks: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, taskId, refreshTasks }) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (isOpen) {
        setLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/getItems`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
            body: JSON.stringify({
              date_input: new Date().toISOString().split("T")[0],
              items_list: []
            }),
          });

          const data = await response.json();
          if (data.status === 200 && data.reports.length > 0) {
            const items = data.reports[0];
            const matchedItem = items.find((item: any) => item.id === taskId);

            const existingNote = matchedItem?.context?.note;
            setNote(existingNote || "");
          }
        } catch (err) {
          console.error(err);
          setError("Failed to load note");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNote();
  }, [isOpen, taskId]);

  const handleSave = async () => {
    try {
      const response = await fetch(`${BASE_URL}/openNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          item_id: taskId,
          item_note: note,
        }),
      });

      const data = await response.json();
      if (data.status === 200) {
        refreshTasks();
        onClose();
      } else {
        setError("Failed to save note");
      }
    } catch (err) {
      console.error(err);
      setError("Error saving note");
    }
  };

  return isOpen ? (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Note</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <textarea 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            style={textAreaStyle} 
          />
        )}

        {error && <p style={errorTextStyle}>{error}</p>}

        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
          <button onClick={handleSave} style={saveButtonStyle}>Save</button>
        </div>
      </div>
    </div>
  ) : null;
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
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const textAreaStyle: React.CSSProperties = {
  width: "100%",
  height: "150px",
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  resize: "none",
  fontSize: "14px",
};

const buttonContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
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

const errorTextStyle: React.CSSProperties = {
  color: "red",
  fontSize: "14px",
  marginTop: "5px",
};

export default NoteModal;
