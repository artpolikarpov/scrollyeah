Scrollyeah :+1:
=============

Puts floats in single line.


## Getting Started

To make Scrollyeah work on a page:

1. Link to the newest jQuery, scrollyeah.css & scrollyeah.js.
1. Add elements to `<div class="scrollyeah"></div>`.

Basic example:

```html
<script src="jquery.js"></script>
<link  href="scrollyeah.css" rel="stylesheet" />
<script src="scrollyeah.js"></script>

<div class="scrollyeah">
  <div class="float">1</div>
  <div class="with-any-class">2</div>
  <div class="yeah">3</div>
  <!-- ... -->
</div>
```

## Options

Options are passed through the `data-optionName` attributes:

```html
<div class="scrollyeah" data-shadows="false" data-disableIfFit="true">
  <!-- ... -->
</div>
```

#### `shadows`

Enables shadows.

#### `maxWidth`

Inner content max-width in pixels. Increase if your content wider than 999999px.

#### `disableIfFit`

Disables dragging if no overflow.

#### `centerIfFit`

Centers content if width enough.

#### `triggerScrollyeah`

Triggers `scrollyeah` event on element.

Default options:

```javascript
{
  maxWidth: 999999,
  shadows: true,
  disableIfFit: true,
  centerIfFit: false,
  triggerScrollyeah: false
}
```

## Examples

1. [Default](http://artpolikarpov.github.io/scrollyeah/examples/default.html)
1. [Disable if fit](http://artpolikarpov.github.io/scrollyeah/examples/disable-if-fit.html)
1. [Center if fit](http://artpolikarpov.github.io/scrollyeah/examples/center-if-fit.html)
1. [Parallax](http://artpolikarpov.github.io/scrollyeah/examples/parallax.html)

jQuery (1.9+) is required.


## License
Copyright © 2013 Artem Polikarpov
Licensed under the MIT License.
