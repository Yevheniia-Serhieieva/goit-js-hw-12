import { getImagesByQuery } from "./js/pixabay-api";
import { clearGallery, createGallery, hideLoader, hideLoadMoreButton, loadMoreBtnVisibleStatus, scrollNewContent, showLoader } from "./js/render-functions";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const formElem = document.querySelector('.form');
const loadMoreBtnElem = document.querySelector('.btn-load');

let query = '';
let page = 1;
const per_page = 15;
let totalHits = 0;



formElem.addEventListener('submit', async e => {
    e.preventDefault();

    query = e.target.elements.searchText.value.trim();

    if(query === '') {
        iziToast.warning({
            title: 'Warning',
            message: 'Empty input field',
        });
        return;
    };
    page = 1;
    clearGallery();
    showLoader();
    hideLoadMoreButton();

    try {
        const data = await getImagesByQuery(query, page, per_page);
        totalHits = data.totalHits;

        if (data.hits.length === 0) {
            iziToast.error({
                message:
                "Sorry, there are no images matching your search query. Please try again!",
            });
            return;
        } else {
            createGallery(data.hits);
            loadMoreBtnVisibleStatus(totalHits, page);
        }
    } catch (error) {
        iziToast.error({
            message: "An error occurred while fetching images. Please try again.",
        });
    } finally {
        hideLoader();
    }


    e.target.reset();
});



loadMoreBtnElem.addEventListener('click', async () => {
    page += 1;
    showLoader();

    
    try {
        const data = await getImagesByQuery(query, page, per_page);
        createGallery(data.hits);     
        loadMoreBtnVisibleStatus(totalHits, page);
        scrollNewContent();
    } catch (error) {
        iziToast.error({
            message: "An error occurred while fetching images. Please try again.",
        });
    } finally {
        hideLoader();
    }
})

