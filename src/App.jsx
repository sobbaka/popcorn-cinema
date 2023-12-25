import { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const total = (arr) =>
  arr.reduce((acc, cur) => acc + cur, 0);

function NavBar({ query, setQuery, children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} setQuery={setQuery} />
      {children}
    </nav>
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function Results({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null)

  useKey('enter', function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus()
    setQuery('')
  })

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  )
}

function Main({ children }) {

  return (
    <main className="main">
      {children}
    </main>
  )
}



function WatchedList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => <WatchedMovie movie={movie} key={movie.imdbID} onDelete={onDelete} />)}
    </ul>
  )
}

function WatchedMovie({ movie, onDelete }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}></button>
    </li>
  )
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = total(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{parseFloat(avgImdbRating, 2).toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{parseFloat(avgUserRating, 2).toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{parseInt(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  )
}

function MovieBox({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  )
}

function MovieList({ movies, handleSelectedID }) {


  return (
    <ul className="list">
      {movies?.map((movie) => <Movie movie={movie} key={movie.imdbID} handleSelectedID={handleSelectedID} />)}
    </ul>
  )
}

function Movie({ movie, handleSelectedID }) {

  return (
    <li onClick={() => handleSelectedID(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function Loader() {
  return <p className="loader">Movies are loading</p>
}
function ErrorMessage({ message }) {
  return <p className="error">❌ {message}</p>
}

function SelectedMovie({ selectedID, handleResetSelectedID, onAddwatched, watched }) {
  const [movieDetail, setMovieDetail] = useState({})
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const isWatched = watched.map(item => item.imdbID).includes(selectedID)
  const isWatchedRating = watched.find(item => item.imdbID === selectedID)?.userRating
  const title = movieDetail.Title


  const countRef = useRef(0);
  useEffect(
    function () {
      if (userRating) countRef.current += 1;
    },
    [userRating]
  );

  useKey('Escape', handleResetSelectedID)

  // useEffect(function () {
  //   function callback(e) {
  //     if (e.code === 'Escape') {
  //       handleResetSelectedID()
  //     }
  //   }
  //   document.addEventListener('keydown', callback)
  //   return function () {
  //     document.removeEventListener('keydown', callback)
  //   }
  // }, [handleResetSelectedID])


  useEffect(function () {
    async function fetchMovie() {
      try {
        setError('')
        setIsLoading(true)
        const response = await fetch(`https://www.omdbapi.com/?i=${selectedID}&apikey=b032d39e`)
        if (!response.ok) throw new Error('something is broken')
        const data = await response.json()
        if (data.Response === 'False') throw new Error('Movie not found')
        setMovieDetail(data)
      } catch (err) {
        console.log(err.message)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    if (!selectedID.length) {
      setMovieDetail({})
      setError('')
      return
    } else {
      fetchMovie()

    }
  }, [selectedID])

  useEffect(
    function () {
      if (!title) return;
      document.title = title
      return function () {
        document.title = 'Popcorn App'
      }

    }, [title]
  )


  function handleAddWatchedMovie() {
    const newWatchedMovie = {
      ...movieDetail,
      runtime: parseInt(movieDetail.Runtime.replace(' min', '')),
      userRating: userRating,
      countRatingDecision: countRef.current,
    }
    onAddwatched(newWatchedMovie)
    handleResetSelectedID()
  }


  return <div className="details">
    <button className="btn-back" onClick={handleResetSelectedID}></button>
    <header>
      <img src={movieDetail.Poster} alt={`Poster of ${movieDetail.Title} movie`} />
      <div className="details-overview">
        <h2>{movieDetail.Title}</h2>
        <p>{movieDetail.Released} &bull; {movieDetail.Runtime}</p>
        <p>{movieDetail.Genre}</p>
        <p>⭐ {movieDetail.imdbRating} IMDB</p>
      </div>
    </header>
    <section>
      <div className="rating">
        {isWatched ?
          <p>You rated this movie on {isWatchedRating} ⭐</p> :
          <>
            <StarRating
              maxStars={10}
              size={'24px'}
              defaultRating={userRating}
              onSetRating={setUserRating}
            />
            {userRating > 0 && <button className="btn-add" onClick={handleAddWatchedMovie}>+ Add to list</button>}
          </>
        }
      </div>
      <p><em>{movieDetail.Plot}</em></p>
      <p>Actors: {movieDetail.Actors}</p>
      {movieDetail.Director === 'N/A' ? '' : <p>Directed by {movieDetail.Director}</p>}
    </section>
  </div>
}

export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useLocalStorageState([], "watched")
  const [selectedID, setSelectedID] = useState("");
  const { movies, isLoading, error } = useMovies(query)



  function handleSelectedID(imdbID) {
    setSelectedID(selectedID => (imdbID === selectedID ? null : imdbID))
  }

  function handleResetSelectedID() {
    setSelectedID(null)
  }

  function handleAddWatchedMovie(movie) {
    setWatched([...watched, movie])
  }

  function handleDelete(id) {
    setWatched(watched.filter(movie => movie.imdbID != id))
  }



  return (
    <>
      <NavBar query={query} setQuery={setQuery}>
        <Results movies={movies} />
      </NavBar>
      <Main>
        <MovieBox>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} handleSelectedID={handleSelectedID} />}
          {error && <ErrorMessage message={error} />}

        </MovieBox>
        <MovieBox>
          {
            selectedID ?
              <SelectedMovie
                selectedID={selectedID}
                handleResetSelectedID={handleResetSelectedID}
                onAddwatched={handleAddWatchedMovie}
                watched={watched}
              /> :
              <>
                <WatchedSummary watched={watched} />
                <WatchedList watched={watched} onDelete={handleDelete} />
              </>
          }
        </MovieBox>
      </Main>
    </>
  );
}
