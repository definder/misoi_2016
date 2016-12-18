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
import Neiron from './modules/Neiron';

import Front from './front/index';

document.addEventListener("DOMContentLoaded", event => {
    var neiron = new Neiron();
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
        m.increase();//.erosion();
        imgCtx = new ImageCtx('convas');
        imgCtx.putImage(imgCtx.initFromCanvasData(m.exportImageData()).imageData);
        var ser = new Search(imgCtx.initFromCanvasData(m.exportImageData()).imageData);
        //ser.run();
        var r = ser.select();
        imgCtx.putImage(r);
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
        console.log(ser.rule);
        alert(neiron.search(ser.rule));
    });
    var e4 = document.getElementById('btn4');
    e4.addEventListener('click',()=>{
        if(window.localStorage.getItem('fruit')){
            neiron.fruit = JSON.parse(window.localStorage.getItem('fruit'));
            console.log('Getting', neiron.fruit);
        } else {
            window.localStorage.setItem('fruit', JSON.stringify(neiron.fruit));
            console.log('Saving');
        }

    });
    var e3 = document.getElementById('btn3');
    e3.addEventListener('click', ()=>{
        imgCtx = new ImageCtx('convas');
        let img;
        imgCtx.initFromUrl('/assets/img/apple-1.jpg', (_imgCtx)=>{
            let ser = new Search(_imgCtx.imageData);
            ser.run();
            ser.select();
            neiron.teach('apple', ser.rule);
            console.log(neiron.fruit);
        });
        let imgCtxApple2 = new ImageCtx('convas');
        imgCtxApple2.initFromUrl('/assets/img/apple-2.jpg', (_imgCtx)=>{
            let ser = new Search(_imgCtx.imageData);
            ser.run();
            ser.select();
            neiron.teach('apple', ser.rule);
            console.log(neiron.fruit);
        });
        let imgCtxApple3 = new ImageCtx('convas');
        imgCtxApple3.initFromUrl('/assets/img/apple-3.jpg', (_imgCtx)=>{
            let ser = new Search(_imgCtx.imageData);
            ser.run();
            ser.select();
            neiron.teach('apple', ser.rule);
            console.log(neiron.fruit);
        });
        let imgCtxApple4 = new ImageCtx('convas');
        imgCtxApple4.initFromUrl('/assets/img/apple-4.jpg', (_imgCtx)=>{
            let ser = new Search(_imgCtx.imageData);
            ser.run();
            ser.select();
            neiron.teach('apple', ser.rule);
            console.log(neiron.fruit);
        });
        let imgCtxApple5 = new ImageCtx('convas');
        imgCtxApple5.initFromUrl('/assets/img/apple-5.png', (_imgCtx)=>{
            let ser = new Search(_imgCtx.imageData);
            ser.run();
            ser.select();
            neiron.teach('apple', ser.rule);
            console.log(neiron.fruit);
        });
        let imgCtxOrange1 = new ImageCtx('convas');
        imgCtxOrange1.initFromUrl('/assets/img/orange-1.jpg', (_imgCtx)=>{
            let ser = new Search(_imgCtx.imageData);
            ser.run();
            ser.select();
            neiron.teach('orange', ser.rule);
            console.log(neiron.fruit);
        });
        let imgCtxOrange2 = new ImageCtx('convas');
        imgCtxOrange2.initFromUrl('/assets/img/orange-2.png', (_imgCtx)=>{
            let ser = new Search(_imgCtx.imageData);
            ser.run();
            ser.select();
            neiron.teach('orange', ser.rule);
            console.log(neiron.fruit);
        });

        let imgCtxOrange3 = new ImageCtx('convas');
        imgCtxOrange3.initFromUrl('/assets/img/orange-3.jpg', (_imgCtx)=>{
            let ser = new Search(_imgCtx.imageData);
            ser.run();
            ser.select();
            neiron.teach('orange', ser.rule);
            console.log(neiron.fruit);
        });
    });
});