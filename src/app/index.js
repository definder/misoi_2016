import ImageCtx from './modules/image/ImageCtx';
import Pryuita from './modules/filter/methods/Pryuita';
import Sobel from './modules/filter/methods/Sobel';
import Front from './front/index';

document.addEventListener("DOMContentLoaded", event => {
    Front();
    var el = document.getElementById('btn');
    el.addEventListener('click',()=>{
        console.log(document.getElementById('mainselection').value);
        var image = new ImageCtx('convas','target', 200, 300);
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
        }
        image.putImage(filteringImage.filter());
    }, false);
});