import FilterInterface from '../interface/FilterInterface';

export default class GammaCorrection extends FilterInterface {

    /**
     * c 0..20,0.1
     * 1 -2..3,0.05
     * @param imageData
     * @param q
     * @param c
     */
    constructor(imageData, q, c) {
        super(imageData);
        this.q = q;
        this.c = c;
        this.correctionData = [];
        return this;
    }

    brightness(r, g, b){
        var result = 0.3 * r+0.59 * g+0.11 * b;
        return result >= 0 ? result < 256 ? result : 255 : 0;
    }

    filter() {
        var {imageData} = this;
        var x, y;
        var pixelAt = this.bindPixel(this.imageData.data);
        for (y = 0; y < imageData.height; y++) {
            for (x = 0; x < imageData.width; x++) {
                var r = pixelAt(x, y, 0);
                var g = pixelAt(x, y, 1);
                var b = pixelAt(x, y, 2);
                this.correctionData.push(
                    Math.pow(r, this.q) * this.c,
                    Math.pow(g, this.q) * this.c,
                    Math.pow(b, this.q) * this.c,
                    this.brightness(r, g, b)
                );
            }
        }
        var clampedArray = this.sobelData;

        if (typeof Uint8ClampedArray === 'function') {
            clampedArray = new Uint8ClampedArray(this.correctionData);
        }

        return new ImageData(clampedArray, imageData.width, imageData.height);
    }
}