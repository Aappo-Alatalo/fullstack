import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

export const getId = () => (100000 * Math.random()).toFixed(0)

// export const vote = (id) => {
//   return {
//     type: 'VOTE',
//     payload: {
//       id: id
//     }
//   }
// }

// export const newAnecdote = (content) => {
//   return {
//     type: 'NEW_ANECDOTE',
//     payload: {
//       content: content,
//       id: getId(),
//       votes: 0
//     }
//   }
// }

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

// const initialState = anecdotesAtStart.map(asObject)

// const anecdoteReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'VOTE': {
//       const id = action.payload.id
//       const selectedAnecdote = state.find(a => a.id === id)
//       const votedAnecdote = {
//         ...selectedAnecdote,
//         votes: selectedAnecdote.votes + 1
//       }
//       // If anecdote has given id, change it to voted anecdote, else leave it alone
//       return state.map(a =>
//         a.id !== id ? a : votedAnecdote
//       )
//     }
//     case 'NEW_ANECDOTE': {
//       return state.concat(action.payload)
//     }
//     default:
//     return state
//   }
// }

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: anecdotesAtStart.map(asObject),
  reducers: {
    newAnecdote(state, action) {
      // Can do push instead of concat thanks to IMMER
      // ALSO returning is not allowed thanks to IMMER
      const anecdote = {
        content: action.payload,
        id: getId(),
        votes: 0,
      }
      state.push(anecdote)
    },
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
  },
})

export const { newAnecdote, vote } = anecdoteSlice.actions
export default anecdoteSlice.reducer