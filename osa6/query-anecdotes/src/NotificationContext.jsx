import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
      case 'SET_NOTIFICATION':
        return action.payload
      case 'CLEAR_NOTIFICATION':
        return ''
      default:
        return state
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  /* eslint-disable react/prop-types */
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatcher = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[1]
  }

export default NotificationContext