export default class ImageCtx{

    constructor(areaElementId, imgId, height, width){
        this.imgElement = document.getElementById(imgId);
        this.initConvas(this.imgElement.width, this.imgElement.height);
        this.areaElement = document.getElementById(areaElementId);

        this.ctx = this.convas.getContext("2d");
        this.ctx.drawImage(this.imgElement, 0, 0);
        this.imageData = this.ctx.getImageData(0, 0, this.convas.width, this.convas.height);
    }

    initConvas(width, height){
        this.convas = document.createElement('canvas');
        this.convas.width = width;
        this.convas.height = height;
    }

    putImage(imageCtxData = null){
        if(!imageCtxData){
            this.ctx.putImageData(this.imageData, 0, 0);
        }
        else{
            this.ctx.putImageData(imageCtxData, 0, 0);
        }
        this.areaElement.appendChild(this.convas);
    }
}