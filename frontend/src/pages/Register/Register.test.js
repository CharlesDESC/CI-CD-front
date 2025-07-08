import React from "react";
import { render, screen } from "@testing-library/react";
import { Register } from "./Register";

jest.mock("../../components/registerForm/registerForm", () => ({
	RegisterForm: () => (
		<div data-testid='register-form'>RegisterForm Component</div>
	),
}));

describe("Register component", () => {
	test("renders the title and paragraph", () => {
		render(<Register />);

		expect(
			screen.getByRole("heading", { name: /Bienvenue sur la page Register/i })
		).toBeInTheDocument();

		expect(
			screen.getByText(/Ceci est la page Home de votre application./i)
		).toBeInTheDocument();
	});

	test("renders the RegisterForm component", () => {
		render(<Register />);
		expect(screen.getByTestId("register-form")).toBeInTheDocument();
	});
});
