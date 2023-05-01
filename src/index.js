import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const paginationBtn = document.querySelector('.load-more');

let simplelightbox = new SimpleLightbox('.gallery a');


let page = 12;
let searchQuery = '';
let limit = 500;
let per_page = 40;
let totalPages = Math.round(limit / per_page);

form.addEventListener('submit', onSubmit);
paginationBtn.addEventListener('click', onPagination);

function onSubmit(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.elements.searchQuery.value.trim();

  getPhotos(searchQuery, page)
    .then(data => {
      if (!data.hits.length || !searchQuery) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        gallery.innerHTML = '';
        paginationBtn.hidden = true;
        return;
      }
      if (data.hits) {
        gallery.innerHTML = '';
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));

       
        simplelightbox.refresh();
        paginationBtn.hidden = false;
      }
    })
    .catch(err => console.log(err));
}

function onPagination() {
  page += 1;
    if (page === totalPages) {
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      paginationBtn.style.display = 'none';
    }

  getPhotos(searchQuery, page).then(data => {
    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));

    simplelightbox.refresh();
  });
}

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
    page: page
  });

  // const URL = `${BASE_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${per_page}&page=${page}`;
  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    const { data } = response;
    return data;
  } catch (error) {
    console.error(error);
  }
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
  <img src="${webformatURL}" alt="${tags}" width="250" loading="lazy" />
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


function smoothScroll() {
   const { height: cardHeight } = document
     .querySelector('.gallery')
     .firstElementChild.getBoundingClientRect();

   window.scrollBy({
     top: cardHeight * 2,
     behavior: 'smooth',
   });
}