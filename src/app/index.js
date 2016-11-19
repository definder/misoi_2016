import _clone from 'lodash/cloneDeep';
import ImageCtx from './modules/image/ImageCtx';
import Pryuita from './modules/filter/methods/Pryuita';
import Sobel from './modules/filter/methods/Sobel';
import Median from './modules/filter/methods/Median';
import GammaCorrection from './modules/filter/methods/GammaCorrection';
import Otsu from './modules/filter/methods/Otsu';
import Bradley from './modules/filter/methods/Bradley';
import Inversion from './modules/filter/methods/Inversion';
import Morphology from './modules/processing/Morphology';
import Search from './modules/processing/Search';
import Gray from './modules/filter/methods/GrayImage';
import Gauss from './modules/filter/methods/Gauss';
import Canny from './modules/filter/methods/Canny';
import Front from './front/index';

document.addEventListener("DOMContentLoaded", event => {
    Front();
    var currentImg = null;
    var mainImg = null;
    var prevImg = null;
    var imgCtx = null;
    var el = document.getElementById('btn');
    el.addEventListener('click',()=>{
        if(document.getElementById('selectImg').value == 'main'){
            imgCtx = new ImageCtx('convas');
            currentImg = imgCtx.initFromIMG('target').imageData;
        } else {
            imgCtx = new ImageCtx('convas');
            currentImg = imgCtx.initFromCanvasData(prevImg).imageData;
        }
        var filteringImage;
        switch (document.getElementById('mainselection').value){
            case 'null':
                alert('Select your method');
                break;
            case 'Pryuita':
                filteringImage = new Pryuita(currentImg);
                break;
            case 'Sobel':
                filteringImage = new Sobel(currentImg);
                break;
            case 'Otsu':
                filteringImage = new Otsu(currentImg);
                break;
            case 'Bradley':
                filteringImage = new Bradley(currentImg, 0.85);
                break;
            case 'GammaCorrection':
                filteringImage = new GammaCorrection(currentImg, 1.2, 0.8);
                break;
            case 'Median':
                filteringImage = new Median(currentImg);
                break;
            case 'Inversion':
                filteringImage = new Inversion(currentImg);
                break;
            case 'Gray':
                filteringImage = new Gray(currentImg);
                break;
            case 'Gauss':
                filteringImage = new Gauss(currentImg);
                break;
            case 'Canny':
                filteringImage = new Canny(currentImg);
                break;
        }



        prevImg = filteringImage.filter().toImageData();
        imgCtx.putImage(prevImg);
    }, false);
    var e = document.getElementById('btn1');
    e.addEventListener('click',()=>{
        var m = new Morphology(prevImg);
        m.erosion()/*.increase()*/;
        imgCtx = new ImageCtx('convas');
        imgCtx.putImage(imgCtx.initFromCanvasData(m.exportImageData()).imageData)
    });
    var e1 = document.getElementById('btn2');
    e1.addEventListener('click',()=>{
        if(document.getElementById('selectImg').value == 'main'){
            imgCtx = new ImageCtx('convas');
            currentImg = imgCtx.initFromIMG('target').imageData;
        } else {
            imgCtx = new ImageCtx('convas');
            currentImg = imgCtx.initFromCanvasData(prevImg).imageData;
        }
        var ser = new Search(currentImg);
        ser.run();
        var r = ser.select();
        imgCtx.putImage(r);
    });
});