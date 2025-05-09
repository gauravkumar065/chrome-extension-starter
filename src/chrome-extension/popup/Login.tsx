import { useState } from "react";

export const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any previous error when user starts typing again
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send login credentials to background script
      chrome.runtime.sendMessage(
        {
          type: "LOGIN",
          data: { email: credentials.email },
        },
        (response) => {
          if (response && response.success) {
            console.log("Login successful!");
            // You could redirect or update UI here
          } else {
            setError("Login failed. Please try again.");
          }
          setLoading(false);
        },
      );
    } catch (error) {
      console.error("Login failed:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xs p-4">
      <form
        onSubmit={handleSubmit}
        className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
      >
        <h2 className="mb-4 text-center text-xl font-bold">Login</h2>

        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 p-2 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            id="password"
            type="password"
            name="password"
            placeholder="******************"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};
