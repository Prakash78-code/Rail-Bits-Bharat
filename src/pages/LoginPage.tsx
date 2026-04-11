import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  // 🔐 Email Login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Success ✅");
      navigate("/menu");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 🔢 PIN Login
  const handlePinLogin = () => {
    const savedPin = localStorage.getItem("userPIN");

    if (!savedPin) {
      alert("No PIN found, please signup first ❌");
      return;
    }

    if (pin === savedPin) {
      alert("PIN Login Success ✅");
      navigate("/menu");
    } else {
      alert("Wrong PIN ❌");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {/* 🔐 Email Login */}
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-2 w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-2 w-64"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded w-64"
      >
        Login with Email
      </button>

      {/* 🔥 Divider */}
      <p className="my-4 text-gray-500">OR</p>

      {/* 🔢 PIN Login */}
      <input
        type="password"
        placeholder="Enter PIN"
        className="border p-2 mb-2 w-64"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <button
        onClick={handlePinLogin}
        className="bg-green-500 text-white px-4 py-2 rounded w-64"
      >
        Login with PIN
      </button>

      {/* Signup Link */}
      <p className="mt-4">
        Don't have account?{" "}
        <Link to="/signup" className="text-blue-500">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;