import { useCallback, useState } from 'react'

/**
 *
 * @param {{basketMovies: Movie[]}} param0
 * @returns
 */
export function Basket({ basketMovies, setBasketMovies }) {
  const [showBasket, setShowBasket] = useState(false)

  const deleteShowBasket = useCallback(
    (id) => {
      const newBasketMovies = basketMovies.filter((movie) => movie.id !== id)
      setBasketMovies(newBasketMovies)
      localStorage.setItem('basket', JSON.stringify(newBasketMovies))
    },
    [basketMovies, setBasketMovies]
  )
  const deleteAllBasket = useCallback(() => {
    setBasketMovies([])
    localStorage.setItem('basket', '[]')
  }, [setBasketMovies])

  return (
    <>
      <button className="basket-button" onClick={() => setShowBasket(true)}>
        BASKET
      </button>
      {showBasket && (
        <div className="modal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Your Cart
                </h5>
                {basketMovies.map((movie) => (
                  <div className="basket-movie" key={movie.id}>
                    <div className="basket-movie-details">
                      <div className="basket-movie-title">{movie.title}</div>
                      <div className="basket-movie-price">£{movie.price}</div>
                    </div>
                    <button onClick={setBasketMovies} type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="modal-body">
                <table className="show-cart table"></table>
                <div className="grand-total">
                  Total price: £<span className="total-cart">{}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowBasket(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-danger clear-all" onClick={() => setBasketMovies([])}>
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
