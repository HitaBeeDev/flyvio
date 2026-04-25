import { Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <AppShell>
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-50">
          This route doesn&apos;t exist
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-indigo-700 dark:text-indigo-200">
          Looks like this flight path is unknown. Head back home and pick a
          route that actually clears departure.
        </p>
        <Button asChild className="mt-8 rounded-2xl">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </AppShell>
  );
}
