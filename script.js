let searchmovie = document.getElementById("movie");
let searchbtn = document.getElementById("search");
let apikey = "24d95b94";
let result = document.querySelector(".container");
let collection = ["Inception", "Titanic", "Avatar", "The Matrix", "Oppenheimer", "Harry Potter", "spider-man", "Avengers", "conjuring"];

// Create a loading element to indicate data is being fetched
let loading = document.createElement("div");
loading.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/128/4221/4221484.png" class="loading">
  <p>Loading...</p>`;
loading.style.display = "none"; 
document.body.appendChild(loading); 

// Function to search for movies using the OMDB API
let search = async (moviename, year) => {
  try {
    loading.style.display = "block"; 
    let url = `https://www.omdbapi.com/?s=${moviename}&apikey=${apikey}`; 
    let response = await fetch(url); 
    let data = await response.json(); 
    console.log(data);
    if (data.Response === "True") {
      let movies = data.Search; // Get the list of movies

      // If a year is specified, filter movies based on the year
      if (year) {
        movies = movies.filter((movie) => { return movie.Year === year });
      }
      if (movies.length > 0) {
        showmoviedetails(movies);
      } else {
        result.innerHTML = `"${moviename}" NOT FOUND "`;
      }
    } else  {
      // If no movie found, display an error message
      result.innerHTML = `"${moviename}" NOT FOUND...`;
    }
  } catch (error) {
    console.error(`Error fetching movie: ${moviename}`, error); 
  } finally {
    loading.style.display = "none"; 
  }
};

// Function to display movies from the predefined collection
function showdata() {
  for (let movie of collection) {
    search(movie); 
  }
}

// Add an event listener for the search button
searchbtn.addEventListener("click", (e) => {
  e.preventDefault();
  let moviename = searchmovie.value;
  let year = document.getElementById("year").value; 
  year = year.toString(); 

  if (moviename !== "") {
    search(moviename, year); 
  } else {
    alert("Invalid name");
  }
});

// Function to fetch detailed movie information using IMDB ID
async function showmovie(imdbID) {
  let url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apikey}`;
  let response = await fetch(url); 
  let data = await response.json(); 
  return data; 
}

let showmoviedetails = (movies) => {
  result.innerHTML = ""; 
  movies.forEach(async (movie) => {
    movie = await showmovie(movie.imdbID); 
    let img = document.createElement("div");
    img.innerHTML = `<img src=${movie.Poster}>`; 
    let info = document.createElement("div"); 
    info.classList.add("results");
    info.innerHTML = `<h2>Title: ${movie.Title}</h2>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <h3>IMDB Rating: ${movie.imdbRating}</h3>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>`;
    result.appendChild(img);
    result.appendChild(info);
  });
};

// Display movies from the predefined collection when the page loads
showdata();
