import './css/styles.css';
import Notiflix from 'notiflix';
const axios = require('axios').default;

const searchForm = document.querySelector('#search-form');
const searchQuery = document.querySelector('[name="searchQuery"]');
const submitBtn = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.style.display = 'none';

searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  if (searchQuery.value.trim() === '') {
    Notiflix.Notify.info('Enter your request in the search');
    return;
  }

  onFetchInfo(searchQuery.value.trim())
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      renderPhotosCard(data);
      loadMoreBtn.style.display = 'flex';
    })
    .catch(error => console.log(error))
    .finally(() => searchForm.reset());
}

function onFetchInfo(inputValue) {
  return fetch(
    `https://pixabay.com/api/?key=34223643-b3db1c288a37bd2710c13c9b4&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true`
  ).then(response => {
    return response.json();
  });
}

function renderPhotosCard(data) {
  const markup = data.hits
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
  gallery.innerHTML = markup;
}
