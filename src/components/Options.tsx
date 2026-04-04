import { Box } from "@mui/material";

export type OptionsProps = {
  hidden: boolean;
};

export const Options = function ({ hidden }: OptionsProps) {
  return (
    <Box
      role="tabpanel"
      hidden={hidden}
      id="side-panel-tabpanel-1"
      aria-labelledby="side-panel-tab-1"
    />
  );
};
