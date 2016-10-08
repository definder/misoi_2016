import FilterInterface from '../interface/FilterInterface';

export default class Pryuita extends FilterInterface {

    constructor(imageData) {
        super(imageData);
        this.pryuitaData = [];
    }

    initMatrix() {
        this.matrix = {
            gx: [
                [-1, 0, 1],
                [-1, 0, 1],
                [-1, 0, 1],
            ],
            gy: [
                [-1, -1, -1],
                [0, 0, 0],
                [1, 1, 1],
            ]
        };
    }

    filter() {
        var {imageData, matrix} = this;
        var x, y;
        var pixelAt = this.bindPixel(this.imageData.data);
        for (y = 0; y < imageData.height; y++) {
            for (x = 0; x < imageData.width; x++) {
                var pixelX = (
                    (matrix.gx[0][0] * pixelAt(x - 1, y - 1)) +
                    (matrix.gx[0][1] * pixelAt(x, y - 1)) +
                    (matrix.gx[0][2] * pixelAt(x + 1, y - 1)) +
                    (matrix.gx[1][0] * pixelAt(x - 1, y)) +
                    (matrix.gx[1][1] * pixelAt(x, y)) +
                    (matrix.gx[1][2] * pixelAt(x + 1, y)) +
                    (matrix.gx[2][0] * pixelAt(x - 1, y + 1)) +
                    (matrix.gx[2][1] * pixelAt(x, y + 1)) +
                    (matrix.gx[2][2] * pixelAt(x + 1, y + 1))
                );

                var pixelY = (
                    (matrix.gy[0][0] * pixelAt(x - 1, y - 1)) +
                    (matrix.gy[0][1] * pixelAt(x, y - 1)) +
                    (matrix.gy[0][2] * pixelAt(x + 1, y - 1)) +
                    (matrix.gy[1][0] * pixelAt(x - 1, y)) +
                    (matrix.gy[1][1] * pixelAt(x, y)) +
                    (matrix.gy[1][2] * pixelAt(x + 1, y)) +
                    (matrix.gy[2][0] * pixelAt(x - 1, y + 1)) +
                    (matrix.gy[2][1] * pixelAt(x, y + 1)) +
                    (matrix.gy[2][2] * pixelAt(x + 1, y + 1))
                );
                var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY));
                this.pryuitaData.push(magnitude, magnitude, magnitude, 255);
            }
        }
        var clampedArray = this.pryuitaData;

        if (typeof Uint8ClampedArray === 'function') {
            clampedArray = new Uint8ClampedArray(this.pryuitaData);
        }

        return new ImageData(clampedArray, imageData.width, imageData.height);
    }
}