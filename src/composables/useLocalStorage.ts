import { ref, watch, Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): {
  data: Ref<T>
  save: () => void
  load: () => void
} {
  const data = ref<T>(defaultValue)

  // Load from localStorage
  const load = (): void => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        data.value = JSON.parse(stored) as T
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      data.value = defaultValue
    }
  }

  // Save to localStorage
  const save = (): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data.value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  watch(
    data,
    () => {
      save()
    },
    { deep: true }
  )

  load()

  return {
    data,
    save,
    load
  }
}
