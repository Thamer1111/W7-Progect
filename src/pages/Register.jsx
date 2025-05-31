import { useNavigate, Link } from "react-router";
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.get("https://6823a18e65ba0580339768c2.mockapi.io/Users");
      const existingUser = res.data.find((u) => u.username === username.trim());

      if (existingUser) {
        setErrors({ username: "Username already exists" });
        return;
      }

      const newUser = {
        username: username.trim(),
        password: password,
      };

      const created = await axios.post("https://6823a18e65ba0580339768c2.mockapi.io/Users", newUser);
      localStorage.setItem("user", JSON.stringify(created.data));
      navigate("/");
    } catch (error) {
      console.error("Registration error", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl mb-4 text-center">Register</h2>

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

        <input
          type="password"
          className="w-full mb-1 p-2 border rounded"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <p className="text-red-600 text-sm mb-2">{errors.confirmPassword}</p>}

        <button onClick={handleRegister} className="w-full bg-blue-600 text-white p-2 rounded mt-2">
          Register
        </button>

        <p className="text-sm mt-2 text-center">
          Already have an account? <Link to="/login" className="text-green-600">Login</Link>
        </p>
      </div>
    </div>
  );
}
