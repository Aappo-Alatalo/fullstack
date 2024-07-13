const Part = ({ name, exercises }) => {
    return(
      <>
        <p>{name} {exercises}</p>
      </>
    )
}
  
const Content = ({ parts }) => {
    return (
        <>
        {parts.map(part => 
            <Part key={part.id} name={part.name} exercises={part.exercises} />
        )}
        </>
    )
}

const Header = (props) => {
    return(
        <>
        <h2>{props.name}</h2>
        </>
    )
}


const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)

    return (
        <>
        <p><b>total of {total} exercises</b></p>
        </>
    )
}

const Course = ({ course }) => {
    return (
        <>
        <Header name={course.name} />
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
        </>
    )
}

export default Course