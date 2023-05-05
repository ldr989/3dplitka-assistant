
import header from "./modules/header.js";
import imagesCollections from "./modules/images-collections.js";
import imagesTiles from "./modules/images-tiles.js";
import autoClickBtnAll from "./modules/auto-click-btn-all.js";
import autoClickBtn from "./modules/auto-click-btn.js";
import openForm from "./modules/open-form.js";



header('.tabs_images', '.tabs_properties', '.menu_properties', '.menu_images');
imagesCollections(
    '.btn_add-collection-form',
    '.images__amount_collections',
    () => autoClickBtnAll('.grp-add-handler'),
    );
imagesTiles(
    '.btn_add-tile-form', 
    '.images__amount_tiles', 
    '.btn_change-tile-faces', 
    () => autoClickBtn('.grp-add-handler'),
    () => openForm('#plumbing-image-content_type-object_id-group')
    );
