<template>
  <div>
    
    <section class="hero is-primary">
      <div class="hero-body has-background-link">
        <div class="container">
          <h1 class="title is-1">
            <i class="fas fa-cloud-sun mr-3"></i>
            Weather Forecast App
          </h1>
          <p class="subtitle is-4">Track weather in certain places</p>
        </div>
      </div>
    </section>

    <div class="container mt-5 pb-6">
      <div class="columns">
        <div class="column is-9">
          <SearchBar
            v-model="searchQuery"
            placeholder="Search through your forecasts..."
          />
        </div>
        <div class="column is-3">
          <button 
            class="button has-background-info has-text-white is-medium is-fullwidth"
            @click="showModal = true"
          >
            <i class="fas fa-plus mr-2"></i>
            Add New Forecast
          </button>
        </div>
      </div>

      <div v-if="paginatedForecasts.length === 0" class="box has-text-centered py-6">
        <i class="fas fa-cloud-sun fa-5x has-text-grey-light mb-4"></i>
        <p class="title is-4 has-text-grey">No weather forecasts yet</p>
        <p class="subtitle is-6 has-text-grey-light">
          Click "Add New Forecast" to get started
        </p>
      </div>

      <div v-else>
        <div class="level mb-4">
          <div class="level-left">
            <div class="level-item">
              <p class="subtitle is-5">
                Showing {{ paginatedForecasts.length }} of {{ filteredForecasts.length }} forecast{{ filteredForecasts.length !== 1 ? 's' : '' }}
              </p>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button 
                class="button is-info is-light"
                @click="refreshAllForecasts"
                :class="{ 'is-loading': isRefreshing }"
                :disabled="isRefreshing"
              >
                <i class="fas fa-sync-alt mr-2"></i>
                Refresh All
              </button>
            </div>
          </div>
        </div>

        <div class="columns is-multiline">
          <div 
            v-for="forecast in paginatedForecasts" 
            :key="forecast.id"
            class="column is-12-mobile is-6-tablet is-4-desktop"
          >
            <WeatherCard 
              :weather="forecast"
              @remove="removeForecast(forecast.id)"
            />
          </div>
        </div>

        <Pagination
          v-if="totalPages > 1"
          v-model:current-page="currentPage"
          :total-pages="totalPages"
        />
      </div>
    </div>

    <AddForecastModal
      :is-active="showModal"
      @close="showModal = false"
      @add="addForecast"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import WeatherCard from './components/WeatherCard.vue'
import AddForecastModal from './components/AddForecastModal.vue'
import SearchBar from './components/SearchBar.vue'
import Notification from './components/Notification.vue'
import Pagination from './components/Pagination.vue'
import { useLocalStorage } from './composables/useLocalStorage'
import { useNotification } from './composables/useNotification'
import { refreshWeatherData } from './services/weatherApi'

const { data: forecasts } = useLocalStorage('weather-forecasts', [])
const { success, error } = useNotification()

const showModal = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10
const isRefreshing = ref(false)

let refreshInterval = null

const addForecast = (weatherData) => {
  const existingIndex = forecasts.value.findIndex(f => f.id === weatherData.id)
  
  if (existingIndex !== -1) {
    error('This location is already in your forecast list')
    return
  }

  forecasts.value.unshift(weatherData)
  currentPage.value = 1
}
const removeForecast = (id) => {
  const index = forecasts.value.findIndex(f => f.id === id)
  if (index !== -1) {
    const name = forecasts.value[index].name
    forecasts.value.splice(index, 1)
    success(`${name} removed from your forecasts`)
  }
}

const filteredForecasts = computed(() => {
  if (!searchQuery.value.trim()) {
    return forecasts.value
  }

  const query = searchQuery.value.toLowerCase()
  return forecasts.value.filter(forecast => {
    return (
      forecast.name.toLowerCase().includes(query) || forecast.sys.country.toLowerCase().includes(query) || forecast.weather[0].description.toLowerCase().includes(query)
    )
  })
})

const paginatedForecasts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredForecasts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredForecasts.value.length / pageSize)
})

const unwatchSearch = computed(() => {
  searchQuery.value
  currentPage.value = 1
  return true
})

const refreshAllForecasts = async () => {
  if (forecasts.value.length === 0) return

  isRefreshing.value = true
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < forecasts.value.length; i++) {
    const result = await refreshWeatherData(forecasts.value[i])
    if (result.success) {
      forecasts.value[i] = result.data
      successCount++
    } else {
      failCount++
    }
  }

  isRefreshing.value = false

  if (successCount > 0) {
    success(`Refreshed ${successCount} forecast${successCount !== 1 ? 's' : ''}`)
  }
  if (failCount > 0) {
    error(`Failed to refresh ${failCount} forecast${failCount !== 1 ? 's' : ''}`)
  }
}

// Refresh after 10 minutes
onMounted(() => {
  if (forecasts.value.length > 0) {
    setTimeout(() => {
      refreshAllForecasts()
    }, 1000)
  }

  refreshInterval = setInterval(() => {
    if (forecasts.value.length > 0) {
      refreshAllForecasts()
    }
  }, 10 * 60 * 1000) // 10 minutes
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>