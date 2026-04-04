import { Typography } from "@mui/material";
import { APP_VERSION } from "@app/version.ts";

export const Version = () => {
  return (
    <Typography
      component="div"
      variant="caption"
      color="text.secondary"
      sx={{
        position: "fixed",
        right: 0,
        bottom: 0,
        p: 1,
        fontStyle: "italic",
      }}
    >
      v{APP_VERSION}
    </Typography>
  );
};
