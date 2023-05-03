import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { smoothScroll } from './scroll.js';
import './css/styles.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');

let simplelightbox = new SimpleLightbox('.gallery a');

let page = 1;
let searchQuery = '';
let totalPages = null;
const per_page = 40;

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 0.0,
};

const observer = new IntersectionObserver(onInfinityScroll, options);

async function getPhotos(query, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '35795496-dc73936924deac0cc2e60d251';
  const params = new URLSearchParams({
    key: KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: per_page,
    page: page,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    const { data } = response;
    return data;
  } catch (error) {
    console.error(error);
  }
}


form.addEventListener('submit', onSubmit);
function onSubmit(evt) {
  evt.preventDefault();
  page = 1;
  searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';
  observer.disconnect();
  getPhotos(searchQuery, page)
    .then(data => {
      totalPages = Math.ceil(data.totalHits / per_page);
      if (!data.hits.length || !searchQuery) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        gallery.innerHTML = '';
        return;
      }
      if (data.hits) {
        gallery.innerHTML = '';
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        simplelightbox.refresh();
      }
      if (page !== totalPages) {
        console.log(page);
        console.log(totalPages);
        observer.observe(guard);
      }
    })
    .catch(err => console.log(err));
}


function onInfinityScroll(entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
    if (entry.isIntersecting) {
      page += 1;
      
      getPhotos(searchQuery, page).then(data => {
        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        simplelightbox.refresh();

        totalPages = Math.ceil(data.totalHits / per_page);
        if (page === totalPages) {
           console.log(page);
           console.log(totalPages);
          observer.unobserve(guard);
          Notiflix.Notify.info(
            'We are sorry, but you have reached the end of search results.'
          );
        }
      });
    }
  });
}


function createMarkup(arr) {
  return arr
    .map(
      ({
        downloads,
        comments,
        views,
        likes,
        tags,
        largeImageURL,
        webformatURL,
      }) => `
  <div class="photo-card">
  <a href="${largeImageURL}">
  <div class="photo-thumb">
  <img src="${webformatURL}" alt="${tags}" class="image" loading="lazy" />
  </div>
  </a>
   
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <br>${likes}
    </p>
    <p class="info-item">
      <b>Views</b><br>${views}
    </p>
    <p class="info-item">
      <b>Comments</b><br>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b><br>${downloads}
    </p>
  </div>
</div>
  `
    )
    .join('');
}
