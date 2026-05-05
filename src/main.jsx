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
import ErrorBoundary from "./components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <SmoothScrollProvider>
            <AuthProvider>
              <Toaster position="top-right" />
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
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
