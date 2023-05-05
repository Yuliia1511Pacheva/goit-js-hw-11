
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import { getPhotos } from './js/service-api';
import { createMarkup } from './js/markUp';

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
  rootMargin: '400px',
  threshold: 0.0,
};

const observer = new IntersectionObserver(onInfinityScroll, options);



form.addEventListener('submit', onSubmit);
function onSubmit(evt) {
  evt.preventDefault();
  page = 1;
  searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';
  observer.unobserve(guard);

  if (!searchQuery) {
    Notiflix.Notify.failure('Please, enter query!');
    return;
  }
  
  getPhotos(searchQuery, page)
    .then(data => {
      totalPages = Math.ceil(data.totalHits / per_page);
      
      if (!data.hits.length) {
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
    
    if (entry.isIntersecting) {
      page += 1;
      console.log(entry);
      getPhotos(searchQuery, page).then(data => {
        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        simplelightbox.refresh();

        totalPages = Math.ceil(data.totalHits / per_page);
        if (page === totalPages) {
          observer.unobserve(guard);
          Notiflix.Notify.info(
            'We are sorry, but you have reached the end of search results.'
          );
        }
      }).catch(err => console.log(err));
    }
  });
}



