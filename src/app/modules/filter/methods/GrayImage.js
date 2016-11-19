import FilterInterface from '../interface/FilterInterface';

export default class GrayImage extends FilterInterface {

    grayMatrix = [];
    grayData = [];

    constructor(imageData) {
        super(imageData);
    }

    filter() {
        var pixelAt = this.bindPixel(this.imageData.data);
        var x, y;
        for (y = 0; y < this.imageData.height; y++) {
            this.grayMatrix[y] = [];
            for (x = 0; x < this.imageData.width; x++) {
                var r = pixelAt(x, y, 0);
                var g = pixelAt(x, y, 1);
                var b = pixelAt(x, y, 2);
                this.grayMatrix[y][x] = Math.round(0.298 * r + 0.586 * g + 0.114 * b);
            }
        }
        return this;
    }

    toImageData() {
        var x, y, i;
        for (y = 0; y < this.imageData.height; y++) {
            for (x = 0; x < this.imageData.width; x++) {
                for (i = 0; i < 3; i++) {
                    this.grayData.push(this.grayMatrix[y][x]);
                }
                this.grayData.push(255);
            }
        }
        return this.createImageData(this.grayData, this.imageData.width, this.imageData.height);
    }

}