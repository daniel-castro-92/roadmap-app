"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(true);
      setPassword("");
      inputRef.current?.focus();
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0F2240" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#F05A1A" }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h1 className="text-white font-bold text-2xl tracking-tight">
            Roadmap
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Enter your password to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            required
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "white",
              border: error
                ? "1.5px solid #F05A1A"
                : "1.5px solid rgba(255,255,255,0.12)",
            }}
          />
          {error && (
            <p className="text-xs" style={{ color: "#F05A1A" }}>
              Incorrect password. Try again.
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#F05A1A" }}
          >
            {loading ? "Checking…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
