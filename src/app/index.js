import ImageCtx from './modules/image/ImageCtx';
import Pryuita from './modules/filter/methods/Pryuita';
import Sobel from './modules/filter/methods/Sobel';
import Median from './modules/filter/methods/Median';
import GammaCorrection from './modules/filter/methods/GammaCorrection';
import Otsu from './modules/filter/methods/Otsu';
import Bradley from './modules/filter/methods/Bradley';
import Front from './front/index';

document.addEventListener("DOMContentLoaded", event => {
    Front();
    var el = document.getElementById('btn');
    el.addEventListener('click',()=>{
        var image = new ImageCtx('convas','target');
        var filteringImage;
        switch (document.getElementById('mainselection').value){
            case 'null':
                alert('Select your method');
                break;
            case 'Pryuita':
                filteringImage = new Pryuita(image.imageData);
                break;
            case 'Sobel':
                filteringImage = new Sobel(image.imageData);
                break;
            case 'Otsu':
                filteringImage = new Otsu(image.imageData);
                break;
            case 'Bradley':
                filteringImage = new Bradley(image.imageData, 0.85);
            case 'GammaCorrection':
                filteringImage = new GammaCorrection(image.imageData, 1.2, 0.8);
                break;
            case 'Median':
                filteringImage = new Median(image.imageData);
                break;
        }
        image.putImage(filteringImage.filter());
    }, false);
});