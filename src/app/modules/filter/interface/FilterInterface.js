export default class FilterInterface{

    constructor(imageData){
        this.imageData = imageData;
        this.initMatrix();
    }

    filter(){

    }

    initMatrix(){

    }

    bindPixel(data){
        return (x, y, i)=>{
            i = i || 0;
            return data[((this.imageData.width * y) + x) * 4 + i];
        }
    }

    generateGrayMatrix(imageData){
        var pixelAt = this.bindPixel(imageData.data);
        var x, y, result = [];
        for (y = 0; y < imageData.height; y++) {
            result[y] = [];
            for (x = 0; x < imageData.width; x++) {
                var r = pixelAt(x, y, 0);
                var g = pixelAt(x, y, 1);
                var b = pixelAt(x, y, 2);
                result[y][x] = (r + g + b) / 3;
            }
        }
        return result;
    }

    setPixel(data, value, x, y, i = 0, width = this.imageData.width){
        data[((width * y) + x) * 4 + i] = value;
    }

    toImageData(){

    }

    createImageData(imageData, width, height){
        var clampedArray = imageData;

        if (typeof Uint8ClampedArray === 'function') {
            clampedArray = new Uint8ClampedArray(imageData);
        }
        return new ImageData(clampedArray, width, height);
    }
}