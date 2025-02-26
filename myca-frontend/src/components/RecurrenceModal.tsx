import React, { useState, useEffect } from "react";
import { Task } from "./TaskItem";
// import { BASE_URL, AUTH_TOKEN } from "../config";

import { BASE_URL} from "../config";

interface RecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

// interface RecurrenceRequestBody {
//   date: string;
//   item_id: string;
//   start: string;
//   frequency: string;
//   ritual_flag: boolean;
//   by_day_of_week: boolean[];
//   by_day_of_month: number;
//   interval: number;
//   end: string | null; // Allow end to be either string or null
//   occurrence?: number; // Optional occurrence
// }

const RecurrenceModal: React.FC<RecurrenceModalProps> = ({ isOpen, onClose, task }) => {
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [repeatUnit, setRepeatUnit] = useState("DAYS");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [occurrences, setOccurrences] = useState(0);
  const [isRitual, setIsRitual] = useState(false);

  // Change: Use Boolean Array for Days of Week
  const [byDayOfWeek, setByDayOfWeek] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [byDayOfMonth, setByDayOfMonth] = useState(1);

  const [endType, setEndType] = useState("NEVER"); // ON, AFTER, NEVER

  // Change: Load Existing Data as Boolean Array
  useEffect(() => {
    const fetchRecurrence = async () => {
      const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN");
      if (isOpen) {
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
          if (data.status === 200 && data.reports.length > 0) {
            const matchedItem = data.reports[0].find((item: any) => item.id === task.id);
            const ritual = matchedItem?.context?.ritual;
            if (ritual) {
              setRepeatUnit(ritual.frequency || "DAYS");
              setRepeatEvery(ritual.interval || 1);
              setStartDate(ritual.start || new Date().toISOString().split("T")[0]);
              setEndDate(ritual.end || "");
              setByDayOfMonth(ritual.by_day_of_month || 1);
              setIsRitual(ritual.ritual_flag || false);

              // Change: Convert string array to boolean array for byDayOfWeek
              //const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
              const selectedDays = ritual.by_day_of_week || [false, false, false, false, false, false, false];
              //console.log("Selected Days:", selectedDays); 
              //const booleanArray = daysOfWeek.map((day) => selectedDays.includes(day));
              //console.log("Preloaded byDayOfWeek:", booleanArray);
              setByDayOfWeek(selectedDays);
              if (ritual.end) {
                setEndType("ON");
                setEndDate(ritual.end);
              } else if (ritual.occurrence) {
                setEndType("AFTER");
                setOccurrences(ritual.occurrence);
              } else {
                setEndType("NEVER");
              }
            }
          }
        } catch (error) {
          console.error("Failed to load recurrence:", error);
        }
      }
    };
    fetchRecurrence();
  }, [isOpen, task.id]);

  const handleSave = async () => {
    // const requestBody = {
    //   date: new Date().toISOString().split("T")[0],
    //   item_id: task.id,
    //   start: startDate,
    //   end: endDate,
    //   frequency: repeatUnit,
    //   ritual_flag: isRitual,
    //   by_day_of_week: byDayOfWeek,
    //   by_day_of_month: byDayOfMonth,
    //   occurence: occurrences,
    //   interval: repeatEvery,
    // };
      // Initialize request body with common fields
      const requestBody = {
        date: new Date().toISOString().split("T")[0],
        item_id: task.id,
        start: startDate,
        frequency: repeatUnit,
        ritual_flag: isRitual,
        by_day_of_week: byDayOfWeek,
        by_day_of_month: byDayOfMonth,
        interval: repeatEvery,
        end: endDate, 
        occurrence: occurrences,
      };
      
      console.log("end type is: ", endType);
      // Conditionally set end or occurrence based on endType
      if (endType === "ON") {
        requestBody.end = endDate;
        requestBody.occurrence = 0;
      } else if (endType === "AFTER") {
        requestBody.occurrence = occurrences;
        requestBody.end = "";
      } else if (endType === "NEVER") {
        requestBody.occurrence = 0;
        requestBody.end = "";
      }
      console.log("Request Body:", requestBody);

    const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN"); //check

    try {
      
      const response = await fetch(`${BASE_URL}/setUpRecurrence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.status === 200) {
        onClose();
      } else {
        console.error("Failed to save recurrence");
      }
    } catch (error) {
      console.error("Error saving recurrence:", error);
    }
  };

  const toggleDayOfWeek = (index: number) => {
    setByDayOfWeek((prevDays) =>
      prevDays.map((selected, i) => (i === index ? !selected : selected))
    );
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={modalTitleStyle}>Recurrence</h2>

        <label>Repeat every:</label>
        <div style={inlineStyle}>
          <input
            type="number"
            value={repeatEvery}
            onChange={(e) => setRepeatEvery(Number(e.target.value))}
            min={1}
            style={inputStyle}
          />
          <select
            value={repeatUnit}
            onChange={(e) => setRepeatUnit(e.target.value)}
            style={inputStyle}
          >
            <option value="DAYS">Days</option>
            <option value="WEEKS">Weeks</option>
            <option value="MONTHS">Months</option>
          </select>
        </div>

        {repeatUnit === "WEEKS" && (
          <div>
            <label>On:</label>
            <div style={inlineStyle}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                //console.log(`${day} button state:`, byDayOfWeek[index]),
                <button
                  key={day}
                  onClick={() => toggleDayOfWeek(index)}
                  style={{
                    ...dayButtonStyle,
                    backgroundColor: byDayOfWeek[index] ? "#007bff" : "#f8f9fa",
                    color: byDayOfWeek[index] ? "white" : "black",
                    border: byDayOfWeek[index] ? "2px solid #0056b3" : "1px solid #ccc",
                    transition: "all 0.2s ease-in-out"
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        {repeatUnit === "MONTHS" && (
          <div>
            <label>On the:</label>
            <select
              value={byDayOfMonth}
              onChange={(e) => setByDayOfMonth(Number(e.target.value))}
              style={inputStyle}
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        )}

        <label>Starting on:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={inputStyle}
        />

        {/* <label>Ends:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={inputStyle}
        /> */}

<label>Ends:</label>
        <div>
          <label>
            <input
              type="radio"
              name="endType"
              value="NEVER"
              checked={endType === "NEVER"}
              onChange={() => setEndType("NEVER")}
            />
            Never
          </label>
          <br />

          <label>
            <input
              type="radio"
              name="endType"
              value="ON"
              checked={endType === "ON"}
              onChange={() => setEndType("ON")}
            />
            On
          </label>
          {endType === "ON" && (
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={inputStyle}
            />
          )}
          <br />

          <label>
            <input
              type="radio"
              name="endType"
              value="AFTER"
              checked={endType === "AFTER"}
              onChange={() => setEndType("AFTER")}
            />
            After
          </label>
          {endType === "AFTER" && (
            <input
              type="number"
              value={occurrences}
              onChange={(e) => setOccurrences(Number(e.target.value))}
              min={1}
              style={inputStyle}
            />
          )}
          {endType === "AFTER" && <span> occurrences</span>}
        </div>

        <label>Ritual:</label>
        <input
          type="checkbox"
          checked={isRitual}
          onChange={(e) => setIsRitual(e.target.checked)}
          style={{ marginLeft: "10px" }}
        />

        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
          <button onClick={handleSave} style={saveButtonStyle}>Save</button>
        </div>
      </div>
    </div>
  );
};



// Styles
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

// Modal Styles
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

const modalTitleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "15px",
  textAlign: "center",
  color: "#333",
};

// Input Styles
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
  borderRadius: "4px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};


export default RecurrenceModal;
