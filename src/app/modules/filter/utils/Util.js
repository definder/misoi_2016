export function generateMatrix(width, height, initValue){

    var matrix = [], x, y, i, j, ref, ref1;
    for(y = 0; y < height; y++){
        matrix[y] = [];
        for(x = 0; x < width; x++){
            matrix[y][x] = 0;
        }
    }
    return matrix;

}

export function generateImageData(width, height, initValue = 0){
    var data = [];
    for(var y = 0; y < height; y++){
        for(var x = 0; x < width; x++){
            data.push(initValue, initValue, initValue, 255);
        }
    }
    return data;
}