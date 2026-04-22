import { useState } from "react";
import { login } from "../services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await login(email, password);

      console.log("LOGIN SUCCESS:", data);

      localStorage.setItem("token", data.accessToken);

      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="header">
          <div className="logo">A</div>
          <div>
            <h3>Annual Development Programme</h3>
            <p>Management Portal</p>
          </div>
        </div>

        <h1>Welcome back</h1>
        <p>Select your role to access the portal</p>

        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} className="login-btn">
          {loading ? "Signing in..." : "Sign In →"}
        </button>
      </div>
    </div>
  );
}