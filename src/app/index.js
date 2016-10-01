import ImageCtx from './modules/image/ImageCtx';
import Pryuita from './modules/filter/methods/Pryuita';

document.addEventListener("DOMContentLoaded", event => {

    var image = new ImageCtx('convas','target', 200, 300);
    var pr = new Pryuita(image.imageData);
    image.putImage(pr.filter());

});