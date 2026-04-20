import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔐 Email Login
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Enter email & password ❌");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Success ✅");
      navigate("/menu");
    } catch (err) {
      toast.error("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔢 PIN Login
  const handlePinLogin = () => {
    const savedPin = localStorage.getItem("userPIN");

    if (!savedPin) {
      toast.error("No PIN found ❌");
      return;
    }

    if (pin === savedPin) {
      toast.success("PIN Login Success ✅");
      navigate("/menu");
    } else {
      toast.error("Wrong PIN ❌");
    }
  };

  // 🔁 Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Enter email first ❌");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link sent 📩");
    } catch (err) {
      toast.error("Error sending email ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md w-full max-w-md p-8">

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome Back 🚆
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Login to your account
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot Password */}
        <button
          onClick={handleForgotPassword}
          className="text-sm text-blue-600 mb-4"
        >
          Forgot Password?
        </button>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* PIN Login */}
        <input
          type="password"
          placeholder="Enter PIN"
          className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-green-500 outline-none"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <button
          onClick={handlePinLogin}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Login with PIN
        </button>

        {/* Signup */}
        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;