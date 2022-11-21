"use client";

import { Collection, Entity, EntityTag, Tag } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type CollectionById =
  | null
  | (Collection & {
      entity: Entity & {
        EntityTag: (EntityTag & {
          tag: Tag;
        })[];
      };
    });

export function useCollectionById(id: string) {
  return useQuery(["collection", id], async () => {
    const res = await fetch(`/api/collection/${id}`);
    if (res.ok) return (await res.json()).collection as CollectionById;
  });
}
