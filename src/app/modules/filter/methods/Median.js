import FilterInterface from '../interface/FilterInterface';

export default class Pryuita extends FilterInterface {

    constructor(imageData) {
        super(imageData);
        this.filterSize = 3;
    }

    filter() {
        var {imageData} = this;
        var pixelAt = this.bindPixel(imageData.data);

        var neighboursCount = this.filterSize * this.filterSize;
        var filterOffset = (this.filterSize - 1) / 2;
        var medianIndex = Math.round(neighboursCount / 2) - 1;

        var redNeighbours = new Array(neighboursCount);
        var greenNeighbours = new Array(neighboursCount);
        var blueNeighbours = new Array(neighboursCount);


        return imageData;
    }
}



