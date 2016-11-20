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
          try {
            console.log('x = ',x, 'y = ', y);
            this.cannyData.push(this.matrix[y][x]);
          } catch (err){
            console.log(err, y, x);
          }
        }
        this.cannyData.push(255);
      }
    }
    return this.createImageData(this.cannyData, this.imageData.width, this.imageData.height);
  }

  nonMaximumSuppression(imageData) {
    var copy = generateMatrix(imageData.width, imageData.height);
    var data = this.generateGrayMatrix(imageData);
    var x, y;
    for (y = 0; y < imageData.height; y++) {
      for (x = 0; x < imageData.width; x++) {
        if (
          y + 2 >= imageData.height
          || y - 2 < 0
          || x + 2 >= imageData.width
          || x - 2 < 0
        ){
          copy[y][x] = 0;
        } else {
          if (data[y + 1][x + 1] > data[y][x + 1] && data[y + 1][x + 1] > data[y + 2][x + 1]) {
            copy[y][x] = data[y + 1][x + 1];
          } else {
            copy[y][x] = 0;
          }
          if (data[y + 1][x + 1] > data[y][x + 2] && data[y + 1][x + 1] > data[y + 2][x]) {
            copy[y][x] = data[y + 1][x + 1];
          } else {
            copy[y][x] = 0;
          }
          if (data[y + 1][x + 1] > data[y + 1][x] && data[y + 1][x + 1] > data[y + 1][x + 2]) {
            copy[y][x] = data[y + 1][x + 1];
          } else {
            copy[y][x] = 0;
          }
          if (data[y + 1][x + 1] > data[y][x] && data[y + 1][x + 1] > data[y + 2][x + 2]) {
            copy[y][x] = data[y + 1][x + 1];
          } else {
            copy[y][x] = 0;
          }
        }
      }
    }
    return copy;
  }

  hysteresis(imgData, ht = 120, lt = 40) {
    var copy, data, isCandidate, isStrong, isWeak, traverseEdge;
    copy = generateMatrix(imgData.width, imgData.height);
    data = this.generateGrayMatrix(imgData);

    isStrong = function(edge) {
      return edge > ht;
    };

    isCandidate = function(edge) {
      return edge <= ht && edge >= lt;
    };

    isWeak = function(edge) {
      return edge < lt;
    };

    for (var y = 0; y < imgData.height; y++) {
      for (var x = 0; x < imgData.width; x++) {
        if (isStrong(data[y][x])) {
          return copy[y][x] = 255;
        } else if (isWeak(data[y][x]) || isCandidate(data[y][x])) {
          return copy[y][x] = 0;
        }
      }
    }

    traverseEdge = function(x, y) {
      var i, j, neighbors, _i, _results;
      if (x === 0 || y === 0 || x === imgData.width - 1 || y === imgData.height - 1) {
        return;
      }
      if (isStrong(copy[x][y])) {
        for (var y = -1; y < +2; y++) {
          for (var x = -1; x < +2; x++) {
            neighbors[y][x] = data[y][x];
          }
        }
        _results = [];
        for (i = _i = 0; _i <= 2; i = ++_i) {
          _results.push((function() {
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
        return traverseEdge(x, y);
      }
    }

    for (var y = 0; y < imgData.height; y++) {
      for (var x = 0; x < imgData.width; x++) {
        if (!isStrong(data[y][x])) {
          return copy[x][y] = 0;
        }
      }
    }
    return copy;
  }
}