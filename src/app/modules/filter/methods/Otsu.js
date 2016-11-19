import FilterInterface from '../interface/FilterInterface';

export default class Otsu extends FilterInterface {

    constructor(imageData) {
        super(imageData);
        this.RED_INTENCITY_COEF = 0.2126;
        this.GREEN_INTENCITY_COEF = 0.7152;
        this.BLUE_INTENCITY_COEF = 0.0722;
        return this;
    }

    filter() {
        var {imageData} = this;
        var data = imageData.data;
        var brightness;
        var brightness256Val;
        var histArray = Array.apply(null, new Array(256)).map(Number.prototype.valueOf,0);
        for (var i=0; i< data.length; i+=4){
            brightness = this.RED_INTENCITY_COEF*data[i] + this.GREEN_INTENCITY_COEF * data[i+1]+this.BLUE_INTENCITY_COEF * data[i+2];
            brightness256Val = Math.floor(brightness);
            histArray[brightness256Val]+=1;
        }
        var total = imageData.width * imageData.height;
        var sum = 0;
        for (i= 1; i<256; i++)
            sum+= i * histArray[i];
        var sumB = 0;
        var wB = 0;
        var wF = 0;
        var mB;
        var mF;
        var max = 0.0;
        var between = 0.0;
        var threshold1 = 0.0;
        var threshold2 = 0.0;
        for (i=0; i<256;++i){
            wB += histArray[i];
            if (wB ==0)
                continue;
            wF = total - wB;
            if (wF == 0)
                break;
            sumB += i*histArray[i];
            mB = sumB / wB;
            mF = (sum - sumB) / wF;
            between = wB * wF * Math.pow(mB - mF,2);
            if (between >=max){
                threshold1 = i;
                if (between > max){
                    threshold2 = i;
                }
                max = between;
            }
        }
        var threshold = (threshold1+threshold2) / 2.0;
        data = imageData.data;
        var val;
        for (i=0; i<data.length; i+=4){
            brightness = this.RED_INTENCITY_COEF*data[i] + this.GREEN_INTENCITY_COEF * data[i+1]+this.BLUE_INTENCITY_COEF * data[i+2];
            val = ((brightness > threshold) ? 255 : 0);
            data[i] = val;
            data[i+1] = val;
            data[i+2] = val;
        }
        return this;
    }

    toImageData(){
        return this.imageData;
    }
}