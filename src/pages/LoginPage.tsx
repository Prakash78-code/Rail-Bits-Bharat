import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../firebase";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔐 Email Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Enter email & password ❌");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      const savedPin = localStorage.getItem("userPIN");

      toast.success("Login Success ✅");
      navigate(savedPin ? "/menu" : "/set-pin");

    } catch (err) {
      toast.error(err.message || "Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);

      const savedPin = localStorage.getItem("userPIN");

      toast.success("Google Login Success 🚀");
      navigate(savedPin ? "/menu" : "/set-pin");

    } catch (err) {
      toast.error(err.message || "Google login failed ❌");
    }
  };

  // 🔢 PIN Login
  const handlePinLogin = (e) => {
    e.preventDefault();

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
      toast.error(err.message || "Error sending email ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md w-full max-w-md p-8">

        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome Back 🚆
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Login to your account
        </p>

        {/* EMAIL FORM */}
        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="w-full px-4 py-2 border rounded-lg mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="w-full px-4 py-2 border rounded-lg mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 mb-4"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg mb-3"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-100 mb-4"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* DIVIDER */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* PIN FORM */}
        <form onSubmit={handlePinLogin}>
          <input
            type="password"
            placeholder="Enter PIN"
            autoComplete="new-password"
            className="w-full px-4 py-2 border rounded-lg mb-3"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            Login with PIN
          </button>
        </form>

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