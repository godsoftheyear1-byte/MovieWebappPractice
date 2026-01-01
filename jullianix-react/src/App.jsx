import React, { useState, useEffect } from "react";
import Search from "./component/Search.jsx";
import Spinner from "./component/spinner.jsx";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [movielist, setMovielist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (query) => {
    setLoading(true);
    setError(false);
    try {
      const endpoint = query ? '/search/movie' : '/movie/popular';
      const url = query
        ? `${API_BASE_URL}${endpoint}?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}${endpoint}?language=en-US&page=1`;

      const response = await fetch(url, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`Failed to fetch movies (${response.status})`);
      }

      const data = await response.json();
      setMovielist(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      setError(true);
      setErrorMessage(err.message || 'Unknown error');
      setMovielist([]);
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  // debounce searchTerm to avoid excessive requests
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchMovies(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <>
      <div className="pattern" />
      <main>
        <div className="wrapper">
          <header className="header">
            <img src="./hero.png" alt="hero banner" />
            <h1>Find <span className="text-gradient">movies </span>You'll enjoy without a Hassle</h1>
          </header>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <section className="all-movies">
             <h2>All Movies</h2>
              <h2 className="loading-title">{loading && 'Loading Movies...'}</h2>
             {loading && <Spinner />}

             {error && !loading && <p className="text-red-500">{errorMessage}</p>}
              
             
             <h2 className="search-results-title">{searchTerm && !loading && !error && `Search Results for "${searchTerm}"`}</h2>
               

             <h2 className="no-results-title">{!loading && !error && movielist.length === 0 && 'No Movies Found'}</h2>
             <h2 className="error-title">{error && !loading && 'Error Fetching Movies'}</h2>
             
             {!loading && movielist.length > 0 && (
               <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                 {movielist.map(movie => (
                   <li key={movie.id} className="movie-card">
                     <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : '/placeholder.png'} alt={movie.title} />
                     <h3>{movie.title}</h3>
                     <div className="content">
                       <span className="year">{movie.release_date ? movie.release_date.slice(0,4) : 'N/A'}</span>
                       <div className="rating">
                         <img src="/star.png" alt="rating" />
                         <p>{movie.vote_average?.toFixed(1) ?? '—'}</p>
                       </div>
                     </div>
                   </li>
                 ))}
               </ul>
             )}
          </section>
        </div>
      </main>
    </>
  );
};

export default App;