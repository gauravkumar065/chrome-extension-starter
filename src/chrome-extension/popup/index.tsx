import "../global.css";
import { useState, useEffect } from "react";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";

export const Popup = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication state on component mount
    chrome.runtime.sendMessage({ type: "CHECK_AUTH" }, (response) => {
      setIsLoggedIn(response?.isLoggedIn || false);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const handleAuthChange = () => {
      chrome.storage.local.get(["isLoggedIn"], (result) => {
        setIsLoggedIn(result.isLoggedIn || false);
      });
    };

    // Add listener for storage changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "local" && changes.isLoggedIn) {
        handleAuthChange();
      }
    });

    return () => {
      chrome.storage.onChanged.removeListener(() => {});
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] min-w-[350px] items-center justify-center p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[300px] min-w-[350px]">
      {isLoggedIn ? <Dashboard /> : <Login />}
    </div>
  );
};
