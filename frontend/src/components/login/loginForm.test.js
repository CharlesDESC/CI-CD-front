import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./loginForm";

beforeEach(() => {
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ access_token: "fake-token" }),
      ok: true,
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("affiche les champs du formulaire de login", () => {
  render(<LoginForm />);
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test("permet de se connecter et appelle l'API", async () => {
  render(<LoginForm />);

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "bob" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "mypassword" },
  });

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() =>
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/login"),
      expect.objectContaining({
        method: "POST",
        headers: expect.any(Object),
        body: JSON.stringify({
          username: "bob",
          password: "mypassword",
        }),
      })
    )
  );
});