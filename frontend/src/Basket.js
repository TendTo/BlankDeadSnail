import React, { useCallback, useRef } from 'react'
import { Button, Modal } from 'react-daisyui'

/**
 *
 * @param {{basketMovies: Movie[]}} param0
 * @returns
 */
export function Basket({ basketMovies, setBasketMovies }) {
  const ref = useRef(null)

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

  const handleShow = useCallback(() => {
    ref.current?.showModal()
  }, [ref])

  return (
    <>
      <Button className="basket-button" onClick={() => handleShow()}>
        BASKET
      </Button>
      <Modal ref={ref}>
        <Modal.Header className="font-bold">Your basket</Modal.Header>
        <Modal.Body>
          {basketMovies.map((movie) => (
            <div key={movie.id}>
              <div className="flex flex-auto gap-1 justify-between">
                <p>{movie.title}</p>
                <p>£1</p>
              </div>
              {/* <Button onClick={setBasketMovies} type="button">
                <span aria-hidden="true">&times;</span>
              </Button> */}
            </div>
          ))}
          <div className="grand-total flex justify-between">Total price: £{Array.isArray(basketMovies) ? basketMovies.length : 0}</div>
        </Modal.Body>
        <Modal.Actions>
          <form method="dialog">
            <Button color="primary">Close</Button>
          </form>
          <Button color="error" type="button" className="btn btn-danger clear-all" onClick={() => setBasketMovies([])}>
            Clear All
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}
