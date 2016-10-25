export default class FindObject {

    constructor(imgData) {
        this.imgData = imgData;
        this.maskData = [];
        this.workData = [];
    }

    execute() {
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
    }
}