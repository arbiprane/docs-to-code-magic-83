import { useState } from "react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.3 12 2.3 6.9 2.3 2.8 6.4 2.8 11.5S6.9 20.7 12 20.7c6.9 0 9.4-4.8 9.4-8.6 0-.6-.06-1-.14-1.9H12z"
      />
    </svg>
  );
}

export function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) toast.error("Sign-in failed. Please try again.");
    } catch {
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(55%_65%_at_50%_-10%,var(--color-accent)_0%,transparent_65%)]"
      />
      <div className="surface relative w-full max-w-sm rounded-2xl p-8 text-center ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Workforce analytics
        </span>
        <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-foreground">
          AI job impact tracker
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in with your Google account to view exposure, replacement risk,
          and recommended actions across occupations.
        </p>
        <Button
          onClick={signIn}
          disabled={loading}
          className="mt-6 w-full"
          size="lg"
        >
          <GoogleIcon />
          <span className="ml-2">Continue with Google</span>
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          Google is the only sign-in method available for this dashboard.
        </p>
      </div>
    </div>
  );
}
