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
  expect(screen.getByLabelText(/Nom d'utilisateur/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
});

test("permet de se connecter et appelle l'API", async () => {
  render(<LoginForm />);

  fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), {
    target: { value: "bob" },
  });
  fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
    target: { value: "mypassword" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

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