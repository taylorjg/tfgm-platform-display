import { IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export type SettingsGearProps = {
  onClick: () => void;
};

export const SettingsGear = ({ onClick }: SettingsGearProps) => {
  return (
    <IconButton
      type="button"
      aria-label="Open settings"
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
