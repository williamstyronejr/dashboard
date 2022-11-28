"use client";

import { useMutation } from "@tanstack/react-query";

export function useCollectionUpdate(id: string, options = {}) {
  return useMutation(
    ["collection", id, "edit"],
    async ({ title }: { title: string }) => {
      const res = await fetch(`/api/collection/${id}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      if (res.ok) return await res.json();
    },
    options
  );
}
