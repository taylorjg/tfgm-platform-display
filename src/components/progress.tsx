import { LinearProgress } from "@mui/material";
import { useIsFetching } from "@tanstack/react-query";

export const Progress = () => {
  const isFetchingCount = useIsFetching();
  return (
    <LinearProgress
      style={{ visibility: isFetchingCount > 0 ? "visible" : "hidden" }}
    />
  );
};
