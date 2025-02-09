import React from "react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-8 w-2 animate-[loading_1s_ease-in-out_infinite] bg-black"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}
