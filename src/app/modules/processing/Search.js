import Median from '../filter/methods/Median';
import Sobel from '../filter/methods/Sobel';
import Invers from '../filter/methods/Inversion';
import Otsu from '../filter/methods/Otsu';
import Morphy from './Morphology';
import FilterInterface from '../filter/interface/FilterInterface';
import _foreach from 'lodash/forEach';

export default class Search extends FilterInterface{

    constructor(imgData){
        super(imgData);
        this.sourceImageData = imgData;
    }

    sourceData = [];
    workData = [];
    imgDataArray = [];
    direction = {
        LEFT_BOTTOM: 'LEFT_BOTTOM',
        RIGHT_TOP: 'RIGHT_TOP',
    };
    selectMatrix = {};
    square = { };

    run(){
        var result = new Median(this.imageData, 5).filter();
        result = new Sobel(result).filter();
        result = new Invers(result).filter();
        result = new Otsu(result).filter();
        //result = new Morphy(result).increase().exportImageData();
        this.imageData = result;
        this.sourceImageData = result;
        return this;
    }

    select(){
        var matrix = [];
        var pixelAt = this.bindPixel(this.imageData.data);
        var x, y;
        for (y = 0; y < this.imageData.height; y++) {
            this.imgDataArray[y] = [];
            this.workData[y] = [];
            for (x = 0; x < this.imageData.width; x++) {
                var r = pixelAt(x, y, 0);
                var g = pixelAt(x, y, 1);
                var b = pixelAt(x, y, 2);
                var avg = (r + g + b)/3;
                if(avg == 0){
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

        pixelAt = this.bindPixel(this.sourceImageData.data);
        for (y = 0; y < this.sourceImageData.height; y++) {
            for (x = 0; x < this.sourceImageData.width; x++) {
                r = pixelAt(x, y, 0);
                g = pixelAt(x, y, 1);
                b = pixelAt(x, y, 2);
                if(this.findInSquare(y, x)){
                    this.sourceData.push(255, 40, 0, 255);
                } else {
                    this.sourceData.push(r, g, b, 255);
                }
            }
        }
        var clampedArray = this.sourceData;
        if (typeof Uint8ClampedArray === 'function') {
            clampedArray = new Uint8ClampedArray(this.sourceData);
        }
        return new ImageData(clampedArray, this.sourceImageData.width, this.sourceImageData.height);
    }


    findInSquare(y, x){
        var flag = false;
        _foreach(this.square, (value, key)=>{
            if((x == value.minX && y >= value.minY && y <= value.maxY) || (x == value.maxX && y >= value.minY && y <= value.maxY) || (y == value.minY && x >= value.minX && x <= value.maxX) || (y == value.maxY && x >= value.minX && x <= value.maxX)){
                flag = true;
            }
        });
        return flag;
    }

    view(){
        var x, y, str;
        for(y = 0; y < this.imgDataArray.length; y++){
            str = '';
            for(x = 0; x < this.imgDataArray[y].length; x++){
                str += this.imgDataArray[y][x]+' ';
            }
            console.dir(str);
        }
    }

    lol(){
        var x, y, flag = 1;
        for(y = 0; y < this.imgDataArray.length; y++){
            for(x = 0; x < this.imgDataArray[y].length; x++){
                if(this.imgDataArray[y][x] == 1){
                    this.selectMatrix[++flag] = [];
                    this.finding(y, x, flag);
                }
            }
        }
    }

    markLine(y, x, flag){
        for(var i = y; this.imgDataArray[i][x] == 1; i++ ){
            this.imgDataArray[i][x] = flag;
        }
        for( i = y-1; this.imgDataArray[i][x] == 1; i-- ){
            this.imgDataArray[i][x] = flag;
        }
    }
    finding(y, x, flag){


        this.markLine(y, x, flag);
        var isNumberF = false;
        try {
            if(this.imgDataArray[y][x+1] == 1){
                isNumberF = true;
                this.finding(y, x+1, flag);
                this.selectMatrix[flag].push({
                    x: x+1,
                    y: y,
                });
            }
        } catch (e){ }
        try{
            if(this.imgDataArray[y][x-1] == 1){
                isNumberF = true;
                this.finding(y, x-1, flag);
                this.selectMatrix[flag].push({
                    x: x-1,
                    y: y,
                });
            }
        } catch (e){ }
        if(true == true){
            for(var i = y + 1; this.imgDataArray[i][x] == flag; i++ ){
                try {
                    if(this.imgDataArray[i][x+1] != 0 && this.imgDataArray[i][x+1] != flag){
                        this.finding(i, x+1, flag);
                        this.selectMatrix[flag].push({
                            x: x+1,
                            y: i,
                        });
                    }
                } catch (e){ }
                try{
                    if(this.imgDataArray[i][x-1] != 0 && this.imgDataArray[i][x-1] != flag){
                        this.finding(i, x-1, flag);
                        this.selectMatrix[flag].push({
                            x: x-1,
                            y: i,
                        });
                    }
                } catch (e){ }
            }
            for( i = y-1; this.imgDataArray[i][x] == flag; i-- ){
                try {
                    if(this.imgDataArray[i][x+1] != 0 && this.imgDataArray[i][x+1] != flag){
                        this.finding(i, x+1, flag);
                        this.selectMatrix[flag].push({
                            x: x+1,
                            y: i,
                        });
                    }
                } catch (e){ }
                try{
                    if(this.imgDataArray[i][x-1] != 0 && this.imgDataArray[i][x-1] != flag){
                        this.finding(i, x-1, flag);
                        this.selectMatrix[flag].push({
                            x: x-1,
                            y: i,
                        });
                    }
                } catch (e){ }
            }
        }
    }

    selected(){
        _foreach(this.selectMatrix, (value, key)=>{
            var minX = 10000000000, maxX = 0, minY = 10000000000, maxY = 0;
            _foreach(value, (v, k)=>{
                if(v.x < minX){
                    minX = v.x;
                }
                if(v.y < minY){
                    minY = v.y;
                }
                if(v.x > maxX){
                    maxX = v.x
                }
                if(v.y > maxY){
                    maxY = v.y;
                }
            });
            this.square[key] = {
                minX,
                maxX,
                minY,
                maxY,
            }
        });
    }

    exportImageData(){
        var x, y, exportData = [];
        for(y = 0; y < this.sourceData.length; y++){
            for(x = 0; x < this.sourceData[y].length; x++){
                if(this.sourceData[y][x]){
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