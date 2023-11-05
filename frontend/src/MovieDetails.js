import React from 'react'

import { useCallback } from 'react'

const MovieDetails = ({ id, title, overview, genres, tagline, release_date, poster_path, basketMovies, setBasketMovies }) => {
  const addMovieBasket = useCallback(
    (newId) => {
      const newBasketMovies = basketMovies.filter((movie) => movie.id !== newId)
      newBasketMovies.push({ id: newId, title, overview, genres, tagline, release_date, poster_path })
      setBasketMovies(newBasketMovies)
      localStorage.setItem('basket', JSON.stringify(newBasketMovies))
    },
    [basketMovies, setBasketMovies]
  )
  const movieDetailsStyle = {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
    margin: '20px'
  }

  const h1Style = {
    fontSize: '24px',
    margin: '0'
  }

  const synopsisStyle = {
    fontSize: '16px',
    marginTop: '10px'
  }

  const paragraphStyle = {
    fontSize: '18px',
    margin: '10px 0'
  }

  return (
    <div style={movieDetailsStyle}>
      <h1 style={h1Style}>{title}</h1>
      <p className="synopsis" style={synopsisStyle}>
        {overview}
      </p>
      <p style={paragraphStyle}>Genre: {genres}</p>
      <p style={paragraphStyle}>Tagline: {tagline}</p>
      <p style={paragraphStyle}>Release date: {release_date}</p>
      <p style={paragraphStyle}>URL: {poster_path}</p>
      <button className="add-to-cart" onClick={() => addMovieBasket(id)}>
        Add to Cart
      </button>
    </div>
  )
}

export default MovieDetails
