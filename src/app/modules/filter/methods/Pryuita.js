import FilterInterface from '../interface/FilterInterface';

export default class Pryuita extends FilterInterface{

    constructor(imageCtxDate){
        super(imageCtxDate);
    }

    filter(){
        var {imageData} = this;
        var pixeles = imageData.data;
        return imageData;
    }

}