import FilterInterface from '../interface/FilterInterface';

export default class Median extends FilterInterface {

    constructor(imageData) {
        super(imageData);
        this.filterSize = 3;
        this.medianDate = [];
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

        for (var y = 0; y < imageData.height; y++) {
            for (var x = 0; x < imageData.width; x++) {
                var neighbourIndex = 0;
                for(var filterY = -filterOffset; filterY <= filterOffset; filterY++){
                    for(var filterX = -filterOffset; filterX <= filterOffset; filterX++){
                        redNeighbours[neighbourIndex] = pixelAt(x + filterX, y + filterY, 0);
                        greenNeighbours[neighbourIndex] = pixelAt(x + filterX, y + filterY, 1);
                        blueNeighbours[neighbourIndex] = pixelAt(x + filterX, y + filterY, 2);
                        neighbourIndex++;
                    }
                }
                redNeighbours.sort(this.compareNumbers);
                greenNeighbours.sort(this.compareNumbers);
                blueNeighbours.sort(this.compareNumbers);

                this.medianDate.push(redNeighbours[medianIndex], greenNeighbours[medianIndex], blueNeighbours[medianIndex], 255);

            }
        }

        var clampedArray = this.medianDate;

        if (typeof Uint8ClampedArray === 'function') {
            clampedArray = new Uint8ClampedArray(this.medianDate);
        }

        return new ImageData(clampedArray, imageData.width, imageData.height);
    }

    compareNumbers(a, b) {
        return a - b;
    }
}



