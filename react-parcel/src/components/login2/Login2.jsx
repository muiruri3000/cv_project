import { useState } from "react";
import { useAuth } from "../../security/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Login2 = () => {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  console.log("🔥 handleLogin STARTED");

  try {
    const response = await api.post("/token/", {
      username,
      password,
    });

    const data = response.data;

    console.log("CALLING /me");

    let me = null;

    try {
      me = await api.get("/me/", {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      console.log("ME SUCCESS:", me.data);
    } catch (err) {
      console.log("ME FAILED:", err.response?.data || err.message);
      throw err; // optional: or remove this line
    }

    login({
      user: me.data,
      access: data.access,
    });

    localStorage.setItem("refresh", data.refresh);

    navigate("/dashboard", {
      state: { message: "login successful" },
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    let msg = "login failed";

    if (error.response?.status === 401) {
      msg = "Invalid username or password";
    } else {
      msg = error.response?.data?.detail || error.message || msg;
    }

    setError(msg);
    setTimeout(() => setError(null), 1500);
  }
};

  return (
    <div className="mt-35">
      <h2>Login</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login2;