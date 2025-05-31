import { useNavigate, Link } from "react-router";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.get("https://6823a18e65ba0580339768c2.mockapi.io/Users");
      const user = res.data.find(
        (u) => u.username === username.trim() && u.password === password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        setErrors({ general: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl mb-4 text-center">Login</h2>

        <input
          className="w-full mb-1 p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <p className="text-red-600 text-sm mb-2">{errors.username}</p>}

        <input
          type="password"
          className="w-full mb-1 p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password}</p>}

        {errors.general && <p className="text-red-600 text-sm mb-2">{errors.general}</p>}

        <button onClick={handleLogin} className="w-full bg-green-600 text-white p-2 rounded mt-2">
          Login
        </button>

        <p className="text-sm mt-2 text-center">
          Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
}
