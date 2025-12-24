import { ref, watch } from 'vue'

export const useLocalStorage = (key, defaultValue = []) => {
  const data = ref(defaultValue)

  // Load localStorage
  const load = () => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        data.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      data.value = defaultValue
    }
  }

  // Save localStorage
  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify(data.value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  watch(data, () => {
    save()
  }, { deep: true })

  load()

  return {
    data,
    save,
    load
  }
}