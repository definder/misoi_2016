import FilterIntrface from '../interface/FilterInterface';
import {generateMatrix} from '../utils/Util';

export default class Gauss extends FilterIntrface {

    sigma = 1.4;
    size = 3;
    kernel = [];
    gaussData = [];

    constructor(imageData, sigma = 1.4, size = 3) {
        super(imageData);
        this.sigma = sigma;
        this.size = size;
        this.generateKernel();
        return this;
    }

    filter() {
        var x, y, i, j, index, _y, _x, red, green, blue;
        const {size, kernel} = this;
        const {height, width, data} = this.imageData;
        this.gaussData = [];
        var center = Math.round(size / 2) - 1;
        center = center < 0 ? 0 : center;
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                red = 0;
                green = 0;
                blue = 0;
                for (i = 0; i < size; i++) {
                    for (j = 0; j < size; j++) {
                        _y = y + ( i <= center ? (i - center) : (size - i));
                        _x = x + ( j <= center ? (j - center) : (size - j));
                        if(_y >= 0 && _y < height && _x >= 0 && _x < width){
                            index = ((width * _y) + _x) * 4;
                            red += data[index] * kernel[i][j];
                            green += data[index+1] * kernel[i][j];
                            blue += data[index+2] * kernel[i][j];
                        }
                    }
                }
                this.gaussData.push(red, green, blue, 255);
            }
        }
        return this;
    }

    toImageData(){
        return this.createImageData(this.gaussData, this.imageData.width, this.imageData.height);
    }

    generateKernel() {
        var {sigma, size} = this;
        var e, gaussian, i, j, kernel, s, sum, x, y;
        s = sigma;
        e = 2.718;
        kernel = generateMatrix(size, size, 0);
        sum = 0;
        for (i = 0; i < size; i++) {
            x = -(size - 1) / 2 + i;
            for (j = 0; j < size; j++) {
                y = -(size - 1) / 2 + j;
                gaussian = (1 / (2 * Math.PI * s * s)) * Math.pow(e, -(x * x + y * y) / (2 * s * s));
                kernel[i][j] = gaussian;
                sum += gaussian;
            }
        }
        for (i = 0; i < size; i++) {
            for (j = 0; j < size; j++) {
                kernel[i][j] = (kernel[i][j] / sum).toFixed(3);
            }
        }
        this.kernel = kernel;
        return this;
    }

}