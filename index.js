/********************* */
/**** DOM Elements*** */
/** *******************/

const userSearchedMovie = document.querySelector("#search-input");
const formSearch = document.getElementById("search-form");
const movieContainer = document.getElementById("movies-container");

/************ *******/
/***** Classes ****/
/** ***************/

class Movies {
  constructor(searchInputEl, formEl, movieContainerEL) {
    this.searchInputEl = searchInputEl;
    this.formEl = formEl;
    this.movieContainerEL = movieContainerEL;
  }

  // Showing Loading.. to use when API is fetching movie
  showLoading() {
    this.movieContainerEL.innerHTML = `<span> Loading... </span>`;
  }
  //  Clears Movie

  clearMovie() {
    this.movieContainerEL.innerHTML = "";
  }
  // Adding new Markup for movie card
  renderMoviehtml(movie) {
    const genre = movie.Genre.split(",")
      .map((g) => `<span class= "genre-item"> ${g}</span>`)
      .join("");
    let html = `
  <img src=${movie.Poster} alt="${movie.Title} Poster" />
  <h3> ${movie.Title}</h3>

  <p class="genre">${genre}
  </p>
  <br>
  <hr>

  <p> ${movie.Plot}</p>
  <br>
  <hr>

  <div class="details">
   <div> Director <span class="movie-detail"> ${movie.Director} </span> </div>
   <div> Writer <span class="movie-detail"> ${movie.Writer} </span> </div>
   <div> Stars <span class="movie-detail"> ${movie.Actors} </span> </div>
   <div> IMDB <span class="movie-detail"> ${movie.imdbRating} </span> </div>
   </div>
   <button class="save-movie">Save </button>
  `;

    return html;
  }
  // rendering Movie on the page
  renderMovie(movie) {
    this.clearMovie();

    let newMovie = document.createElement("div");
    newMovie.classList.add("movie-card");
    newMovie.insertAdjacentHTML("afterbegin", this.renderMoviehtml(movie));
    this.movieContainerEL.appendChild(newMovie);
  }
  // Fetching Movie from API

  async fetchMovie(query) {
    try {
      if (!query.trim()) {
        alert("please enter a movie name");
        return;
      }
      this.showLoading();
      const response = await fetch(
        `http://www.omdbapi.com/?t=${query}&apikey=8ca4d41f`
      );
      console.log(response);
      if (!response.ok) throw new error("Movie Not found");
      const data = await response.json();
      if (data.Response === "False") {
        this.movieContainerEL.innerHTML = `<p style="color:red; font-size:1.5rem; text-align:center; font-weight:bolder"> Movie Not Found </p>`;
        return;
      }
      this.renderMovie(data);
    } catch (err) {
      console.error(`Error Loading Movie ${err.message}`);
    }
  }

  // Clear Serach

  clearSearch() {
    this.searchInputEl.value = "";
  }

  init() {
    this.formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = this.searchInputEl.value;
      this.fetchMovie(query);
      this.clearSearch();
    });
  }
}

const theMovie = new Movies(userSearchedMovie, formSearch, movieContainer);
theMovie.init();

// Now add a Save Button
// Save button will make stay movie in page , while user search for new movie
// Write saveMovie() method in class
