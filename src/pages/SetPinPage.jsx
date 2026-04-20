import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SetPinPage() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    if (pin.length !== 4) {
      toast.error("Enter 4 digit PIN ❌");
      return;
    }

    if (pin !== confirmPin) {
      toast.error("PIN mismatch ❌");
      return;
    }

    localStorage.setItem("userPIN", pin);

    toast.success("PIN Saved 🔐");
    navigate("/menu");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow w-80">

        <h2 className="text-lg font-semibold mb-4 text-center">
          Set Your PIN 🔐
        </h2>

        <input
          type="password"
          placeholder="Enter PIN"
          className="border w-full p-2 mb-2 rounded"
          onChange={(e) => setPin(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm PIN"
          className="border w-full p-2 mb-4 rounded"
          onChange={(e) => setConfirmPin(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          Save PIN
        </button>

      </div>
    </div>
  );
}