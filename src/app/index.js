import ImageCtx from './modules/image/ImageCtx';
import Front from './front/index';

document.addEventListener("DOMContentLoaded", event => {
    Front();
    var el = document.getElementById('btn');
    el.addEventListener('click',()=>{
        var image = new ImageCtx('convas','target', 200, 300);
        image.putImage();
    }, false);

});