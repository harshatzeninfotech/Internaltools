import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await axios.post("https://zen-infotech.org/api/login/", { email, password });

    const access = response.data.access;
    const refresh = response.data.refresh;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    // 🔁 Now fetch the profile to verify runner role
    const profileRes = await axios.get("https://zen-infotech.org/user/profile/getprofilepicture/", {
      headers: { Authorization: `Bearer ${access}` },
    });

    const userData = profileRes.data;
    console.log("User Data:", userData.role);
    
    if (!userData.role || userData.role !== "runner") {
      alert("❌ You are not a runner. Please request runner access.");
      return;
    }

    // ✅ Proceed to dashboard if runner
    navigate("/runner-dashboard");
  } catch (err) {
    console.log(err);
    
    setError(err.response?.data?.error || "Login failed");
  }
};


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center sm:hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm block mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white p-3 rounded-lg font-semibold"
          >
            Log In
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
