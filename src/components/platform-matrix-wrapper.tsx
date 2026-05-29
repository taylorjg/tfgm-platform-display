import { useEffect, useRef, type Ref } from "react";
import { useIsFetching } from "@tanstack/react-query";

import type { RowDescriptors } from "@app/helpers";
import { initialiseGame, type GameActions } from "@app/phaser";

export type PlatformMatrixWrapperProps = {
  rowDescriptors: RowDescriptors;
};

const makeRowsState = (rowDescriptors: RowDescriptors): string => {
  return JSON.stringify(rowDescriptors);
};

export const PlatformMatrixWrapper = ({
  rowDescriptors,
}: PlatformMatrixWrapperProps) => {
  const isFetching = useIsFetching() > 0;
  const parentRef = useRef<HTMLElement | null>(null);
  const gameActionsRef = useRef<GameActions | null>(null);
  const prevRowsStateRef = useRef<string>("");

  useEffect(() => {
    if (!parentRef.current) return;

    gameActionsRef.current = initialiseGame(parentRef.current);

    return gameActionsRef.current.destroy;
  }, []);

  useEffect(() => {
    const prevRowsState = prevRowsStateRef.current;
    const nextRowsState = makeRowsState(rowDescriptors);

    if (nextRowsState === prevRowsState) return;

    gameActionsRef.current?.changeRowDescriptors(rowDescriptors);
    prevRowsStateRef.current = nextRowsState;
  }, [rowDescriptors]);

  useEffect(() => {
    gameActionsRef.current?.setFetching(isFetching);
  }, [isFetching]);

  return (
    <div
      ref={parentRef as Ref<HTMLDivElement>}
      style={{ width: "100%", aspectRatio: "201/58" }}
    />
  );
};
