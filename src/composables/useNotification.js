import { ref } from 'vue'

const notifications = ref([])
let nextId = 0

export const useNotification = () => {
  
  const addNotification = (message, type = 'info', duration = 4000) => {
    const id = nextId++
    notifications.value.push({ id, message, type })
    
    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration)
    }
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message, duration) => addNotification(message, 'success', duration)
  const error = (message, duration) => addNotification(message, 'danger', duration)
  const info = (message, duration) => addNotification(message, 'info', duration)
  const warning = (message, duration) => addNotification(message, 'warning', duration)

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