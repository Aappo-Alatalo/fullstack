import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer.js' 
import { showNotification } from '../reducers/notificationReducer.js'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes.filter(anecdote => 
    anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
  ))

  const handleVote = (id, content) => {
    dispatch(vote(id))

    dispatch(showNotification(`you voted '${content}'`, 5000))
  }

  return (
    <>
      {anecdotes
      .slice()
      .sort((a, b) => b.votes - a.votes)
      .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList