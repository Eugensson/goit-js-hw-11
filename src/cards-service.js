export default class CardsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchCards(searchQuery) {
    return fetch(
      `https://pixabay.com/api/?key=34223643-b3db1c288a37bd2710c13c9b4&q=${this.searchQuery}&page=${this.page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.page += 1;

        return data.hits;
      });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
