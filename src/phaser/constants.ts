import Phaser from "phaser";

export const ON_COLOUR = 0xffff00;
export const OFF_COLOUR = 0x303030;
export const BG_COLOUR = 0x000000;

export const onColourObject = Phaser.Display.Color.ValueToColor(ON_COLOUR);
export const offColourObject = Phaser.Display.Color.ValueToColor(OFF_COLOUR);
