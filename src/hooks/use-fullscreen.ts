import { useEffect, useState } from "react";

// If the user enters/exits fullscreen mode via the browser UI (e.g. F11 key)
// it can make it difficult to keep track of whether we are in fullscreen mode
// or not. Using a media query seems more reliable than checking
// document.fullscreenElement.
const checkDisplayModeFullscreen = () => {
  return (
    window.matchMedia("(display-mode: fullscreen)").matches ||
    document.fullscreenElement != null
  );
};

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(checkDisplayModeFullscreen);

  useEffect(() => {
    const onResize = () => {
      console.log("[useFullscreen] onResize");
      setIsFullscreen(checkDisplayModeFullscreen());
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen();
  };

  const exitFullscreen = () => {
    // Avoid the following error which seems to occur if the user entered fullscreen mode via the browser UI:
    // "Uncaught (in promise) TypeError: Failed to execute 'exitFullscreen' on 'Document': Document not active"
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  return {
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
  };
};
