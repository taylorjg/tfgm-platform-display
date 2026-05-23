import { useQuery } from "@tanstack/react-query";

import { TFGM_API_URL } from "@app/constants";
import { useOptions, type Configuration } from "@app/contexts";
import { testModesMap } from "@app/data/test-modes";

export type LiveTram = {
  carriages: string;
  destinationDisplay: string;
  status: string;
  due: number;
};

const fetchTrams = async (
  atcoCode: string | undefined,
  serviceIds: string[] | undefined,
  towards: "starts" | "ends" | undefined,
): Promise<LiveTram[]> => {
  const url = new URL(`${TFGM_API_URL}/trams`);

  url.searchParams.set("atcoCode", atcoCode ?? "");
  url.searchParams.set("serviceIds", serviceIds?.join(",") ?? "");
  url.searchParams.set("towards", towards ?? "");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch trams: ${response.status} ${response.statusText}`,
    );
  }
  return (await response.json()) as LiveTram[];
};

export const useGetTrams = (configuration: Configuration | null) => {
  const { options } = useOptions();
  const { refreshIntervalMs } = options;

  const atcoCode = configuration?.atcoCode;
  const serviceIds = configuration?.serviceIds;
  const towards = configuration?.towards;

  const searchParams = new URLSearchParams(window.location.search);
  const testModeParam = Number(searchParams.get("testMode"));
  const testData = testModesMap.get(testModeParam);

  return useQuery({
    queryKey: ["get-trams", atcoCode, serviceIds, towards, refreshIntervalMs],
    queryFn: () => testData ?? fetchTrams(atcoCode, serviceIds, towards),
    enabled: Boolean(atcoCode),
    refetchInterval: refreshIntervalMs,
  });
};
