import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Home } from "./Home";

// Mock global.fetch
beforeEach(() => {
	jest.spyOn(global, "fetch");
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe("Home component", () => {
	test("renders title and initial elements", () => {
		render(<Home />);
		expect(
			screen.getByRole("heading", { name: /Users manager/i })
		).toBeInTheDocument();
		expect(screen.getByText(/Total users:/i)).toBeInTheDocument();
	});

	test("fetches and displays users correctly", async () => {
		// Arrange: prepare fake data
		const fakeUsers = [
			{ id: 1, username: "Alice" },
			{ id: 2, username: "Bob" },
		];

		global.fetch.mockResolvedValueOnce({
			json: async () => ({ utilisateurs: fakeUsers }),
		});

		render(<Home />);

		await waitFor(() => {
			expect(screen.getByText("Total users: 2")).toBeInTheDocument();
		});

		expect(screen.getByText("Alice")).toBeInTheDocument();
		expect(screen.getByText("Bob")).toBeInTheDocument();
	});

	test("handles fetch error gracefully", async () => {
		const consoleErrorSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		global.fetch.mockRejectedValueOnce(new Error("Fetch failed"));

		render(<Home />);

		await waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Error fetching user count:",
				expect.any(Error)
			);
		});

		expect(screen.getByText("Total users:")).toBeInTheDocument();

		consoleErrorSpy.mockRestore();
	});

	test("shows zero users when API returns empty array", async () => {
		global.fetch.mockResolvedValueOnce({
			json: async () => ({ utilisateurs: [] }),
		});

		render(<Home />);

		await waitFor(() => {
			expect(screen.getByText("Total users: 0")).toBeInTheDocument();
		});
	});
});
