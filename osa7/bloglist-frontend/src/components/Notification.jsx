import { useNotificationValue } from "../contexts/NotificationContext"

const Notification = () => {
  const notification = useNotificationValue()
  const message = notification.text
  const type = notification.type
  if (message === null || type === null) {
    return null
  }

  return <div className={type}>{message}</div>
}

export default Notification
