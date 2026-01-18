import { useState } from "react";
import axios from "axios";
import "./auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "http://otis-api.vercel.app/api/auth/login",
      { email, password }
    );

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);

    alert(
      res.data.role === "admin"
        ? "Welcome Admin"
        : "Welcome User"
    );
  };

  return (
    <div className="box">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <input placeholder="Email"
          onChange={e => setEmail(e.target.value)} />

        <input type="password" placeholder="Password"
          onChange={e => setPassword(e.target.value)} />

        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
