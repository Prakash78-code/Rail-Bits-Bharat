import { ShieldCheck, ShieldAlert } from "lucide-react";

interface FssaiBadgeProps {
  fssaiNumber: string;
  verified: boolean;
}

export const FssaiBadge = ({ fssaiNumber, verified }: FssaiBadgeProps) => {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold w-fit border ${
      verified
        ? "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
        : "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700"
    }`}>
      {verified
        ? <ShieldCheck className="w-3.5 h-3.5" />
        : <ShieldAlert className="w-3.5 h-3.5" />
      }
      <span>{verified ? `FSSAI ✓ ${fssaiNumber}` : "FSSAI Pending"}</span>
    </div>
  );
};