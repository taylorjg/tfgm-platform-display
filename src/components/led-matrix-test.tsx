import { useEffect, useRef } from "react";

import { initialiseGame } from "@app/phaser";

export const LedMatrixTest = ({ message }: { message: string }) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const initialValuesRef = useRef({ message });
  const gameActionsRef = useRef<{
    setMessage: (message: string) => void;
    destroy: () => void;
  }>(null);

  useEffect(() => {
    gameActionsRef.current = initialiseGame(
      parentRef.current as HTMLElement,
      initialValuesRef.current,
    );

    return gameActionsRef.current.destroy;
  }, []);

  useEffect(() => {
    gameActionsRef.current?.setMessage(message);
  }, [message]);

  return <div ref={parentRef} style={{ width: "220px", height: "30px" }} />;
};
