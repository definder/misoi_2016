
import FilterInterface from '../interface/FilterInterface';

export default class Bradley extends FilterInterface {
    constructor(imageData, ratio) {
        super(imageData);
        this.ratio = ratio;
    }
    filter() {
        var {imageData} = this;
        var sourceData = imageData.data;
        var width = imageData.width;
        var height = imageData.height;
        var integral = new Int32Array(width * height);
        var x, y, lineIndex, sum = 0;
        for (x = 0; x < width; x++) {
            sum += sourceData[x << 2];
            integral[x] = sum;
        }
        for (y = 1, lineIndex = width; y < height; y++, lineIndex += width) {
            sum = 0;
            for (x = 0; x < width; x++) {
                sum += sourceData[(lineIndex + x) << 2];
                integral[lineIndex + x] = integral[lineIndex - width + x] + sum;
            }
        }
        lineIndex = 0;
        var s = width >> 4;
        var result= new ImageData(width, height);
        var resultData = result.data;
        var resultData32 = new Uint32Array(resultData.buffer);
        for (y = 0; y < height; y++, lineIndex += width) {
            for (x = 0; x < width; x++) {
                var value = sourceData[(lineIndex + x) << 2];
                var x1 = Math.max(x - s, 0);
                var y1 = Math.max(y - s, 0);
                var x2 = Math.min(x + s, width - 1);
                var y2 = Math.min(y + s, height - 1);
                var area = (x2 - x1 + 1) * (y2 - y1 + 1);
                var localIntegral = this.getIntegralAt(integral, width, x1, y1, x2, y2);
                if (value * area > localIntegral * this.ratio) {
                    resultData32[lineIndex + x] = 0xFFFFFFFF;
                } else {
                    resultData32[lineIndex + x] = 0xFF000000;
                }
            }
        }
        return result;
    }
    getIntegralAt(integral, width, x1, y1, x2, y2) {
        var result = integral[x2 + y2 * width];
        if (y1 > 0) {
            result -= integral[x2 + (y1 - 1) * width];
            if (x1 > 0) {
                result += integral[(x1 - 1) + (y1 - 1) * width];
            }
        }
        if (x1 > 0) {
            result -= integral[(x1 - 1) + (y2) * width];
        }
        return result;
    }
}