export interface OscilloscopeOptions {
    fftSize: 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768,
    edgeThreshold: number,
    edgeSlope: 'rising' | 'falling',
    backgroundColor: string;
    lineColor: string;
    lineWidth: number;
}

export class Oscilloscope {
    public running = false;

    private edgeThreshold: number;
    private edgeSlope: 'rising' | 'falling';
    private backgroundColor: string;
    private lineColor: string;
    private lineWidth: number;

    private split: ChannelSplitterNode;
    private analyser: AnalyserNode;
    private data: Uint8Array | null = null;

    constructor(public element: HTMLCanvasElement,
        audioCtx: AudioContext,
        {
            fftSize = 4096,
            edgeThreshold = 0,
            edgeSlope = 'rising',
            backgroundColor = 'rgb(0, 0, 0)',
            lineColor = 'gray',
            lineWidth = 5
        }: Partial<OscilloscopeOptions> = {}) {
        this.element = element;
        this.edgeThreshold = edgeThreshold;
        this.edgeSlope = edgeSlope;
        this.backgroundColor = backgroundColor;
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.split = audioCtx.createChannelSplitter(2);
        this.analyser = audioCtx.createAnalyser();
        this.analyser.fftSize = fftSize;
        this.split.connect(this.analyser, 0);
    }

    connect(audioSource: AudioNode) {
        audioSource.connect(this.split);
    }

    disconnect(audioSource: AudioNode) {
        audioSource.disconnect(this.split);
    }

    start() {
        this.running = true;
        this.data = new Uint8Array(this.analyser.frequencyBinCount);
        this.frame();
    }

    stop() {
        this.running = false;
        this.data = null;
    }

    frame = () => {
        if (!this.running) return;

        this.analyser.getByteTimeDomainData(this.data!);
        this.renderFrame();

        requestAnimationFrame(this.frame);
    }

    renderFrame() {
        let width = this.element.offsetWidth * window.devicePixelRatio;
        let height = this.element.offsetHeight * window.devicePixelRatio;
        let stepWidth = (width * 2.0) / this.data!.length;

        this.element.width = width;
        this.element.height = height;

        let ctx = this.element.getContext("2d") as CanvasRenderingContext2D;

        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.lineColor;

        ctx.beginPath();
        let start = this.findStart();
        let x = 0;
        for (let i = start; i < this.data!.length; i++) {
            let v = this.data![i] / 128;
            let y = (v * height) / 2;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += stepWidth;
        }
        ctx.stroke();
    }

    findStart() {
        for (let i = 0; i < this.data!.length - 1; i++) {
            let l = this.data![i];
            let r = this.data![i + 1];
            if (this.edgeSlope === 'rising' && l <= this.edgeThreshold && r >= this.edgeThreshold) {
                return i;
            } else if (this.edgeSlope === 'falling' && l >= this.edgeThreshold && r <= this.edgeThreshold) {
                return i;
            }
        }
        return 0;
    }
}