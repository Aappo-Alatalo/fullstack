import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    message: '',
    timeoutId: null,
  }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      // Clear any existing timeout before setting a new notification
      if (state.timeoutId) {
        clearTimeout(state.timeoutId)
      }
      return {
        message: action.payload.message,
        timeoutId: action.payload.timeoutId
      }
    },
    clearNotification() {
        return { message: '', timeoutId: null }
    },
  },
})
  
export const { setNotification, clearNotification } = notificationSlice.actions

export const showNotification = (message, duration) => {
    return dispatch => {
      const timeoutId = setTimeout(() => {
        dispatch(clearNotification())
      }, duration)
  
      dispatch(setNotification({ message, timeoutId }))
    }
}

export default notificationSlice.reducer