"use client";

import { useEffect } from "react";
import { Button } from "@heroui/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
      <h2 className="text-xl font-semibold text-danger">Something went wrong!</h2>
      <p className="text-default-500 max-w-md">
        {error.message || "Failed to load brain content. Please try again later."}
      </p>
      <Button
        color="primary"
        onPress={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
