import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";

export default function SetPinPage() {
  const navigate = useNavigate();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirm, setConfirm] = useState(["", "", "", ""]);
  const [step, setStep] = useState<"set" | "confirm">("set");
  const [error, setError] = useState("");

  function handlePinInput(arr: string[], setArr: (v: string[]) => void, idx: number, val: string) {
    const newArr = [...arr];
    newArr[idx] = val.slice(-1);
    setArr(newArr);
    if (val && idx < 3) document.getElementById(`${step}-pin-${idx + 1}`)?.focus();
  }

  function handleNext() {
    if (pin.some(d => !d)) { setError("Enter all 4 digits"); return; }
    setError("");
    setStep("confirm");
  }

  function handleConfirm() {
    if (confirm.join("") !== pin.join("")) { setError("PINs don't match, try again"); setConfirm(["","","",""]); return; }
    navigate("/passenger");
  }

  const currentArr = step === "set" ? pin : confirm;
  const setCurrentArr = step === "set" ? setPin : setConfirm;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl gradient-saffron flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Lock className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-xl font-bold mb-1">{step === "set" ? "Set Your Quick PIN" : "Confirm PIN"}</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {step === "set" ? "Choose a 4-digit PIN for quick login" : "Re-enter your PIN to confirm"}
          </p>

          <div className="flex gap-3 justify-center mb-4">
            {currentArr.map((d, i) => (
              <input
                key={i}
                id={`${step}-pin-${i}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handlePinInput(currentArr, setCurrentArr, i, e.target.value)}
                onKeyDown={e => e.key === "Backspace" && !d && i > 0 && document.getElementById(`${step}-pin-${i - 1}`)?.focus()}
                className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-input focus:border-accent bg-background focus:outline-none transition-colors"
              />
            ))}
          </div>

          {error && <p className="text-destructive text-sm mb-3">{error}</p>}

          <button
            onClick={step === "set" ? handleNext : handleConfirm}
            className="btn-primary w-full py-3"
          >
            {step === "set" ? "Continue" : <span className="flex items-center gap-2 justify-center"><CheckCircle2 className="h-5 w-5" />Set PIN & Continue</span>}
          </button>

          <button onClick={() => navigate("/passenger")} className="btn-ghost w-full mt-3 text-sm text-muted-foreground">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}