import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { RegisterForm } from "./registerForm";

describe("RegisterForm component", () => {
	test("renders inputs and submits form data", async () => {
		const mockOnSubmit = jest.fn().mockResolvedValueOnce(); // doit être async pour simuler le comportement réel

		render(<RegisterForm onSubmit={mockOnSubmit} />);

		fireEvent.change(screen.getByLabelText(/username/i), {
			target: { value: "charles", name: "username" },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "charles@example.com", name: "email" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "mypassword", name: "password" },
		});

		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: /register/i }));
		});

		expect(mockOnSubmit).toHaveBeenCalledWith({
			username: "charles",
			email: "charles@example.com",
			password: "mypassword",
			is_admin: false,
		});

		expect(mockOnSubmit).toHaveBeenCalledTimes(1);
	});
});
