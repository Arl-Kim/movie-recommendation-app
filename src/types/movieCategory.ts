export type MovieCategory =
  | "popular"
  | "now_playing"
  | "top_rated"
  | "upcoming"
  | "latest"
  | "favorites"
  | "watchlist"
  | "search";

// Helper function to get display name for category
export const getCategoryDisplayName = (category: MovieCategory): string => {
  const names: Record<MovieCategory, string> = {
    popular: "Popular Movies",
    now_playing: "Now Playing",
    top_rated: "Top Rated",
    upcoming: "Upcoming Movies",
    latest: "Latest Movies",
    favorites: "Your Favorite Movies",
    watchlist: "Your Watchlist",
    search: "Search Results",
  };
  return names[category];
};
