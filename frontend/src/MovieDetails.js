import React from 'react'

import { useCallback } from 'react'
import { Button } from 'react-daisyui'

const MovieDetails = ({ basketMovies, setBasketMovies, ...props }) => {
  const addMovieBasket = useCallback(
    (newId) => {
      const newBasketMovies = basketMovies.filter((movie) => movie.id !== newId)
      newBasketMovies.push({ id: newId, ...props })
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
    fontSize: '40px',
    margin: '0px'
  }

  const h4Style = {
    fontSize: '14px',
    margin: '3px'
  }

  const size = {
    fontSize: '12px'
  }

  const mainbox = { width: 750 }

  const overviewbox = { width: 500 }

  return (
    <div style={movieDetailsStyle}>
      <div style={mainbox}>
        <h1 style={h1Style}>{props.title}</h1>
        <h4 style={h4Style}>{props.release_date}</h4>
        <h4 style={h4Style}>
          {props.runtime} minutes, {props.genres}
        </h4>
        <p style={size}>Original Language: {props.original_language}</p>
        <p style={size}>Production Co: {props.production_companies}</p>
        <div style={overviewbox}>
          <p>{props.overview}</p>
        </div>
      </div>
      <Button color="accent" onClick={() => addMovieBasket(props.id)}>
        Add to Cart
      </Button>
    </div>
  )
}

export default MovieDetails
