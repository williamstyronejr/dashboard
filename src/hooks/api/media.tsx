"use client";

import { Collection } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useDeleteEntity(options?: any) {
  return useMutation(
    ["delete"],
    async (entityIds: string) => {
      const res = await fetch("/api/entity/delete", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entityId: entityIds }),
        method: "DELETE",
      });

      const body = await res.json();
      return body;
    },
    options
  );
}

export function useSearchCollections(title: string) {
  return useQuery(["search", "collection", title], async () => {
    const res = await fetch(`/api/collection/search?title=${title}`);
    if (res.ok) return (await res.json()).results as Array<Collection>;
  });
}

export function useAddItemsToCollection(options = {}) {
  return useMutation(
    ["add", "collection"],
    async ({ mediaIds, id }: { id: string; mediaIds: string }) => {
      const res = await fetch(`/api/collection/${id}/media`, {
        method: "POST",
        body: JSON.stringify({ mediaIds }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) return await res.json();
    },
    options
  );
}

export function useCreateCollection(options = {}) {
  return useMutation(
    ["create", "collection"],
    async ({ title, mediaIds }: { title: string; mediaIds: string }) => {
      const res = await fetch("/api/collection", {
        method: "POST",
        body: JSON.stringify({ title, mediaIds }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) return await res.json();
    },
    options
  );
}
