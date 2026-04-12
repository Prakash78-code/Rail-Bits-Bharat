import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Loader from "../components/Loader";
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
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔢 PIN Login
  const handlePinLogin = () => {
    const savedPin = localStorage.getItem("userPIN");

    if (!savedPin) {
      toast.error("No PIN found, signup first ❌");
      return;
    }

    if (pin === savedPin) {
      toast.success("PIN Login Success ✅");
      navigate("/menu");
    } else {
      toast.error("Wrong PIN ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4">
      
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-md transition-all">

        <h1 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
          Login
        </h1>

        {/* 🔐 Email Login */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {loading ? (
          <Loader />
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-4 py-2 rounded w-full"
          >
            Login with Email
          </button>
        )}

        {/* Divider */}
        <p className="my-4 text-center text-gray-500">OR</p>

        {/* 🔢 PIN Login */}
        <input
          type="password"
          placeholder="Enter PIN"
          className="border p-2 mb-2 w-full rounded"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <button
          onClick={handlePinLogin}
          className="bg-green-500 hover:bg-green-600 transition-all text-white px-4 py-2 rounded w-full"
        >
          Login with PIN
        </button>

        {/* Signup */}
        <p className="mt-4 text-center text-black dark:text-white">
          Don't have account?{" "}
          <Link to="/signup" className="text-blue-500">
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;