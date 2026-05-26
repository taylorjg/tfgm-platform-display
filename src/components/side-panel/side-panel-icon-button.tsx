import { IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export type SidePanelIconButtonProps = {
  onClick: () => void;
};

export const SidePanelIconButton = ({ onClick }: SidePanelIconButtonProps) => {
  return (
    <IconButton
      type="button"
      aria-label="Open side panel"
      onClick={onClick}
      size="small"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        color: "text.secondary",
      }}
    >
      <SettingsIcon fontSize="small" />
    </IconButton>
  );
};
