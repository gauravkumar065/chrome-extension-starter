import { useEffect, useState } from "react";

type User = {
  email: string;
};

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user info from chrome storage
    chrome.storage.local.get(["user"], (result) => {
      if (result.user) {
        setUser(result.user);
      }
    });
  }, []);

  const handleLogout = () => {
    chrome.runtime.sendMessage({ type: "LOGOUT" }, (response) => {
      if (response && response.success) {
        console.log("Logged out successfully");
        // The parent component will handle the UI update
      }
    });
  };

  return (
    <div className="w-full p-4">
      <div className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
        <h2 className="mb-4 text-center text-xl font-bold">Welcome!</h2>

        {user && (
          <div className="mb-4 text-center">
            <p>You are logged in as:</p>
            <p className="font-bold">{user.email}</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center">
          <button
            className="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
