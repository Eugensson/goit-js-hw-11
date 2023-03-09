import './css/styles.css';
import Notiflix from 'notiflix';
const axios = require('axios').default;
import CardsApiService from './cards-service';

const searchForm = document.querySelector('#search-form');
const submitBtn = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

const cardsApiService = new CardsApiService();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  cardsApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (cardsApiService.query === '') {
    Notiflix.Notify.info('Enter your request in the search');
    return;
  }

  cardsApiService.resetPage();

  cardsApiService.fetchCards().then(data => {
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.style.display = 'none';
      return;
    } else {
      loadMoreBtn.style.display = 'flex';
    }

    appendCardsMarkup(data);
  });

  clearCardsGallery();
}

function onLoadMore() {
  cardsApiService.fetchCards().then(data => {
    appendCardsMarkup(data);
  });
}

function appendCardsMarkup(data) {
  const hits = data.hits;
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <div class="photo-card">
    <a class="gallery__link" href="${largeImageURL}">
    <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b> Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearCardsGallery() {
  gallery.innerHTML = '';
}

// if (Math.ceil(data.totalHits / 40) === 13) {
//   Notiflix.Notify.info(
//     "We're sorry, but you've reached the end of search results."
//   );
//   loadMoreBtn.style.display = 'none';
//   return;
// }
