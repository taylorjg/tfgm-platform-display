import { makeFontMapKvps } from "./utils";

// https://typofoto.wordpress.com/2014/06/19/dot-matrix-fonts/

const uppercaseLetters = `
 xx  xxx   xx  xxx  xxxx xxxx  xx  x  x xxx  xxx x  x x    x   x x  x  xx  xxx   xx   xxx   xx  xxxxx x  x x   x x   x x   x x   x xxxx
x  x x  x x  x x  x x    x    x  x x  x  x     x x  x x    xx xx xx x x  x x  x x  x  x  x x  x   x   x  x x   x x   x x   x x   x    x
x  x x  x x    x  x x    x    x    x  x  x     x x x  x    x x x x xx x  x x  x x  x  x  x x      x   x  x x   x x   x  x x   x x    x 
xxxx xxx  x    x  x xxx  xxx  x xx xxxx  x     x xx   x    x x x x  x x  x xxx  x  x  xxx   xx    x   x  x x   x x x x   x     x    x  
x  x x  x x    x  x x    x    x  x x  x  x     x x x  x    x   x x  x x  x x    x xx  x x     x   x   x  x x   x x x x  x x    x   x   
x  x x  x x  x x  x x    x    x  x x  x  x  x  x x  x x    x   x x  x x  x x    x  x  x  x x  x   x   x  x  x x  xx xx x   x   x   x   
x  x xxx   xx  xxx  xxxx x     xx  x  x xxx  xx  x  x xxxx x   x x  x  xx  x     xx x x  x  xx    x    xx    x   x   x x   x   x   xxxx
                                                                                                                                       
    |    |    |    |    |    |    |    |   |    |    |    |     |    |    |    |     |    |    |     |    |     |     |     |     |    `;

const lowercaseLetters = `
     x            x        x       x    x   x x    x                                      x                                    
     x            x       x x      x          x    x                                      x                                    
 xx  xxx   xxx  xxx  xx   x    xxx xxx  x   x x  x x xx x  xxx   xx  xxx   xxx x x   xxx xxx  x  x x   x x   x x   x x  x xxxxx
   x x  x x    x  x x  x xxx  x  x x  x x   x x x  x x x x x  x x  x x  x x  x xx x x     x   x  x x   x x   x  x x  x  x    x 
 xxx x  x x    x  x xxxx  x   x  x x  x x   x xx   x x x x x  x x  x x  x x  x x     xx   x   x  x x   x x x x   x   x  x   x  
x  x x  x x    x  x x     x   x  x x  x x   x x x  x x   x x  x x  x x  x x  x x       x  x   x  x  x x  xx xx  x x  x  x  x   
 xxx xxx   xxx  xxx  xxx  x    xxx x  x x   x x  x x x   x x  x  xx  xxx   xxx x    xxx    xx  xx    x   x   x x   x  xxx xxxxx
                                 x          x                        x       x                                          x      
    |    |    |    |    |    |xxx |    | |xx |    | |     |    |    |x   |   x|    |    |    |    |     |     |     |xxx |     `;

const numbers = `
 xxx     x   xxx   xxx     x  xxxxx  xxx  xxxxx  xxx   xxx 
x   x   xx  x   x x   x   xx  x     x   x     x x   x x   x
x   x    x      x     x  x x  xxxx  x        x  x   x x   x
x   x    x     x    xx  x  x      x xxxx    x    xxx   xxxx
x   x    x    x       x xxxxx     x x   x   x   x   x     x
x   x    x   x    x   x    x  x   x x   x   x   x   x x   x
 xxx    xxx xxxxx  xxx     x   xxx   xxx    x    xxx   xxx 
                                                           
     |     |     |     |     |     |     |     |     |     `;

const symbols = `
          
          
          
         x
     xxx  
         x
          
          
    |   | 
`;

export const fontMap1 = new Map([
  ...makeFontMapKvps("ABCDEFGHIJKLMNOPQRSTUVWXYZ", uppercaseLetters),
  ...makeFontMapKvps("abcdefghijklmnopqrstuvwxyz", lowercaseLetters),
  ...makeFontMapKvps("0123456789", numbers),
  ...makeFontMapKvps(" -:", symbols),
]);
