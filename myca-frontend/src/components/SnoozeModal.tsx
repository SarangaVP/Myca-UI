import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config";

interface SnoozeModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  initialSnoozeStatus: boolean;
  refreshTasks: () => void;
}

const SnoozeModal: React.FC<SnoozeModalProps> = ({
  isOpen,
  onClose,
  itemId,
  initialSnoozeStatus,
  refreshTasks,
}) => {
  const [snoozeDate, setSnoozeDate] = useState<string | null>(null);
  const [isSnoozed, setIsSnoozed] = useState(initialSnoozeStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchSnoozeDetails = async () => {
      const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/getItems`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            date_input: new Date().toISOString().split("T")[0],
            items_list: [],
          }),
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (data.status === 200 && data.reports.length > 0) {
          const items = data.reports[0];
          const matchedItem = items.find((item: any) => item.id === itemId);

          if (matchedItem) {
            console.log("Matched Item:", matchedItem);
            setSnoozeDate(matchedItem.context.snoozed_till || null);
            setIsSnoozed(matchedItem.context.is_snoozed || false);
          }
        } else {
          setError("Failed to load snooze details");
        }
      } catch (err) {
        console.error("Error fetching snooze details:", err);
        setError("Error fetching snooze details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnoozeDetails();
  }, [isOpen, itemId]);

  const handleSnooze = async () => {
    const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/snoozeItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          item_id: itemId,
          is_snoozed: isSnoozed,
          snooze_till: snoozeDate,
        }),
      });

      const data = await response.json();
      if (data.status === 200) {
        refreshTasks();
        onClose();
      } else {
        console.error("Failed to snooze item");
        setError("Failed to save snooze settings");
      }
    } catch (error) {
      console.error("Error snoozing item:", error);
      setError("Error saving snooze settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Snooze Task</h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>Select a snooze date:</p>
            <input
              type="date"
              value={snoozeDate || ""}
              onChange={(e) => setSnoozeDate(e.target.value)}
              style={dateInputStyle}
            />

            <div style={tickContainerStyle}>
              <input
                type="checkbox"
                checked={isSnoozed}
                onChange={() => setIsSnoozed(!isSnoozed)}
              />
              <label style={tickLabelStyle}>Enable Snooze</label>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={buttonContainerStyle}>
              <button onClick={handleSnooze} style={saveButtonStyle} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button onClick={onClose} style={cancelButtonStyle}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Styles
const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  backdropFilter: "blur(4px)",
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px 30px",
  borderRadius: "10px",
  width: "320px",
  textAlign: "center",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
  fontFamily: "'Arial', sans-serif",
};

const dateInputStyle: React.CSSProperties = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "100%",
  fontSize: "14px",
  boxSizing: "border-box",
  marginBottom: "15px",
};

const tickContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "10px",
};

const tickLabelStyle: React.CSSProperties = {
  marginLeft: "8px",
  fontWeight: "500",
  color: "#333",
  fontSize: "14px",
  userSelect: "none",
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

export default SnoozeModal;
