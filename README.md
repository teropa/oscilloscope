# Web Audio Oscilloscope

Visualises the waveform of any Web Audio node. Uses simple edge triggering to stabilise the waveform.

## Install

```
npm install @teropa/oscilloscope
```

ES Modules, CommonJS modules, and an UMD build are all provided.

## Usage

Create an oscilloscope and attach it to an existing `<canvas>` element, then connect it to an AudioNode and start visualising:

```js
import { Oscilloscope } from "@teropa/oscilloscope";

let oscilloscope = new Oscilloscope(myCanvasElement, audioContext, {
  fftSize: 4096,
});
oscilloscope.connect(myAudioNode);
oscilloscope.start();
```

The canvas visualisatioon will be sized according to the natural (CSS-based) size of the canvas.

The third argument to the constructor supports the following options:

- `fftSize` - number - the FFT size of the backing AnalyserNode. This affects how large the visualised time window is.
- `edgeThreshold` - number - the threshold that will [trigger](https://www.picotech.com/library/oscilloscopes/advanced-digital-triggers) the oscilloscope's rendering
- `edgeTrigger` - `rising` or `falling` - whether the edge triggering occurs when the signal rises above, or drops below, the edge threshold.
- `backgroundColor` - string - the (CSS) color to use for the visualisation background
- `lineColor` - string - the (CSS) color to use for the signal line
- `lineWidth` - number - how thick to draw the signal line
