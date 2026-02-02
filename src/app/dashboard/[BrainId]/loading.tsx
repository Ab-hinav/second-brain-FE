import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-64">
      <Spinner size="lg" color="primary" label="Loading content..." />
    </div>
  );
}
