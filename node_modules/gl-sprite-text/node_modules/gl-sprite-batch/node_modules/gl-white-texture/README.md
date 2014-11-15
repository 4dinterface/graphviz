# gl-white-texture

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Creates an opaque white 2x2 texture. This is often used as an optimization when drawing colored and filled lines/rectangles alongside textured sprites, as it allows us to use the same shader.

```js
var tex = require('gl-white-texture')(gl)

//bind and draw that sucker
tex.bind()
```

## Usage

[![NPM](https://nodei.co/npm/gl-white-texture.png)](https://nodei.co/npm/gl-white-texture/)

### `tex = createWhiteTexture(gl)`

Creates and returns a new 2x2 RGBA texture using an unsigned byte array filled with `0xFF` bytes.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/gl-white-texture/blob/master/LICENSE.md) for details.
