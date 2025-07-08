import React from "react";
import { render, screen } from "@testing-library/react";
import { Users } from "./Users";

jest.mock("../../components/login/loginForm", () => ({
	LoginForm: () => <div data-testid='login-form'>LoginForm Component</div>,
}));

describe("Users component", () => {
	test("renders the LoginForm component", () => {
		render(<Users />);
		expect(screen.getByTestId("login-form")).toBeInTheDocument();
	});
});
