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

}