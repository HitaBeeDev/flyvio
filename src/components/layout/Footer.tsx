import { Link } from "react-router-dom";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-border/80 pt-6">
      <div className="flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
            SkyQuest
          </p>
          <p className="mt-1 font-serif text-xl text-slate-950 dark:text-stone-50">
            Flight Atelier
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            className="hover:text-slate-950 dark:hover:text-stone-100"
            to="/"
          >
            Home
          </Link>
          <Link
            className="hover:text-slate-950 dark:hover:text-stone-100"
            to="/explore"
          >
            Explore
          </Link>
          <a
            className="hover:text-slate-950 dark:hover:text-stone-100"
            href="https://github.com/HitaBeeDev/skyQuest"
            rel="noreferrer"
            target="_blank"
          >
            Source
          </a>
        </div>

        <p>© {year} SkyQuest</p>
      </div>
    </footer>
  );
}
