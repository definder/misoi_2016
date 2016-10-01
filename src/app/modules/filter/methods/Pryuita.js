import FilterInterface from '../interface/FilterInterface';

export default class Pryuita extends FilterInterface{

    constructor(imageCtxDate){
        super(imageCtxDate);
    }

    filter(){
        var {imageData} = this;
        var pixels = imageData.data;
        for (var i = 0, il = pixels.length; i < il; i += 4) {
            var color = Math.random() * 255;
            pixels[i] = pixels[i] * color / 255;
            pixels[i + 1] = pixels[i + 1] * color / 255;
            pixels[i + 2] = pixels[i + 2] * color / 255;
        }
        return imageData;
    }

    gx = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
    ];

    gy = [
        [1, 2, 1],
        [0, 0, 0],
        [-1, -2, -1],
    ];
}