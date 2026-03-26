import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ end, duration = 1500, prefix = "", suffix = "", className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const prevEnd = useRef(end);

  useEffect(() => {
    const start = count;
    const target = end;
    if (start === target) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (target - start) * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    prevEnd.current = end;
    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}{count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}
