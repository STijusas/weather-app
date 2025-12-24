import { ref, Ref } from 'vue'

type NotificationType = 'success' | 'danger' | 'info' | 'warning'

interface Notification {
  id: number
  message: string
  type: NotificationType
}

const notifications: Ref<Notification[]> = ref([])
let nextId = 0

export const useNotification = () => {
  const addNotification = (
    message: string,
    type: NotificationType = 'info',
    duration: number = 4000
  ): void => {
    const id = nextId++
    notifications.value.push({ id, message, type })

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration)
    }
  }

  const removeNotification = (id: number): void => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number): void =>
    addNotification(message, 'success', duration)

  const error = (message: string, duration?: number): void =>
    addNotification(message, 'danger', duration)

  const info = (message: string, duration?: number): void =>
    addNotification(message, 'info', duration)

  const warning = (message: string, duration?: number): void =>
    addNotification(message, 'warning', duration)

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning
  }
}
