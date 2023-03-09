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

  clearCardsGallery();
  cardsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  cardsApiService.resetPage();
  cardsApiService.fetchCards().then(appendCardsMarkup);
  loadMoreBtn.style.display = 'flex';
}

function onLoadMore() {
  cardsApiService.fetchCards().then(appendCardsMarkup);
}

function appendCardsMarkup(hits) {
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

// function onSearch(e) {
//   e.preventDefault();

//   if (searchQuery.value.trim() === '') {
//     Notiflix.Notify.info('Enter your request in the search');
//     return;
//   }

//   onFetchInfo(e.currentTarget.elements.searchQuery.value.trim())
//     .then(data => {
//       if (data.totalHits === 0) {
//         Notiflix.Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//         return;
//       }

//       renderPhotosCard(data);
//       loadMoreBtn.style.display = 'flex';
//     })
//     .catch(error => console.log(error))
//     .finally(() => searchForm.reset());
// }
