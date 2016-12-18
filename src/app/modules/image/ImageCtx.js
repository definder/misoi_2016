export default class ImageCtx{


    constructor(areaElementId){
        this.areaElement = document.getElementById(areaElementId);
    }

    initFromIMG(imgId){
        var imgElement = document.getElementById(imgId);
        this.initCanvas(imgElement.naturalWidth, imgElement.naturalHeight);
        this.ctx.drawImage(imgElement, 0, 0);
        this.imageData = this.ctx.getImageData(0, 0, imgElement.naturalWidth, imgElement.naturalHeight);
        return this;
    }

    initFromUrl(url, cb){
        let newImg = document.createElement('img');
        newImg.src = url;
        newImg.onload = ()=>{
            this.initCanvas(newImg.naturalWidth, newImg.naturalHeight);
            this.ctx.drawImage(newImg, 0, 0);
            this.imageData = this.ctx.getImageData(0, 0, newImg.naturalWidth, newImg.naturalHeight);
            cb(this);
        }
    }

    initFromCanvasData(imageData){
        this.initCanvas(imageData.width, imageData.height);
        this.ctx.putImageData(imageData, 0, 0);
        this.imageData = this.ctx.getImageData(0, 0, imageData.width, imageData.height);
        return this;
    }

    initCanvas(width, height){
        this.convas = document.createElement('canvas');
        this.convas.width = width;
        this.convas.height = height;
        this.ctx = this.convas.getContext("2d");
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