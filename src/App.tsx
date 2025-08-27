import React from "react";
import Compose from "./context/Compose";

import "./App.css";
import Profile from "./components/Profile";
import { ProfileProvider } from "./context/ProfileContext";

export default function App() {
  return (
    <Compose components={[ProfileProvider]}>
      <div className="App">
        <Profile />
      </div>
    </Compose>
  );
}
