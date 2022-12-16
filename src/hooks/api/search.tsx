import { useQuery } from "@tanstack/react-query";

export function useSearch() {}

export function useSearchBar(query: string) {
  return useQuery(["search", query], async () => {
    if (query.trim() === "") return null;
    const res = await fetch(`/api/search/input?q=${query}`);

    if (res.ok) return await res.json();
    throw new Error("An error occurred during request, please try again.");
  });
}
