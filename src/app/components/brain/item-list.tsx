"use client";

import { BrainItem } from "@/types/brain";
import ItemCard from "./item-card";

export default function ItemList({ items }: { items: BrainItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-default-400 border-2 border-dashed border-default-200 rounded-lg">
        <p className="text-lg font-medium">No items found</p>
        <p className="text-sm opacity-70">Add some content to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-500">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
