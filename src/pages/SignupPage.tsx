import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Loader from "../components/Loader";
import { toast } from "sonner";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !pin) {
      toast.error("All fields required ❌");
      return;
    }

    if (pin.length !== 4) {
      toast.error("PIN must be 4 digits ❌");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Firebase signup
      await createUserWithEmailAndPassword(auth, email, password);

      // 🔢 Save PIN
      localStorage.setItem("userPIN", pin);

      toast.success("Signup Success ✅");

      navigate("/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4">

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-md transition-all">

        <h1 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
          Signup
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          className="border p-2 mb-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* PIN */}
        <input
          type="password"
          placeholder="Set 4-digit PIN"
          className="border p-2 mb-2 w-full rounded"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        {/* Button / Loader */}
        {loading ? (
          <Loader />
        ) : (
          <button
            onClick={handleSignup}
            className="bg-green-500 hover:bg-green-600 transition-all text-white px-4 py-2 rounded w-full"
          >
            Signup
          </button>
        )}

        {/* Login */}
        <p className="mt-4 text-center text-black dark:text-white">
          Already have account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignupPage;