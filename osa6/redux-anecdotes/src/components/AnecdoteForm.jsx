import { useDispatch } from 'react-redux'
import { newAnecdote } from '../reducers/anecdoteReducer.js'
import anecdoteService from '../services/anecdotes.js'
import { showNotification } from '../reducers/notificationReducer.js'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    const returnedAnecdote = await anecdoteService.createNew(content) // Send anecdote to cloud

    dispatch(newAnecdote(returnedAnecdote))
    dispatch(showNotification(`you added '${content}'`, 5000))
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='anecdote' /></div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm