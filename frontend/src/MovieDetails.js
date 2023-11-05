import React from 'react'

const MovieDetails = (props) => {
  console.log(props)
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
      <h1 style={h1Style}>{props.title}</h1>
      <p className="synopsis" style={synopsisStyle}>
        {props.overview}
      </p>
      <p style={paragraphStyle}>Genre: {props.genres}</p>
      <p style={paragraphStyle}>Tagline: {props.tagline}</p>
      <p style={paragraphStyle}>Release date: {props.release_date}</p>
    </div>
  )
}

export default MovieDetails
