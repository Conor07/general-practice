import React from "react";
import Compose from "./context/Compose";

import "./App.css";
import Profile from "./components/Profile";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <Compose components={[AppProvider]}>
      <div className="App">
        <Profile />
      </div>
    </Compose>
  );
}
