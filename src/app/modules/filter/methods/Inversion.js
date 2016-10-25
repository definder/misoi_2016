import FilterInterface from '../interface/FilterInterface';

export default class Inversion extends FilterInterface {

    constructor(imageData) {
        super(imageData);
        this.inversionData = [];
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

                this.inversionData.push(255 - r, 255 - g, 255 - b, 255);
            }
        }
        var clampedArray = this.inversionData;

        if (typeof Uint8ClampedArray === 'function') {
            clampedArray = new Uint8ClampedArray(this.inversionData);
        }

        return new ImageData(clampedArray, imageData.width, imageData.height);
    }
}