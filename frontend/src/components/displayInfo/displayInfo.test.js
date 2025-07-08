import { render, screen, waitFor } from "@testing-library/react";
import { DisplayInfo } from "./displayInfo";

beforeEach(() => {
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          utilisateurs: [
            ["alice"],
            ["bob"],
          ],
        }),
      ok: true,
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("affiche les utilisateurs récupérés depuis l'API", async () => {
  render(<DisplayInfo />);

  expect(screen.getByText(/chargement/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    expect(screen.getByText(/bob/i)).toBeInTheDocument();
  });
});