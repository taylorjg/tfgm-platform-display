/**
 * @mui/icons-material exports .mjs entry points without `types` conditions.
 * TS 6 + moduleResolution "bundler" may not resolve declarations on all machines.
 */
declare module "@mui/icons-material" {
  import type { SvgIconProps } from "@mui/material/SvgIcon";
  import type { FC } from "react";

  type MuiIcon = FC<SvgIconProps>;

  export const Fullscreen: MuiIcon;
  export const FullscreenExit: MuiIcon;
  export const Settings: MuiIcon;
}

declare module "@mui/icons-material/*" {
  import type { SvgIconProps } from "@mui/material/SvgIcon";
  import type { FC } from "react";

  const Icon: FC<SvgIconProps>;
  export default Icon;
}
