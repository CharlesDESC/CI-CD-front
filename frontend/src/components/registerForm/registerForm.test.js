import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "./registerForm";

beforeEach(() => {
  window.alert = jest.fn();
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: "User created successfully" }),
      ok: true,
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("affiche les champs du formulaire d'inscription", () => {
  render(<RegisterForm />);
  expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
});

test("permet de remplir le formulaire et de le soumettre", async () => {
  render(<RegisterForm />);

  fireEvent.change(screen.getByLabelText(/Username/i), {
    target: { value: "alice" },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "alice@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/Password/i), {
    target: { value: "secret" },
  });

  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  await waitFor(() =>
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users"),
      expect.objectContaining({
        method: "POST",
        headers: expect.any(Object),
        body: JSON.stringify({
          username: "alice",
          email: "alice@example.com",
          password: "secret",
          is_admin: false
        }),
      })
    )
  );
});