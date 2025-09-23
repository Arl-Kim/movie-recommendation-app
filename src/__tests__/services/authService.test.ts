import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the personalizationService that authService uses so register does not interact
// with real localStorage logic in that module.
vi.mock("../services/personalizationService", () => {
  return {
    personalizationService: {
      getUserData: vi.fn().mockReturnValue({}),
      saveUserData: vi.fn(),
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

describe("authService (mocked personalizationService)", () => {
  let authService: any;

  beforeEach(async () => {
    vi.resetModules(); // reset the module state and mockUsers
    const mod = await import("../../services/authService");
    authService = mod.authService;
    // Reset localStorage mocks (setup.ts provides vi.fn() implementations)
    localStorageMock.getItem?.mockReset?.();
    localStorageMock.setItem?.mockReset?.();
    localStorageMock.removeItem?.mockReset?.();
  });

  it("login succeeds with correct demo credentials and stores auth when rememberMe=true", async () => {
    const resp = await authService.login({
      email: "demo@savannahmovies.com",
      password: "Savannah123*",
      rememberMe: true,
    });

    expect(resp.user).toBeDefined();
    expect(resp.user.email).toBe("demo@savannahmovies.com");
    expect(typeof resp.token).toBe("string");
    // When rememberMe true, setStoredAuth should call localStorage.setItem at least twice
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  it("login throws for incorrect credentials", async () => {
    await expect(
      authService.login({
        email: "wrong@x.com",
        password: "nope",
        rememberMe: false,
      })
    ).rejects.toThrow("Invalid email or password");
  });

  it("register creates a new user and stores token/user in localStorage", async () => {
    // Choose a brand new email (module is reset each test due to resetModules)
    const email = `new${Date.now()}@example.com`;
    const resp = await authService.register({
      email,
      name: "New User",
      password: "Pass123!",
      confirmPassword: "Pass123!",
    });

    expect(resp.user).toBeDefined();
    expect(resp.user.email).toBe(email);
    expect(typeof resp.token).toBe("string");

    // Register calls setStoredAuth which uses localStorage.setItem
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  it("logout clears stored auth", async () => {
    // Setup spies on removeItem
    await authService.logout();
    expect(global.localStorage.removeItem).toHaveBeenCalled();
  });

  it("validateToken accepts tokens that start with mock-jwt-token-", async () => {
    const token = "mock-jwt-token-12345";
    const user = await authService.validateToken(token);
    expect(user).toBeDefined();
    expect(user.email).toBe("demo@savannahmovies.com");
  });

  it("validateToken throws for invalid token", async () => {
    await expect(authService.validateToken("bad-token")).rejects.toThrow(
      "Invalid token"
    );
  });
});
