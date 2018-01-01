# griptape

[![npm](https://img.shields.io/npm/v/griptape.svg) ![npm](https://img.shields.io/npm/dm/griptape.svg)](https://www.npmjs.com/package/griptape)

> Beautiful dynamic background patterns. Inspired by [Toptal's Subtle Patterns](https://www.toptal.com/designers/subtlepatterns/).

## Example

```javascript
import griptape from 'griptape';

const pattern = griptape
  .grid({ foreground: 'rgba(255, 0, 0, 0.5' }); // Draw a  red grid
  .noise(); // And some subtle noise below it

pattern.toDataURL(); // 'data:image/png;base64...'
pattern.toCSSURL();  // 'url("data:image/png;base64..."'
pattern.canvas;      // HTML5 canvas in browser, or an instance of node-canvas on the server.
```
```javascript
// You can also set a base config for all patterns.
const patterns = griptape({ foreground: 'rgba(255, 0, 0, 0.5)' });

// And use it the same way. All of the patterns will be colored red.
const pattern = patterns
  .stripes()
  .dots();
```

## Patterns

All patterns support the following options, unless otherwise noted:

**size**  
>**default:** *varies*  
**validation:** `[Number, Number]` *(horizontal size, vertical size)* or `Number` *(both dimensions)*  

The size of a single repeatable tile. Different patterns require different default values to make sense--for example, noise needs a lot more space to not obviously tile, whereas a grid pattern is supposed to obviously look tiled, so it can be much smaller.

**scale**  
>**default:** `1`  
**validation:** `[Number, Number]` *(horizontal scale, vertical scale)* or `Number` *(both dimensions)*  

The scale of the pattern. Can be different along either dimension for a stretched look.

**foreground**  
>**default:** `'rgba(0, 0, 0, 0.05)'`  
**validation:** a griptape pattern, a canvas, a CSS color string, or a function that returns one of those.

The fill style of the pattern.  

**background**  
>**default:** `null` *(transparent)*  
**validation:** a griptape pattern, a canvas, a CSS color string, or a function that returns one of those.  

The fill style of the background.

--------
### `checkerboard`

A checkerboard pattern. Takes no additional options.

### `grid`

Grid lines.

**shape**  
>**default:** `'square'`  
**validation:** `'square'`, `'diamond'`

The shape of the grid.

**thickness**  
>**default:** `1`  
**validation:** `Number`  

The thickness of the grid lines in pixels.

### `dots`

Circles or squares repeated in various patterns.

**dotSize**  
>**default:** `20`  
**validation:** `[Number, Number]` *(horizontal size, vertical size)* or `Number` *(both dimensions)* 

The size of the dots.

**shape**  
>**default:** `'circle'`  
**validation:** `'circle'`, `'square'`  

The shape of each individual dot.

**pattern**  
>**default:** `'diamond'`  
**validation:** `'diamond'`, `'square'`  

The pattern in which the dots are arranged.

### `houndstooth`

A classic houndstooth pattern. Takes no additional options.

### `noise`

A random noise pattern. Works by setting the color of all pixels to the passed-in `color` value, then randomizing the opacity. Note that this defaults to a larger area than other patterns to avoid looking obviously tiled. It's also computationally expensive, so it's advised to generate and save this pattern rather than using it on the fly, especially if you increase the tile size.

**density**  
>**default:** `1`  
**validation:** `Number` between `0` and `1`

The opacity threshold for pixels to be "turned off". For example, if this is set to `0.3`, any pixels randomized to have opacity greater than `0.3` will be completely transparent.

**randomizer**  
>**default:** a deterministic randomizer function seeded with the string `'griptape'`  
**validation:** `Function`

A function to determine the randomization. Should return a number between `0` and `1`.

**seed**  
>**default:** `'griptape'`  
**validation:** *none*

The seed to use for the default randomizer. Can take any value, but will always be coerced to a string. Not used if the default randomizer is overridden.

### `stripes`

A simple stripe pattern.

**orientation**  
>**default:** `'vertical'`  
**validation:** `'vertical'` or `'horizontal'`  

The orientation of the stripes.

**thickness**  
>**default:** `0.5`  
**validation:** `Number` between `0` and `1`  

The thickness of each stripe as a ratio of stripe to background. For example, `0.5` will result in equal size alternating stripes, while `0.1` very narrow stripes followed by very thick background stripes.

## License

MIT
