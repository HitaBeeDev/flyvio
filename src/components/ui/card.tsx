import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-[1.75rem] border border-border/80 bg-white/90 py-6 text-card-foreground shadow-[0_20px_70px_rgba(30,27,75,0.08)] backdrop-blur dark:bg-indigo-950/80",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

function FlightCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      data-slot="flight-card"
      className={cn(
        "relative overflow-hidden rounded-3xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
      {...props}
    />
  );
}

function FlightCardDivider({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="flight-card-divider"
      className={cn(
        "relative mx-6 border-t border-dashed border-indigo-200 dark:border-indigo-700",
        "before:absolute before:-left-8 before:top-1/2 before:size-6 before:-translate-y-1/2 before:rounded-full before:bg-[#eef2ff] dark:before:bg-[#1e1b4b]",
        "after:absolute after:-right-8 after:top-1/2 after:size-6 after:-translate-y-1/2 after:rounded-full after:bg-[#eef2ff] dark:after:bg-[#1e1b4b]",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  FlightCard,
  FlightCardDivider,
};
