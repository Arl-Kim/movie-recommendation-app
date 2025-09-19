export type MovieCategory =
  | "popular"
  | "now_playing"
  | "top_rated"
  | "upcoming"
  | "search";

// Helper function to get display name for category
export const getCategoryDisplayName = (category: MovieCategory): string => {
  const names: Record<MovieCategory, string> = {
    popular: "Popular Movies",
    now_playing: "Now Playing",
    top_rated: "Top Rated",
    upcoming: "Upcoming Movies",
    search: "Search Results",
  };
  return names[category];
};
