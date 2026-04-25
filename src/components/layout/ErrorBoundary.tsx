import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      "Flyvio layout error boundary caught an error.",
      error,
      errorInfo,
    );
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
          <Card className="w-full border-border/80 bg-white/90 dark:bg-indigo-950/80">
            <CardHeader>
              <CardDescription>Unexpected error</CardDescription>
              <CardTitle className="text-3xl">
                This screen failed to render.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-indigo-700 dark:text-indigo-200">
                {this.state.error.message ||
                  "An unknown rendering error occurred."}
              </p>
              <Button type="button" onClick={this.reset}>
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
