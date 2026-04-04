import { Stack, Typography } from "@mui/material";
import WavingHandIcon from "@mui/icons-material/WavingHand";

export const Hello = () => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <WavingHandIcon color="primary" fontSize="small" aria-hidden />
      <Typography component="span">hello</Typography>
    </Stack>
  );
};
