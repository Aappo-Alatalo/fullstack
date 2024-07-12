import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))

  const newAnecdote = () => {
    let anecdoteIndex = 0
    anecdoteIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(anecdoteIndex);
  }

  const voteAnecdote = (selected) => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }
  
  const mostVotedAnecdote = (votes) => {
    if (votes.length === 0) {
      return -1;
    }

    let max = votes[0];
    let maxIndex = 0;

    for (let i = 0; i < votes.length; i++) {
      if (votes[i] > max) {
        maxIndex = i;
        max = votes[i];
      } 
    }

    return maxIndex;
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br></br>
      has {votes[selected]} votes
      <br></br>
      <button onClick={() => voteAnecdote(selected)}>vote</button>
      <button onClick={() => newAnecdote()}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      {anecdotes[mostVotedAnecdote(votes)]}
      <br></br>
      has {votes[mostVotedAnecdote(votes)]} votes
    </div>
  )
}

export default App