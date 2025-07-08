import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { DisplayInfo } from "./displayInfo";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

beforeEach(() => {
	global.fetch = jest.fn();
	jest.spyOn(window, "confirm").mockImplementation(() => true);
	jest.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
	jest.resetAllMocks();
});

describe("DisplayInfo component", () => {
	it("affiche les utilisateurs récupérés depuis l'API", async () => {
		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				utilisateurs: [
					[1, "Alice", "alice@example.com", true],
					[2, "Bob", "bob@example.com", false],
				],
			}),
		});

		render(<DisplayInfo />);

		expect(await screen.findByText(/Alice/)).toBeInTheDocument();
		expect(screen.getByText(/bob@example.com/i)).toBeInTheDocument();
		expect(screen.getAllByText(/delete/i)).toHaveLength(2);
	});

	it("affiche un message d'erreur si l'API échoue", async () => {
		fetch.mockResolvedValueOnce({
			ok: false,
		});

		render(<DisplayInfo />);

		expect(
			await screen.findByText(/impossible de récupérer/i)
		).toBeInTheDocument();
	});

	it("supprime un utilisateur après confirmation", async () => {
		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				utilisateurs: [[1, "Alice", "alice@example.com", true]],
			}),
		});

		fetch.mockResolvedValueOnce({ ok: true });

		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				utilisateurs: [],
			}),
		});

		render(<DisplayInfo />);

		await screen.findByText(/alice@example.com/i);

		fireEvent.click(screen.getByText(/delete/i));

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith(`${SERVER_URL}/users/1`, {
				method: "DELETE",
			});
		});

		expect(window.alert).toHaveBeenCalledWith("Utilisateur supprimé !");
	});
});
