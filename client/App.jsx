import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", goals: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim() || !form.goals.trim()) {
      setError("All fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Enter a valid email address.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/users", form);
      setSuccess(true);
      setForm({ name: "", email: "", goals: "" });
      fetchUsers();
    } catch (err) {
      setError("Failed to save user");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 relative">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Life Clarity & Goal Setting</h2>

          {error && <p className="mb-4 text-red-600 text-sm font-medium">{error}</p>}

          <input
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
            name="goals"
            placeholder="Describe your personal goals..."
            value={form.goals}
            onChange={handleChange}
            rows={5}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Save My Goals
          </button>

          {success && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center text-center p-4 rounded-2xl animate-fadeIn">
              <p className="text-green-600 text-xl font-semibold mb-2">Success!</p>
              <p className="text-gray-700">Your goals have been saved.</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Close
              </button>
            </div>
          )}
        </form>

        <div className="bg-white shadow-xl rounded-2xl p-8 overflow-auto">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Saved Goals</h3>
          {users.length === 0 ? (
            <p className="text-gray-500">No goals saved yet.</p>
          ) : (
            <ul className="space-y-4">
              {users.map((user, index) => (
                <li key={index} className="border p-4 rounded-lg">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="mt-2 text-gray-700 whitespace-pre-line">{user.goals}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
