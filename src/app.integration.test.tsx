// @vitest-environment happy-dom

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { cleanup, screen, waitFor } from "@testing-library/react";

import { TFGM_API_URL } from "@app/constants";
import {
  makeRowDescriptors,
  type RowDescriptors,
} from "@app/helpers/row-descriptor-helpers";
import { handlers, mockTrams } from "@app/test/msw/handlers";
import { renderApp } from "@app/test/render-app";

vi.mock("phaser", () => ({
  default: {},
}));

vi.mock("@app/phaser", () => ({
  initialiseGame: vi.fn(() => ({
    destroy: vi.fn(),
    changeRowDescriptors: vi.fn(),
    setIsFetching: vi.fn(),
  })),
}));

const DISPLAY_ALERT =
  "Welcome to Metrolink. Ticket checks are taking place across the network today. For travel information visit www.TfGM.com.";

const server = setupServer(...handlers);

const getRowDescriptors = (): RowDescriptors => {
  const element = document.querySelector("[data-row-descriptors]");
  expect(element).not.toBeNull();

  return JSON.parse(
    element!.getAttribute("data-row-descriptors")!,
  ) as RowDescriptors;
};

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("App integration", () => {
  it("displays row descriptors from a successful tram fetch", async () => {
    renderApp();

    await waitFor(() => {
      expect(getRowDescriptors()).toEqual(
        makeRowDescriptors(mockTrams, DISPLAY_ALERT),
      );
    });
  });

  it("shows an error alert when the tram fetch fails", async () => {
    server.use(
      http.get(`${TFGM_API_URL}/trams`, () =>
        HttpResponse.json(null, { status: 500 }),
      ),
    );

    renderApp();

    expect(await screen.findByText("Unable to load tram data.")).toBeTruthy();

    expect(getRowDescriptors()).toEqual(makeRowDescriptors([], DISPLAY_ALERT));
  });
});
