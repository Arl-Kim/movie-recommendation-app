import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * We mock the tmdbApiService to avoid real network calls.
 * personalizationService will import tmdbApiService from ../services/tmdbApiClient
 */
vi.mock("../../services/tmdbApiClient", async () => {
    return {
      tmdbApiService: {
        getMovieById: vi.fn(),
        getPopularMovies: vi.fn(),
        getMovieCredits: vi.fn(),
      },
    };
  });

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };
  
  Object.defineProperty(global, "localStorage", {
    value: localStorageMock,
  });

describe("personalizationService", () => {
  let personalizationService: any;
  let tmdbMock: any;

  beforeEach(async () => {

    // Reset localStorage mocks from setup
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem?.mockReset?.();
    localStorageMock.removeItem?.mockReset?.();

    // Import after mocking
    const mod = await import("../../services/personalizationService");
    personalizationService = mod.personalizationService;

    // Get reference to the mocked tmdbApiService
    const tmdbMod = await import("../../services/tmdbApiClient");
    tmdbMock = tmdbMod.tmdbApiService;
  });

  it("getUserData returns empty object when nothing stored", () => {
    localStorageMock.getItem.mockReturnValue(null); // Nothing in storage
    const data = personalizationService.getUserData();
    expect(data).toEqual({});
  });

  it("ensureUserExists creates and persists a user skeleton", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({}));
    const user = personalizationService.ensureUserExists("u1");
    expect(user.id).toBe("u1");
    // SsveUserData should call localStorage.setItem (persist)
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it("toggleFavorite adds and removes favorites and tracks interactions", () => {
    // Seed storage with a user that has empty favorites
    const seed = {
      u1: {
        id: "u1",
        favorites: [],
        watchlist: [],
        interactions: [],
        searchHistory: [],
        preferences: {},
      },
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(seed));

    // Add favorite
    const afterAdd = personalizationService.toggleFavorite("u1", 101);
    expect(afterAdd.favorites).toContain(101);
    // A call to saveUserData should have been made
    expect(global.localStorage.setItem).toHaveBeenCalled();

    // Remove favorite
    const afterRemove = personalizationService.toggleFavorite("u1", 101);
    expect(afterRemove.favorites).not.toContain(101);
  });

  it("analyzeUserPreferences builds preferences from interactions + movie details", async () => {
    // Seed user with one interaction for movie 101
    const seed = {
      u1: {
        id: "u1",
        interactions: [{ movieId: 101, type: "click", timestamp: Date.now() }],
        preferences: {},
      },
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(seed));

    // Mock movie details
    tmdbMock.getMovieById.mockResolvedValue({
      id: 101,
      genres: [{ id: 18, name: "Drama" }],
      release_date: "2001-05-20",
      vote_average: 8.2,
    });

    const prefs = await personalizationService.analyzeUserPreferences("u1");

    expect(prefs).toBeDefined();
    expect(Array.isArray(prefs.favoriteGenres)).toBe(true);
    // favoriteGenres should include 18 (Drama)
    expect(prefs.favoriteGenres).toContain(18);
    // preferredReleaseDecades should include 2000 (the 2000s)
    expect(prefs.preferredReleaseDecades).toContain(2000);
    // minRating should be a number and at least 5
    expect(typeof prefs.minRating).toBe("number");
    expect(prefs.minRating).toBeGreaterThanOrEqual(5);

    // Ensure saveUserData called to persist updated preferences
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  it("getPersonalizedRecommendations falls back to popular movies when no preferences", async () => {
    // Seed a user with no preferences
    const seed = {
      u1: {
        id: "u1",
        interactions: [],
        preferences: { favoriteGenres: [] },
      },
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(seed));

    // Mock popular movies
    const popular = {
      results: Array.from({ length: 20 }, (_, i) => ({ id: i + 1, title: `M${i + 1}` })),
      page: 1,
      total_results: 20,
      total_pages: 1,
    };
    tmdbMock.getPopularMovies.mockResolvedValue(popular);

    const recs = await personalizationService.getPersonalizedRecommendations("u1");
    // Should return up to 12 items from popular results
    expect(Array.isArray(recs)).toBe(true);
    expect(recs.length).toBeGreaterThan(0);
  });
});
