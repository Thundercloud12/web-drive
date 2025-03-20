import React from "react";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";
import FavouritePage from "./pages/FavouritePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favourite" element={<FavouritePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
