import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // 🔐 Firebase signup
      await createUserWithEmailAndPassword(auth, email, password);

      // 🔢 PIN validation
      if (pin.length !== 4) {
        alert("PIN must be 4 digits ❌");
        return;
      }

      // ✅ Save PIN locally
      localStorage.setItem("userPIN", pin);

      alert("Signup Success ✅");
      navigate("/login");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-2 w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password (min 6 chars)"
        className="border p-2 mb-2 w-64"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* PIN */}
      <input
        type="password"
        placeholder="Set 4-digit PIN"
        className="border p-2 mb-2 w-64"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      {/* Signup Button */}
      <button
        onClick={handleSignup}
        className="bg-green-500 text-white px-4 py-2 rounded w-64"
      >
        Signup
      </button>

      {/* Login Link */}
      <p className="mt-4">
        Already have account?{" "}
        <Link to="/login" className="text-blue-500">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;