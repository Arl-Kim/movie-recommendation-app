import { describe, it, expect, vi, beforeEach } from "vitest";

describe("tmdbApiService", () => {
  let tmdbApiClient: any;
  let tmdbApiService: any;

  beforeEach(async () => {
    // Reset loaded modules so module-level caches in the service are reset between tests
    vi.resetModules();
    const mod = await import("../../services/tmdbApiClient");
    tmdbApiClient = mod.default;
    tmdbApiService = mod.tmdbApiService;
  });

  it("fetches popular movies and caches the result", async () => {
    const mockData = {
      results: [{ id: 1, title: "Test Movie" }],
      page: 1,
      total_results: 1,
      total_pages: 1,
    };

    const spy = vi
      .spyOn(tmdbApiClient, "get")
      .mockResolvedValue({ data: mockData });

    const result1 = await tmdbApiService.getPopularMovies(1);
    expect(spy).toHaveBeenCalledWith("movie/popular", { params: { page: 1 } });
    expect(result1).toEqual(mockData);

    // Call again with the same page -> should return cached result and NOT call the network again
    spy.mockClear();
    const result2 = await tmdbApiService.getPopularMovies(1);
    expect(tmdbApiClient.get).not.toHaveBeenCalled();
    expect(result2).toEqual(mockData);

    // Different page triggers a new fetch
    const mockPage2 = {
      results: [{ id: 2, title: "Page 2 Movie" }],
      page: 2,
      total_results: 1,
      total_pages: 1,
    };
    vi.spyOn(tmdbApiClient, "get").mockResolvedValue({ data: mockPage2 });
    const result3 = await tmdbApiService.getPopularMovies(2);
    expect(tmdbApiClient.get).toHaveBeenCalledWith("movie/popular", {
      params: { page: 2 },
    });
    expect(result3).toEqual(mockPage2);
  });

  it("searches movies and respects caching per query+page", async () => {
    const mockSearch = {
      results: [{ id: 10, title: "Search Hit" }],
      page: 1,
      total_results: 1,
      total_pages: 1,
    };

    const spy = vi
      .spyOn(tmdbApiClient, "get")
      .mockResolvedValue({ data: mockSearch });

    const r1 = await tmdbApiService.searchMovies("inception", 1);
    expect(spy).toHaveBeenCalledWith("search/movie", {
      params: { query: "inception", page: 1 },
    });
    expect(r1).toEqual(mockSearch);

    spy.mockClear();
    const r2 = await tmdbApiService.searchMovies("inception", 1);
    expect(tmdbApiClient.get).not.toHaveBeenCalled(); // served from cache
    expect(r2).toEqual(mockSearch);
  });

  it("fetches movie by id and movie credits", async () => {
    const movie = { id: 42, title: "The Answer" };
    const credits = { id: 42, cast: [], crew: [] };

    vi.spyOn(tmdbApiClient, "get").mockImplementation(async () => {
      return { data: { id: 42, title: "The Answer" } };
    });

    const m = await tmdbApiService.getMovieById(42);
    expect(m).toEqual(movie);

    const c = await tmdbApiService.getMovieCredits(42);
    expect(c).toEqual(credits);
  });

  it("getLatestMovies uses discover endpoint with release_date filter", async () => {
    const latest = { results: [], page: 1, total_results: 0, total_pages: 0 };
    const spy = vi
      .spyOn(tmdbApiClient, "get")
      .mockResolvedValue({ data: latest });

    const res = await tmdbApiService.getLatestMovies(1);
    // Expect discover/movie used
    expect(spy).toHaveBeenCalledWith(
      "discover/movie",
      expect.objectContaining({
        params: expect.objectContaining({
          page: 1,
          sort_by: "release_date.desc",
          "release_date.lte": expect.any(String),
        }),
      })
    );
    expect(res).toEqual(latest);
  });
});
