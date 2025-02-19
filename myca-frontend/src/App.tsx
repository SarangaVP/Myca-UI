import React from "react";
import Plan from "./pages/Plan";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
      <Sidebar />
      <Plan /> 
    </div>
  );
};

export default App;


