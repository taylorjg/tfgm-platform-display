import { useEffect, useRef, type Ref } from "react";
import { useIsFetching } from "@tanstack/react-query";

import { initialiseGame, type GameActions } from "@app/phaser";
import type { LiveTram } from "@app/hooks";
import { makeRowDescriptors } from "@app/helpers";

export type PlatformDisplayWrapperProps = {
  trams: LiveTram[];
  alert: string;
};

const makeRowsState = (trams: LiveTram[]): string => {
  return JSON.stringify(trams);
};

const getOnlyDueValuesHaveChanged = (rowState1: string, rowState2: string) => {
  const trams1 = JSON.parse(rowState1);
  const trams2 = JSON.parse(rowState2);

  const numTrams1 = trams1.length;
  const numTrams2 = trams2.length;
  if (numTrams1 + numTrams2 === 0) return false;
  if (numTrams1 !== numTrams2) return false;

  for (const tram of trams1) {
    delete tram.due;
  }

  for (const tram of trams2) {
    delete tram.due;
  }

  const rowState3 = makeRowsState(trams1);
  const rowState4 = makeRowsState(trams2);

  return rowState3 === rowState4;
};

export const PlatformDisplayWrapper = ({
  trams,
  alert,
}: PlatformDisplayWrapperProps) => {
  const isFetching = useIsFetching() > 0;
  const parentRef = useRef<HTMLElement | null>(null);
  const gameActionsRef = useRef<GameActions | null>(null);
  const prevRowsStateRef = useRef<string>("[]");

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    gameActionsRef.current = initialiseGame(parent);

    return () => {
      gameActionsRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const prevRowsState = prevRowsStateRef.current;
    const nextRowsState = makeRowsState(trams);

    if (nextRowsState === prevRowsState) return;

    const onlyDueValuesHaveChanged = getOnlyDueValuesHaveChanged(
      prevRowsState,
      nextRowsState,
    );

    const rowDescriptors = makeRowDescriptors(trams, alert);

    gameActionsRef.current?.changeRowDescriptors(
      rowDescriptors,
      onlyDueValuesHaveChanged,
    );
    prevRowsStateRef.current = nextRowsState;
  }, [trams, alert]);

  useEffect(() => {
    gameActionsRef.current?.setIsFetching(isFetching);
  }, [isFetching]);

  const rowDescriptors = makeRowDescriptors(trams, alert);

  return (
    <>
      <div
        aria-hidden="true"
        hidden
        data-row-descriptors={JSON.stringify(rowDescriptors)}
      />
      <div
        ref={parentRef as Ref<HTMLDivElement>}
        style={{ width: "100%", aspectRatio: "201/58" }}
      />
    </>
  );
};
