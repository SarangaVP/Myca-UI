import React, { useState } from "react";
import Plan from "./pages/Plan";
import Sidebar from "./components/Sidebar";

interface Task {
  id: string;
  name: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); 

  const addTask = (name: string) => {
    setTasks([...tasks, { id: String(tasks.length + 1), name }]);
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
      <Sidebar />
      <Plan tasks={tasks} addTask={addTask} setTasks={setTasks} /> 
    </div>
  );
};

export default App;

