import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    // TODO: Call backend login API
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Login to E-Max
      </h2>

      <div className="mb-4">
        <label>Email</label>

        <input
          className="w-full border p-3 rounded-lg mt-1"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div className="mb-6">
        <label>Password</label>

        <input
          className="w-full border p-3 rounded-lg mt-1"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;