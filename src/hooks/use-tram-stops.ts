import { useQuery } from "@tanstack/react-query";

import { TFGM_API_URL } from "@app/constants";

const TRAM_STOPS_SEARCH_LOCATIONS_URL = `${TFGM_API_URL}/search-locations`;

export type TramService = {
  id: string;
  name: string;
};

export type TramStop = {
  atcoCode: string;
  name: string;
  services: TramService[];
};

const fetchTramStops = async (): Promise<TramStop[]> => {
  const response = await fetch(TRAM_STOPS_SEARCH_LOCATIONS_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch tram stops: ${response.status} ${response.statusText}`,
    );
  }
  return (await response.json()) as TramStop[];
};

export const useTramStops = () => {
  return useQuery({
    queryKey: ["search-locations"],
    queryFn: fetchTramStops,
    staleTime: Infinity,
  });
};
