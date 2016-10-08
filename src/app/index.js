import ImageCtx from './modules/image/ImageCtx';
import Pryuita from './modules/filter/methods/Pryuita';
import Median from './modules/filter/methods/Median';
import Front from './front/index';

document.addEventListener("DOMContentLoaded", event => {
    Front();
    var el = document.getElementById('btn');
    el.addEventListener('click',()=>{
        var image = new ImageCtx('convas','target', 200, 300);
        var pr = new Pryuita(image.imageData);
        image.putImage(pr.filter());
    }, false);

});