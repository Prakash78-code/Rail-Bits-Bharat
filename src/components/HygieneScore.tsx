interface HygieneScoreProps {
  score: number;
}

const getLevel = (score: number) => {
  if (score >= 85) return { color: "bg-green-500",  text: "text-green-600 dark:text-green-400",  label: "Excellent" };
  if (score >= 65) return { color: "bg-yellow-400", text: "text-yellow-600 dark:text-yellow-400", label: "Good" };
  if (score >= 45) return { color: "bg-orange-400", text: "text-orange-600 dark:text-orange-400", label: "Average" };
  return               { color: "bg-red-500",    text: "text-red-600 dark:text-red-400",    label: "Poor" };
};

export const HygieneScore = ({ score }: HygieneScoreProps) => {
  const { color, text, label } = getLevel(score);
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">🧼 Hygiene Score</span>
        <span className={`font-bold ${text}`}>{score}/100 · {label}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};