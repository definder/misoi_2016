import FilterInterface from '../interface/FilterInterface';

export default class Pryuita extends FilterInterface {

    constructor(imageData) {
        super(imageData);
    }

    initMatrix() {
        this.matrix = {
            gx: [
                [-1, 0, 1],
                [-2, 0, 2],
                [-1, 0, 1],
            ],
            gy: [
                [-1, -2, -1],
                [0, 0, 0],
                [1, 2, 1],
            ]
        };
    }

    filter() {
        var {imageData} = this;
        var pixelAt = this.bindPixel(imageData.data);
        return imageData;
    }
}