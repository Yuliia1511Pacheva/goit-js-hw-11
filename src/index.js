import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '35795496-dc73936924deac0cc2e60d251';
let page = 1;

form.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();

  fetchPhotos(searchQuery)
    .then(data => {

       if (!data.hits.length) {
         Notiflix.Notify.failure(
           'Sorry, there are no images matching your search query. Please try again.'
         );
       }
      if (data.hits) {
        gallery.innerHTML = '';
        gallery.insertAdjacentHTML('afterbegin', createMarkup(data.hits));
      }
      
    })
    .catch(err => console.log(err));
  
}

async function fetchPhotos(query) {
    const URL = `${BASE_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  try {
    const response = await axios.get(URL);
    const { data } = response;
    return data;
  } catch (error) {
      console.error(error);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
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

  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });  
