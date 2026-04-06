import { useQuery } from "@tanstack/react-query";

import { TFGM_API_URL } from "@app/constants";

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
  const url = `${TFGM_API_URL}/search-locations`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch tram stops: ${response.status} ${response.statusText}`,
    );
  }
  return (await response.json()) as TramStop[];
};

export const useTramStops = () => {
  return useQuery({
    queryKey: ["get-search-locations"],
    queryFn: fetchTramStops,
    staleTime: Infinity,
  });
};
