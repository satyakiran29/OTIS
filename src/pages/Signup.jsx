import { useState } from "react";
import axios from "axios";
import "./auth.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const submit = async (e) => {
    e.preventDefault();
    await axios.post("http://otis-api.vercel.app/api/auth/signup", form);
    alert("Signup successful");
  };

  return (
    <div className="box">
      <h3>Signup</h3>
      <form onSubmit={submit}>
        <input placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />

        <input type="password" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />

        <select
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button>Signup</button>
      </form>
    </div>
  );
}

export default Signup;
