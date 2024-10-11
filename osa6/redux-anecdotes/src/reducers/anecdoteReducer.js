import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

export const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload
      const selectedAnecdote = state.find(a => a.id === id)

      if (!selectedAnecdote) {
        console.error(`Anecdote with id ${id} not found`)
        return state
      }

      // Update votes for the selected anecdote
      selectedAnecdote.votes += 1
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const { vote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const returnedAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(returnedAnecdote))
  }
}

export const voteAnecdote = object => {
  return async dispatch => {
    const returnedAnecdote = await anecdoteService.updateVotes(object)
    dispatch(vote(returnedAnecdote.id))
  }
}

export default anecdoteSlice.reducer