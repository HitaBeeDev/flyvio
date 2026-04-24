import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-[1.75rem] border border-border/80 bg-white/85 py-6 text-card-foreground shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-slate-950/75",
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
        "relative overflow-hidden rounded-[2rem] border-slate-200/80 bg-white/95 dark:border-slate-800/80 dark:bg-slate-950/90",
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
        "relative mx-6 border-t border-dashed border-slate-300 dark:border-slate-700",
        "before:absolute before:-left-8 before:top-1/2 before:size-6 before:-translate-y-1/2 before:rounded-full before:bg-[linear-gradient(180deg,_#fcfbf8_0%,_#f2ede3_100%)] dark:before:bg-[linear-gradient(180deg,_#09090b_0%,_#111827_100%)]",
        "after:absolute after:-right-8 after:top-1/2 after:size-6 after:-translate-y-1/2 after:rounded-full after:bg-[linear-gradient(180deg,_#fcfbf8_0%,_#f2ede3_100%)] dark:after:bg-[linear-gradient(180deg,_#09090b_0%,_#111827_100%)]",
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
