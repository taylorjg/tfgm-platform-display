import { IconButton } from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from "@mui/icons-material";

import { useFullscreen } from "@app/hooks";

export const FullscreenToggle = () => {
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();

  return (
    <IconButton
      type="button"
      aria-label="Toggle fullscreen"
      onClick={isFullscreen ? exitFullscreen : enterFullscreen}
      size="small"
      sx={{
        position: "fixed",
        top: "0.5rem",
        right: "0.5rem",
        color: "text.secondary",
      }}
    >
      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </IconButton>
  );
};
