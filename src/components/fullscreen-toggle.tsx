import { IconButton } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

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
        top: 0,
        right: 0,
        color: "text.secondary",
      }}
    >
      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </IconButton>
  );
};
