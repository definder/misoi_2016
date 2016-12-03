import FilterInterface from '../interface/FilterInterface';
import _deep from 'lodash/cloneDeep';
import {generateMatrix} from '../utils/Util';
import GrayImage from './GrayImage';
import Gauss from './Gauss';
import Sobel from './Sobel';

export default class Canny extends FilterInterface {

    matrix = [];
    cannyData = [];

    constructor(imageData, ratio) {
        super(imageData);
        this.ratio = ratio;
        return this;
    }

    filter() {
        var result = new GrayImage(this.imageData).filter().toImageData();
        result = new Gauss(result).filter().toImageData();
        result = new Sobel(result).filter().toImageData();
        this.matrix = this.nonMaximumSuppression(result);
        result = this.toImageData();
        this.matrix = this.hysteresis(result);
        return this;
    }

    toImageData() {
        this.cannyData = [];
        var x, y, i;
        for (y = 0; y < this.imageData.height; y++) {
            for (x = 0; x < this.imageData.width; x++) {
                for (i = 0; i < 3; i++) {
                    this.cannyData.push(this.matrix[y][x]);
                }
                this.cannyData.push(255);
            }
        }
        return this.createImageData(this.cannyData, this.imageData.width, this.imageData.height);
    }

    nonMaximumSuppression(imageData) {
        var data = this.generateGrayMatrix(imageData);
        var x, y, _neighbors, neighbors;
        for (y = 0; y < imageData.height; y++) {
            for (x = 0; x < imageData.width; x++) {
                neighbors = [];
                for (var yNeighbors = y - 1; yNeighbors < y + 2; yNeighbors++) {
                    _neighbors = [];
                    for (var xNeighbors = x - 1; xNeighbors < x + 2; xNeighbors++) {
                        if (
                            yNeighbors >= imageData.height
                            || yNeighbors < 0
                            || xNeighbors >= imageData.width
                            || xNeighbors < 0
                        ) {
                            _neighbors.push(0);
                        } else {
                            _neighbors.push(data[yNeighbors][xNeighbors]);
                        }

                    }
                    neighbors.push(_neighbors);
                }
                if (neighbors[1][1] > neighbors[0][1] && neighbors[1][1] > neighbors[2][1]) {
                    data[y][x] = neighbors[1][1];
                } else {
                    data[y][x] = 0;
                }
                if (neighbors[1][1] > neighbors[0][2] && neighbors[1][1] > neighbors[2][0]) {
                    data[y][x] = neighbors[1][1];
                } else {
                    data[y][x] = 0;
                }
                if (neighbors[1][1] > neighbors[1][0] && neighbors[1][1] > neighbors[1][2]) {
                    data[y][x] = neighbors[1][1];
                } else {
                    data[y][x] = 0;
                }
                if (neighbors[1][1] > neighbors[0][0] && neighbors[1][1] > neighbors[2][2]) {
                    data[y][x] = neighbors[1][1];
                } else {
                    data[y][x] = 0;
                }
            }
        }
        return data;
    }

    hysteresis(imgData, ht = 100, lt = 50) {
        var copy, data, isCandidate, isStrong, isWeak, traverseEdge;
        copy = this.generateGrayMatrix(imgData);

        isStrong = function (edge) {
            return edge > ht;
        };

        isCandidate = function (edge) {
            return edge <= ht && edge >= lt;
        };

        isWeak = function (edge) {
            return edge < lt;
        };

        for (var y = 0; y < imgData.height; y++) {
            for (var x = 0; x < imgData.width; x++) {
                if (isStrong(copy[y][x])) {
                    copy[y][x] = 255;
                } else if (isWeak(copy[y][x]) || isCandidate(copy[y][x])) {
                    copy[y][x] = 0;
                }
            }
        }

        traverseEdge = function (y, x) {
            var i, j, _i, _results;
            var neighbors = [], _neighbors = [];
            if (x === 0 || y === 0 || x === imgData.width - 1 || y === imgData.height - 1) {
                return;
            }
            if (isStrong(copy[y][x])) {
                for (var yNeighbors = y - 1; yNeighbors < y + 2; yNeighbors++) {
                    _neighbors = [];
                    for (var xNeighbors = x - 1; xNeighbors < x + 2; xNeighbors++) {
                        _neighbors.push(copy[yNeighbors][xNeighbors]);
                    }
                    neighbors.push(_neighbors);
                }
                _results = [];
                for (i = _i = 0; _i <= 2; i = ++_i) {
                    _results.push((function () {
                        var _j, _results1;
                        _results1 = [];
                        for (j = _j = 0; _j <= 2; j = ++_j) {
                            if (isCandidate(neighbors[i][j])) {
                                copy[x - 1 + i][y - 1 + j] = 255;
                                _results1.push(traverseEdge(x - 1 + i, y - 1 + j));
                            } else {
                                _results1.push(void 0);
                            }
                        }
                        return _results1;
                    })());
                }
                return _results;
            }
        };

        for (var y = 0; y < imgData.height; y++) {
            for (var x = 0; x < imgData.width; x++) {
                traverseEdge(y, x);
            }
        }

        for (var y = 0; y < imgData.height; y++) {
            for (var x = 0; x < imgData.width; x++) {
                if (!isStrong(copy[y][x])) {
                    copy[y][x] = 0;
                }
            }
        }
        return copy;
    }
}