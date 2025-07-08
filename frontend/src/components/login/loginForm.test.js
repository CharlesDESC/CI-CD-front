import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "./loginForm";
import * as DisplayInfoModule from "../displayInfo/displayInfo";

// Mock le composant DisplayInfo pour qu'il retourne un texte visible
jest.mock("../displayInfo/displayInfo", () => ({
	DisplayInfo: jest.fn(() => (
		<div data-testid='display-info'>Mock DisplayInfo</div>
	)),
}));

beforeEach(() => {
	global.fetch = jest.fn();
});

describe("LoginForm", () => {
	it("affiche le formulaire de connexion", () => {
		render(<LoginForm />);
		expect(screen.getByText(/Connexion Admin requise/i)).toBeInTheDocument();
	});

	it("affiche une erreur si l'utilisateur n'est pas admin", async () => {
		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ is_admin: false }),
		});

		render(<LoginForm />);
		fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), {
			target: { value: "user" },
		});
		fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
			target: { value: "pass" },
		});
		fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

		expect(
			await screen.findByText(/Vous devez être admin/i)
		).toBeInTheDocument();
	});

	it("affiche une erreur en cas d'échec de connexion", async () => {
		fetch.mockResolvedValueOnce({
			ok: false,
			json: async () => ({ detail: "Identifiants invalides" }),
		});

		render(<LoginForm />);
		fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), {
			target: { value: "admin" },
		});
		fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
			target: { value: "wrongpass" },
		});
		fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

		expect(
			await screen.findByText(/Identifiants invalides/i)
		).toBeInTheDocument();
	});
});
