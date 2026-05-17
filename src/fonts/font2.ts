import { makeFontMapKvps } from "./utils";

// https://typofoto.wordpress.com/2014/06/19/dot-matrix-fonts/

const characters = `
 xxxxxx     xx     xxxxxx   xxxxxx      xxx  xxxxxxx   xxxxxx  xxxxxxxx  xxxxxx   xxxxxx         
xx    xx   xxx    xx    xx xx    xx    xxxx  xx       xx    xx       xx xx    xx xx    xx  xx    
xx    xx    xx          xx       xx   xx xx  xx       xx            xx  xx    xx xx    xx  xx    
xx    xx    xx          xx       xx  xx  xx  xxxxxxx  xxxxxxx      xx   xx    xx xx    xx        
xx    xx    xx     xxxxxx    xxxxx  xx   xx        xx xx    xx    xx     xxxxxx   xxxxxxx        
xx    xx    xx    xx             xx xx   xx        xx xx    xx   xx     xx    xx       xx        
xx    xx    xx    xx             xx xxxxxxxx       xx xx    xx   xx     xx    xx       xx  xx    
xx    xx    xx    xx       xx    xx      xx  xx    xx xx    xx   xx     xx    xx xx    xx  xx    
 xxxxxx |  xxxx  |xxxxxxxx| xxxxxx |     xx | xxxxxx | xxxxxx |  xx    | xxxxxx | xxxxxx |   |   
`;

export const fontMap2 = new Map([
  ...makeFontMapKvps("0123456789: ", characters),
]);
