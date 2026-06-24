"use client";

import { useState } from "react";
import { Peaks } from "../icons";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed.");
    } catch {
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="admin-auth">
      <form className="admin-auth__card" onSubmit={submit}>
        <span className="admin-auth__mark"><Peaks size={34} /></span>
        <h1>The Heights Retreat</h1>
        <p className="muted">Admin access</p>
        <div className="field">
          <label htmlFor="pw">Password</label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
        {error && <div className="form__status form__status--err" role="alert">{error}</div>}
        <button type="submit" className="btn btn--primary" disabled={loading} style={{ justifyContent: "center" }}>
          {loading ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
