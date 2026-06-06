import { http, HttpResponse } from "msw";

import { TFGM_API_URL } from "@app/constants";
import type { LiveTram } from "@app/hooks";

export const mockTrams: LiveTram[] = [
  {
    carriages: "Single",
    destinationDisplay: "Piccadilly",
    status: "Due",
    due: 3,
  },
];

export const handlers = [
  http.get(`${TFGM_API_URL}/trams`, () => HttpResponse.json(mockTrams)),
];
