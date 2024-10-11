import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    message: '',
    timeoutId: null,
  }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
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
  
export const { showNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message, duration) => {
    return dispatch => {
      const timeoutId = setTimeout(() => {
        dispatch(clearNotification())
      }, duration * 1000)
  
      dispatch(showNotification({ message, timeoutId }))
    }
}

export default notificationSlice.reducer