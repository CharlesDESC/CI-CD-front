import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "./registerForm";

beforeEach(() => {
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
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/is admin/i)).toBeInTheDocument();
});

test("permet de remplir le formulaire et de le soumettre", async () => {
  render(<RegisterForm />);

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "alice" },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "alice@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "secret" },
  });
  fireEvent.click(screen.getByLabelText(/is admin/i));

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
          is_admin: true,
        }),
      })
    )
  );
});