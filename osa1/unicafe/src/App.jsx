import { useState } from 'react'

const Button = (props) => {
  return (
    <>
      <button onClick={props.handleClick}>{props.text}</button>
    </>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>
        {props.text}
      </td> 
      <td>
        {props.value}
      </td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad, all}) => {
  let hasReviews = true;
  if (all === 0) {
    hasReviews = false;
  }

  return (
    <>
      <h1>Statistics</h1>
      {hasReviews ? (
      <table>
        <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="all" value={all}/>
          <StatisticLine text="average" value={(good - bad)/all}/>
          <StatisticLine text="positive" value={((good/all) * 100).toString() + " %"}/>
        </tbody>
      </table>
      ) : (
        <p>No feedback given</p>
      )} 
    </>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + bad + neutral

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={() => {setGood(good + 1)}} text="good" />
      <Button handleClick={() => {setNeutral(neutral + 1)}} text="neutral" />
      <Button handleClick={() => {setBad(bad + 1)}} text="bad" />

      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  )
}

export default App