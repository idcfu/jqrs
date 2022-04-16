# jQuery Range Slider Plugin

## [Demo](https://idcfu.github.io/jqrs)

## Usage. [Files](1.0.0)

``` html
<!-- Add jQuery before. -->
<script src="jqrs.js"></script>
<link src="jqrs.css" rel="stylesheet">
```

``` html
<div id="demo"></div>
```

``` js
const jqrs = $('#demo').jqrs({
  min: 0, // Required.
  max: 100, // Required.
  step: 1, // Required.
  from: 0, // Default: 'min'.
  to: 100, // Default: 'max'.
  isDouble: false, // Default: 'false'.
  hasTip: false, // Default: 'false'.
  hasScale: false, // Default: 'false'.
  isVertical: false, // Default: 'false'.
});

jqrs.setMin(0);
jqrs.setMax(100);
jqrs.setStep(1);
jqrs.setFrom(0);
jqrs.setTo(100);
jqrs.setIsDouble(false);
jqrs.setHasTip(false);
jqrs.setHasScale(false);
jqrs.setIsVertical(false);

// Subscription. 'options' is an object with corresponding options.
const update = function (options) { ... }

jqrs.setUpdate(update);
jqrs.unsetUpdate(update);
```

## [UML](src/uml/uml.png)
