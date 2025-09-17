import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = await login(email, password);
    console.log("Login response:", data); // check what backend sends
  
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role)
      if(data.role === "manager"){
        navigate("/manager");
      } else {
        navigate("/employee");
      }
  
      // // ✅ Right now we don't have role, so just navigate to a default page
      // navigate("/dashboard");
    } else {
      alert(data.msg || "Login failed");
    }
  };
  

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600">
      {/* Outer Card Box */}
      <div className="bg-gradient-to-b from-blue-700 to-blue-500 rounded-3xl shadow-xl w-full max-w-[1200px] max-h-[1700px] p-8 flex overflow-hidden">
        {/* Left Info Section */}
        <div className="w-7/12 p-10 text-white flex flex-col justify-center">
            <img
            src="./assets/img/bsb-logo-light.svg"
            alt="Logo"
            className="mb-4 w-48"
            />
            <h2 className="text-3xl font-bold mb-2">
            We make digital products that drive you to stand out
            </h2>
            <p className="text-lg">
            We write words, take photos, make videos, and interact with AI.
            </p>
        </div>

        {/* Inner Login Card */}
        <div className="w-5/12 bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-2 text-center">Sign in</h3>
          <p className="mb-6 text-gray-600 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="checkbox"
              />
              <label htmlFor="remember" className="text-gray-600">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Log in now
            </button>
          </form>

          <p className="mb-6 text-gray-600 text-center">
            Don't have an account?{" "}
            <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
            >
                Sign up
            </span>
            </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
