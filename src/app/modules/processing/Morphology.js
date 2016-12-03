import _clone from 'lodash/cloneDeep';
import FilterInterface from '../filter/interface/FilterInterface';
export default class Morphology extends FilterInterface{

    /* imageData = Binary ImageData */
    constructor(imgData) {
        super(imgData);
        this.convertImgDataToArray();
        return this;
    }

    maskData = [];
    workData = [];
    imgDataArray = [];
    structure = {
        indexI: 1,
        indexJ: 0,
        data: [
            [1,],
            [1,],
            [1,],
        ]
    };
    _structure = {
        indexI: 1,
        indexJ: 0,
        data: [
            [1,],
            [1,],
            [1,],
        ]
    };

    convertImgDataToArray(){
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
                } else {
                    this.imgDataArray[y][x] = 0;
                }
                this.workData[y][x] = 0;
            }
        }
    }

    checkErosion(x, y){

        var i1, j1, iCorrection, jCorrection;
        var maxX = this.imageData.width, maxY = this.imageData.height;
        for(j1 = 0; j1 < this._structure.data.length; j1++){
            for(i1 = 0; i1 < this._structure.data[j1].length; i1++){
                jCorrection =  y + j1 - this._structure.indexJ;
                iCorrection = x + i1 - this._structure.indexI;
                if(iCorrection >= 0 && jCorrection >= 0 && jCorrection < maxY && iCorrection < maxX){
                    if(this.imgDataArray[jCorrection][iCorrection] != this.structure.data[j1][i1]){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    erosion(){
        var x, y;
        for(y = 0; y < this.imgDataArray.length; y++){
            for(x = 0; x < this.imgDataArray[y].length; x++){
                if(this.imgDataArray[y][x] && this.checkErosion(x, y)){
                    this.workData[y][x] = 1;
                } else {
                    this.workData[y][x] = 0;
                }
            }
        }
        this.imgDataArray = _clone(this.workData);
        return this;
    }

    checkIncrease(x, y){
        var i1, j1, iCorrection, jCorrection;
        var maxX = this.imageData.width, maxY = this.imageData.height;
        for(j1 = 0; j1 < this.structure.data.length; j1++){
            for(i1 = 0; i1 < this.structure.data[j1].length; i1++){
                jCorrection =  y + j1 - this.structure.indexJ;
                iCorrection = x + i1 - this.structure.indexI;
                if(iCorrection >= 0 && jCorrection >= 0 && jCorrection < maxY && iCorrection < maxX){
                    this.workData[jCorrection][iCorrection] = 1;
                }
            }
        }
        return true;
    }

    increase(){
        var x, y;
        for(y = 0; y < this.imgDataArray.length; y++){
            for(x = 0; x < this.imgDataArray[y].length; x++){
                if(this.imgDataArray[y][x]){
                    this.checkIncrease(x, y);
                }
            }
        }
        this.imgDataArray = _clone(this.workData);
        return this;
    }

    exportImageData(){
        var x, y, exportData = [];
        for(y = 0; y < this.workData.length; y++){
            for(x = 0; x < this.workData[y].length; x++){
                if(this.workData[y][x]){
                    exportData.push(0, 0, 0, 255);
                } else {
                    exportData.push(255, 255, 255, 255);
                }
            }
        }

        if (typeof Uint8ClampedArray === 'function') {
            exportData = new Uint8ClampedArray(exportData);
        }

        return new ImageData(exportData, this.imageData.width, this.imageData.height);
    }




    /*execute() {
        var x, y;
        for (y = 0; y < this.imageData.height; y++) {
            for (x = 0; x < this.imageData.width; x++) {
                this.workData[x] = [];
                this.workData[x][y] = 0;
                this.maskData[x] = [];
                this.maskData[x][y] = -1;
            }
        }
        var flag = 1;
        var pixelAt = this.bindPixel(this.imgData.data);
        for (y = 0; y < this.imageData.height; y++) {
            for (x = 0; x < this.imageData.width; x++) {
                var r = pixelAt(x, y, 0);
                var g = pixelAt(x, y, 1);
                var b = pixelAt(x, y, 2);
                var avg = (r + g + b)/3;
                if(avg == 0 && this.workData[x][y] == 0){
                    this.workData[x][y] = flag;
                    if(this.setFlag(x, y, flag)){
                        flag++;
                    }
                }
            }
        }
    }

    setFlag(i, j, flag){
        var x, y;
        for (y = 0; y < this.imageData.height; y++) {
            for (x = 0; x < this.imageData.width; x++) {
                var r = pixelAt(x, y, 0);
                var g = pixelAt(x, y, 1);
                var b = pixelAt(x, y, 2);
                var avg = (r + g + b)/3;
                if(avg == 0 && this.workData[x][y] == 0){
                    this.workData[x][y] = flag;
                    if(this.setFlag(x, y, flag)){
                        flag++;
                    }
                }
            }
        }
    }*/
}