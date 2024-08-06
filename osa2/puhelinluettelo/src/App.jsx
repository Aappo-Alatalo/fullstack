import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Filter = (props) => {
  return (
    <p>
      <input
        onChange={props.handleSearchInput}
        name='searchInput'
        type='text'
        value={props.search}
      />
    </p>
  )
}

const PersonFrom = (props) => {
  return (
  <>
    <form name='nameForm'>
      <div>
        name: <input
        onChange={props.handleNameInputChange}
        type='text'
        name='nameInput'
        value={props.newName}
        />
      </div>
      <div>
        number: <input
        onChange={props.handleNumberInputChange}
        type='text'
        name='phoneNumInput'
        value={props.newNumber}
        />
      </div>
      <div>
        <button onClick={props.addPerson} type="submit">add</button>
      </div>
    </form>
  </>
  )
}

const Persons = ({ persons, search, deleteHandler }) => {
  return (
    <>
      {persons.map(person => {
        if (person.name.toLowerCase().indexOf(search) >= 0) {
          return <Person 
                    key={person.name}
                    name={person.name}
                    number={person.number}
                    deleteHandler={() => deleteHandler(person.id, person.name)}
                  />
        }
        return null;
      }
      )}
    </>
  )
}

const Person = ({ name, number, deleteHandler }) => {
  return (
    <>
      {name} {number}
      <button onClick={deleteHandler}>delete</button>
      <br></br>
    </>
  )
}

const Notification = ({ message, type}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState({ message: '', type: '' })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        if (person) {
          personService
            .update(person.id, {...person, number: newNumber})
            .then(updatedPerson => {
              setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson));
              showNotification(`Changed ${newName}'s number`, 'success')
              setNewName('');
              setNewNumber('');
            })
            .catch(error => {
              showNotification(error.response.data.error, 'error')
              // showNotification(`Information of ${name} has already been removed from server`, 'error') // Manipulated in later exercise 3.19
            });
        }
      } else {
        return;
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
  
      personService
        .create(personObject)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
          showNotification(`Added ${newName}`, 'success')
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          showNotification(error.response.data.error, 'error') // Manipulated in later exercise 3.19
        })
    }

  }

  const handleNameInputChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberInputChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchInput = (event) => {
    setSearch(event.target.value)
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: '', type: '' })
    }, 3000);
  }

  const deleteHandler = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
          showNotification(`Deleted ${name}`, 'success')
        })
        .catch(error => {
          showNotification(`Information of ${name} has already been removed from server`, 'error')
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification.message} type={notification.type} />
      <Filter handleSearchInput={handleSearchInput} search={search} />

      <h2>add a new</h2>
      <PersonFrom 
      handleNameInputChange={handleNameInputChange}
      handleNumberInputChange={handleNumberInputChange}
      newName={newName}
      newNumber={newNumber}
      addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} deleteHandler={deleteHandler} search={search} />
    </div>
  )
}

export default App