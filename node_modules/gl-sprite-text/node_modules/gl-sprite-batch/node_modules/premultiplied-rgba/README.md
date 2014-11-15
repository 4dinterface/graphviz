# premultiplied-rgba

[![frozen](http://badges.github.io/stability-badges/dist/frozen.svg)](http://github.com/badges/stability-badges)

Standalone function to premultiply RGB by alpha channel.

```js
var premult = require('premultiplied-rgba')

premult([1, 1, 1, 0.5]) 

//=> returns new array [0.5, 0.5, 0.5, 0.5]
```

## Usage

[![NPM](https://nodei.co/npm/premultiplied-rgba.png)](https://nodei.co/npm/premultiplied-rgba/)

#### `premultiply(rgba[, out])`

Takes a 4-component array assumed to be in the form `[R, G, B, A]` and returns a new array with the RGB channels multiplied by the alpha channel. 

The `out` param allows you to re-use an array rather than creating a new one. So you can premultiply an array in-place like so:

```premultiply(rgba, rgba)```

The `out` param will ignore numbers, so you can do array operations:

```var premultiplied = colors.map(premultiply)```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/premultiplied-rgba/blob/master/LICENSE.md) for details.
