const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';



const galleryContainer = document.querySelector(".gallery-container");
const formEl = document.querySelector(".header__form");
const inputEl = document.querySelector(".header__input");



formEl.addEventListener("submit", startSearch);


let searchQuery = "";
let page = 1;
// let result = "";

function startSearch(e) {
    e.preventDefault();
    inputEl.innerHTML = "";
galleryContainer.innerHTML = "";
searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  fetchSearch();  
    // console.log(searchQuery);
    return searchQuery;
}

async function fetchSearch() {

    const response = await fetch(`https://pixabay.com/api/?key=28514393-02e86ee05f4a6882389cbce9d&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
     result = await response.json();
    console.log(result);   
    if (result.hits.length >= 1) {
        Notify.success('Норм, нашел пачку!');
        pushMarkup();
        page += 1;       
      
    }
    else  {
        Notify.failure('Все пропало, давай по новой!');   
    } 
    
}  
 
function pushMarkup () {
const markup = result.hits.map((el) => `<div class="gallery">
        <a href="${el.largeImageURL}">
          <img
            src="${el.webformatURL}"
            alt="${el.tags}"
            loading="lazy"
            width="250"
        /></a>
      
      <div class="info">
        <p class="info-item">
          <b>Likes: ${el.likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${el.views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${el.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${el.downloads}</b>
        </p>
      </div></div>`).join("");
    galleryContainer.insertAdjacentHTML("beforeend", markup);

    let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
    });
    gallery.refresh();

     
    
}
        

  function populate() {
   
      let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
      if (windowRelativeBottom > document.documentElement.clientHeight + 100) return;
      document.body.insertAdjacentHTML("beforeend", fetchSearch(searchQuery));
    
  }

window.addEventListener('scroll', debounce(populate, 500));



