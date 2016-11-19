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
        return this;
    }

    toImageData() {
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

    hysteresis(imgData, ht, lt) {

    }
}