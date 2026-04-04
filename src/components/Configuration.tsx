import { Box } from "@mui/material";

export type ConfigurationProps = {
  hidden: boolean;
};

export const Configuration = function ({ hidden }: ConfigurationProps) {
  return (
    <Box
      role="tabpanel"
      hidden={hidden}
      id="side-panel-tabpanel-0"
      aria-labelledby="side-panel-tab-0"
    />
  );
};
