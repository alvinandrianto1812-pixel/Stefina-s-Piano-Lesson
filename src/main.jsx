// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import ClickSpark from "./components/ClickSpark.jsx";
import SmoothScrollProvider from "./contexts/SmoothScrollProvider.jsx";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SmoothScrollProvider>
        <AuthProvider>
          <ClickSpark
            sparkColor="#fabe23"
            sparkSize={13}
            sparkRadius={20}
            sparkCount={8}
            duration={700}
          >
            <App />
          </ClickSpark>
        </AuthProvider>
      </SmoothScrollProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
