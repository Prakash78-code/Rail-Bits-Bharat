import { Link } from "react-router-dom";
import { Train, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-display font-bold text-gradient mb-4">404</div>
        <div className="text-5xl mb-6">🚂💨</div>
        <h1 className="font-display text-2xl font-bold mb-2">Train Missed!</h1>
        <p className="text-muted-foreground mb-8">This page left the station. Let's get you back on track.</p>
        <Link to="/" className="btn-primary">
          <Home className="h-5 w-5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
