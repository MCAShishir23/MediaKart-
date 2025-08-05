// src/App.js
import React, { useState } from "react";
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./components/Dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <div className="App">
      {!authenticated ? (
        <AdminLogin setAuthenticated={setAuthenticated} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
