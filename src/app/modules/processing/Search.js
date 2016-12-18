import Median from '../filter/methods/Median';
import Sobel from '../filter/methods/Sobel';
import Invers from '../filter/methods/Inversion';
import Otsu from '../filter/methods/Otsu';
import Morphy from './Morphology';
import FilterInterface from '../filter/interface/FilterInterface';
import _foreach from 'lodash/forEach';
import _find from 'lodash/find';

export default class Search extends FilterInterface {

    constructor(imgData) {
        super(imgData);
        this.sourceImageData = imgData;
        this.colorMatrix = imgData;
    }

    sourceData = [];
    workData = [];
    imgDataArray = [];
    category = {
        BIG_CLASS: 'BIG_CLASS',
        SMALL_CLASS: 'SMALL_CLASS',
    };
    categoryClass = {
        category1: {
            color: {
                red: 255,
                green: 40,
                blue: 0,
            },
            elements: [],
        },
        category2: {
            color: {
                red: 70,
                green: 100,
                blue: 140,
            },
            elements: [],
        },
    };
    maxAmountPixel = 0;
    selectMatrix = {};
    square = [];
    isRemovedSquares = [];
    rule = {};

    run() {
        var result = new Median(this.imageData, 5).filter().toImageData();
        result = new Sobel(result).filter().toImageData();
        result = new Invers(result).filter().toImageData();
        result = new Otsu(result).filter().toImageData();
        //result = new Morphy(result).increase().exportImageData();
        this.imageData = result;

        this.sourceImageData = result;

        return this;
    }

    select() {
        var matrix = [];
        var pixelAt = this.bindPixel(this.imageData.data);
        var x, y, _category;
        for (y = 0; y < this.imageData.height; y++) {
            this.imgDataArray[y] = [];
            this.workData[y] = [];
            for (x = 0; x < this.imageData.width; x++) {
                var r = pixelAt(x, y, 0);
                var g = pixelAt(x, y, 1);
                var b = pixelAt(x, y, 2);
                var avg = (r + g + b) / 3;
                if (avg == 0) {
                    this.imgDataArray[y][x] = 1;
                    this.workData[y][x] = 1;
                } else {
                    this.imgDataArray[y][x] = 0;
                    this.workData[y][x] = 0;
                }
            }
        }
        this.lol();
        //this.view();
        this.selected();

        this.mergeClasses();

        pixelAt = this.bindPixel(this.sourceImageData.data);
        for (y = 0; y < this.sourceImageData.height; y++) {
            for (x = 0; x < this.sourceImageData.width; x++) {
                r = pixelAt(x, y, 0);
                g = pixelAt(x, y, 1);
                b = pixelAt(x, y, 2);
                _category = this.findInSquare(y, x);
                if (_category == this.category.BIG_CLASS) {
                    this.sourceData.push(255, 40, 0, 255);
                } else if (_category == this.category.SMALL_CLASS) {
                    this.sourceData.push(70, 100, 140, 255);
                } else {
                    this.sourceData.push(r, g, b, 255);
                }
            }
        }
        var clampedArray = this.sourceData;
        if (typeof Uint8ClampedArray === 'function') {
            clampedArray = new Uint8ClampedArray(this.sourceData);
        }

        this.geomRule();

        return new ImageData(clampedArray, this.sourceImageData.width, this.sourceImageData.height);
    }

    colorRule(obj, index, firstContourX, secondContourX) {

        var pixelAt = this.bindPixel(this.colorMatrix.data);

        var height = (obj.maxY - obj.minY);
        var centerY = obj.maxY - Math.round(height / 2);

        var width = (obj.maxX - obj.minX - secondContourX - firstContourX);
        var centerX = obj.maxX - Math.round(width / 2) - secondContourX;

        var indentX = Math.round(width / 20);
        var indentY = Math.round(height / 20);

        var R = 0, G = 0, B = 0, counter = 0;

        for (let x = centerX - indentX; x < centerX + indentX; x++) {
            for (let y = centerY - indentY; y < centerY + indentY; y++) {
                var r = pixelAt(x, y, 0);
                var g = pixelAt(x, y, 1);
                var b = pixelAt(x, y, 2);
                R += r;
                G += g;
                B += b;
                counter++;
            }
        }
        R = Math.round(R / counter);
        G = Math.round(G / counter);
        B = Math.round(B / counter);
        return {
            red: R,
            green: G,
            blue: B,
        };
    }


    geomRule() {
        this.square.forEach((objectSquare, index) => {
            var pixelAt = this.bindPixel(this.sourceImageData.data);

            var height = objectSquare.maxY - objectSquare.minY;
            var centerY = objectSquare.maxY - Math.round(height / 2);

            var firstContourX, secondContourX;

            for (let x = objectSquare.minX; x < objectSquare.maxX; x++) {
                var r = pixelAt(x, centerY, 0);
                var g = pixelAt(x, centerY, 1);
                var b = pixelAt(x, centerY, 2);
                var avg = (r + g + b) / 3;
                if (avg === 0) {
                    firstContourX = x;
                    for (let X = objectSquare.maxX; X > objectSquare.minX; X--) {
                        secondContourX = X;
                        let _height = height;
                        let _width = secondContourX - firstContourX;
                        this.rule = {
                            factor: _height - _width <= 0
                                ? Math.abs(_height / _width)
                                : Math.abs(_width / _height),
                            color: this.colorRule(
                                objectSquare,
                                index,
                                firstContourX - objectSquare.minX,
                                objectSquare.maxX - secondContourX
                            )
                        };
                        return;
                    }
                }
            }
        });
    }

    findInSquare(y, x) {
        var flag = false;
        this.square.forEach((value, key)=> {
            if ((x == value.minX && y >= value.minY && y <= value.maxY)
                || (x == value.maxX && y >= value.minY && y <= value.maxY)
                || (y == value.minY && x >= value.minX && x <= value.maxX)
                || (y == value.maxY && x >= value.minX && x <= value.maxX)) {
                flag = value.category;
            }
        });
        return flag;
    }

    view() {
        var x, y, str;
        for (y = 0; y < this.imgDataArray.length; y++) {
            str = '';
            for (x = 0; x < this.imgDataArray[y].length; x++) {
                str += this.imgDataArray[y][x] + ' ';
            }
            console.dir(str);
        }
    }

    lol() {
        var x, y, flag = 1;
        for (y = 0; y < this.imgDataArray.length; y++) {
            for (x = 0; x < this.imgDataArray[y].length; x++) {
                if (this.imgDataArray[y][x] == 1) {
                    this.selectMatrix[++flag] = [];
                    this.finding(y, x, flag);
                }
            }
        }
    }

    markLine(y, x, flag) {
        for (var i = y; this.imgDataArray[i][x] == 1; i++) {
            this.imgDataArray[i][x] = flag;
        }
        try {
            for (i = y - 1; this.imgDataArray[i][x] == 1; i--) {
                this.imgDataArray[i][x] = flag;
            }
        } catch (e) {
        }
    }

    finding(y, x, flag) {
        this.markLine(y, x, flag);
        var isNumberF = false;
        try {
            if (this.imgDataArray[y][x + 1] == 1) {
                isNumberF = true;
                this.finding(y, x + 1, flag);
                this.selectMatrix[flag].push({
                    x: x + 1,
                    y: y,
                });
            }
        } catch (e) {
        }
        try {
            if (this.imgDataArray[y][x - 1] == 1) {
                isNumberF = true;
                this.finding(y, x - 1, flag);
                this.selectMatrix[flag].push({
                    x: x - 1,
                    y: y,
                });
            }
        } catch (e) {
        }
        if (true == true) {

            for (var i = y + 1; this.imgDataArray[i][x] == flag; i++) {
                try {
                    if (this.imgDataArray[i][x + 1] != 0 && this.imgDataArray[i][x + 1] != flag) {
                        this.finding(i, x + 1, flag);
                        this.selectMatrix[flag].push({
                            x: x + 1,
                            y: i,
                        });
                    }
                } catch (e) {
                }
                try {
                    if (this.imgDataArray[i][x - 1] != 0 && this.imgDataArray[i][x - 1] != flag) {
                        this.finding(i, x - 1, flag);
                        this.selectMatrix[flag].push({
                            x: x - 1,
                            y: i,
                        });
                    }
                } catch (e) {
                }
            }
            try {
                for (i = y - 1; this.imgDataArray[i][x] == flag; i--) {
                    try {
                        if (this.imgDataArray[i][x + 1] != 0 && this.imgDataArray[i][x + 1] != flag) {
                            this.finding(i, x + 1, flag);
                            this.selectMatrix[flag].push({
                                x: x + 1,
                                y: i,
                            });
                        }
                    } catch (e) {
                    }
                    try {
                        if (this.imgDataArray[i][x - 1] != 0 && this.imgDataArray[i][x - 1] != flag) {
                            this.finding(i, x - 1, flag);
                            this.selectMatrix[flag].push({
                                x: x - 1,
                                y: i,
                            });
                        }
                    } catch (e) {
                    }
                }
            } catch (e) {
            }
        }
    }

    selected() {
        this.maxAmountPixel = 0;
        _foreach(this.selectMatrix, (value, key)=> {
            if (value.length > this.maxAmountPixel) {
                this.maxAmountPixel = value.length;
            }
        });
        this.maxAmountPixel = this.maxAmountPixel != 0 ? Math.round(this.maxAmountPixel / 2) : 0;
        _foreach(this.selectMatrix, (value, key)=> {
            var minX = 10000000000, maxX = 0, minY = 10000000000, maxY = 0, category = this.category.SMALL_CLASS;
            _foreach(value, (v, k)=> {
                if (v.x < minX) {
                    minX = v.x;
                }
                if (v.y < minY) {
                    minY = v.y;
                }
                if (v.x > maxX) {
                    maxX = v.x
                }
                if (v.y > maxY) {
                    maxY = v.y;
                }
            });
            if (value.length > this.maxAmountPixel) {
                category = this.category.BIG_CLASS;
            }
            this.square[key] = {
                minX,
                maxX,
                minY,
                maxY,
                category: category,
            }
        });
    }

    mergeClasses() {
        this.square.forEach((currentSquare, key) => {
            var width = Math.round((currentSquare.maxX - currentSquare.minX) / 20);
            var height = Math.round((currentSquare.maxY - currentSquare.minY) / 20);
            this.square.forEach((nextSquare, index) => {
                if ((index !== key) && ((nextSquare.minX >= (currentSquare.minX - width) && nextSquare.minX <= (currentSquare.maxX + width))
                    || (nextSquare.maxX >= (currentSquare.minX - width) && nextSquare.maxX <= (currentSquare.maxX + width)))
                    && ((nextSquare.minY >= (currentSquare.minY - height) && nextSquare.minY <= (currentSquare.maxY + height))
                    || (nextSquare.maxY >= (currentSquare.minY - height) && nextSquare.maxY <= (currentSquare.maxY + height)))
                    ) {
                    if (currentSquare.minX >= nextSquare.minX) {
                        this.square[key].minX = nextSquare.minX;
                    }
                    if (currentSquare.maxX <= nextSquare.maxX) {
                        this.square[key].maxX = nextSquare.maxX;
                    }
                    if (currentSquare.minY >= nextSquare.minY) {
                        this.square[key].minY = nextSquare.minY;
                    }
                    if (currentSquare.maxY <= nextSquare.maxY) {
                        this.square[key].maxY = nextSquare.maxY;
                    }
                    if (this.isRemovedSquares.indexOf(index) === -1 && this.isRemovedSquares.indexOf(key) == -1) {
                        this.isRemovedSquares.push(index);
                    }
                }
            });
        });
        this.square = this.square.filter((item, key) => {
            for(let i = 0; i < this.isRemovedSquares.length; i++){
                if(this.isRemovedSquares[i] == key){
                    return false;
                }
            }
            return true;
        });
        this.square = this.square.filter((item) => {
            return item.category === this.category.BIG_CLASS;
        });
    }

    exportImageData() {
        var x, y, exportData = [];
        for (y = 0; y < this.sourceData.length; y++) {
            for (x = 0; x < this.sourceData[y].length; x++) {
                if (this.sourceData[y][x]) {
                    exportData.push(0, 0, 0, 255);
                } else {
                    exportData.push(255, 255, 255, 255);
                }
            }
        }

        if (typeof Uint8ClampedArray === 'function') {
            exportData = new Uint8ClampedArray(exportData);
        }
        return new ImageData(exportData, this.sourceImageData.width, this.sourceImageData.height);
    }
}