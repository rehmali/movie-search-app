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

    this.movieIDs = [];
    this.sNo = 0;
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
    <button class="btn-close">❌</button>
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
   <div class="imdbID" style="display:none">${movie.imdbID}</div>
  `;

    if (movie) {
      this.movieIDs[this.sNo] = movie.imdbID;
      this.sNo++;
    }

    return html;
  }
  // rendering Movie on the page
  renderMovie(movie) {
    this.clearMovie();

    this.currentMovie = movie;
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
        `https://www.omdbapi.com/?t=${query}&apikey=8ca4d41f`
      );
      // console.log(response);
      if (!response.ok) throw new error("Movie Not found");
      const data = await response.json();
      if (data.Response === "False") {
        this.movieContainerEL.innerHTML = `<p style="color:red; font-size:1.5rem; text-align:center; font-weight:bolder"> Movie Not Found </p>`;
        return;
      }
      this.renderMovie(data);
      this.renderSavedMovies();
    } catch (err) {
      console.error(`Error Loading Movie ${err.message}`);
    }
  }

  // Clear Serach

  clearSearch() {
    this.searchInputEl.value = "";
  }

  renderSavedMovies() {
    const savedAllMovies =
      JSON.parse(localStorage.getItem("savedMovies")) || [];
    savedAllMovies.forEach((f) => {
      if (f) {
        let newMovie = document.createElement("div");
        newMovie.classList.add("movie-card");
        newMovie.insertAdjacentHTML("afterbegin", this.renderMoviehtml(f));
        this.movieContainerEL.appendChild(newMovie);
      }
    });
  }

  removeSavedMovie(movieCard) {
    const imdbID = movieCard.querySelector(".imdbID")?.textContent;

    let savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || [];

    savedMovies = savedMovies.filter((mov) => {
      return mov?.imdbID !== imdbID;
    });
    localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
  }
  saveMovie(movie) {
    if (!movie || !movie.imdbID) {
      return;
    }
    // 1. Get the saved movies from localStorage (or start with an empty array)
    let savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || [];

    // 3. Add the new movie to the array
    savedMovies.push(movie);

    // 4. Save updated list back to localStorage
    localStorage.setItem("savedMovies", JSON.stringify(savedMovies));

    // console.log(savedMovies);
    // 5.Feedback
    alert(`"${movie.Title}" has been saved!`);
  }

  init() {
    this.renderSavedMovies();

    this.formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = this.searchInputEl.value;
      this.fetchMovie(query);
      this.clearSearch();
    });

    this.movieContainerEL.addEventListener("click", (e) => {
      if (e.target.classList.contains("save-movie")) {
        if (this.currentMovie) {
          this.saveMovie(this.currentMovie);
        }
      }
      if (e.target.classList.contains("btn-close")) {
        const movieCard = e.target.closest(".movie-card");
        if (movieCard) {
          this.removeSavedMovie(movieCard);
          movieCard.remove();
        }
      }
    });
  }
}

const theMovie = new Movies(userSearchedMovie, formSearch, movieContainer);
theMovie.init();
