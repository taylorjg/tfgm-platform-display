import { useQuery, type UseQueryResult } from "@tanstack/react-query";

// curl https://hsf41foww6.execute-api.us-east-1.amazonaws.com/search-locations -s | jq > search-locations.json
import searchLocations from "@app/data/search-locations.json" with { type: "json" };

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
  return searchLocations as TramStop[];
};

export const useTramStops = (): UseQueryResult<TramStop[]> => {
  return useQuery({
    queryKey: ["get-search-locations"],
    queryFn: fetchTramStops,
    staleTime: Infinity,
  });
};
