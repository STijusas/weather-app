<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="$emit('close')"></div>
    <div class="modal-card">
        <Notification/>
      <header class="modal-card-head">
        <p class="modal-card-title">Add Weather Forecast</p>
        <button class="delete" @click="$emit('close')"></button>
      </header>
      <section class="modal-card-body">
        <div class="tabs is-boxed">
          <ul>
            <li :class="{ 'is-active': searchType === 'city' }" @click="searchType = 'city'">
              <a><i class="fas fa-city mr-2"></i>City</a>
            </li>
            <li :class="{ 'is-active': searchType === 'zip' }" @click="searchType = 'zip'">
              <a><i class="fas fa-map-pin mr-2"></i>ZIP Code</a>
            </li>
            <li :class="{ 'is-active': searchType === 'coords' }" @click="searchType = 'coords'">
              <a><i class="fas fa-globe mr-2"></i>Coordinates</a>
            </li>
          </ul>
        </div>

        <div v-if="searchType === 'city'" class="box">
          <div class="field">
            <label class="label">City Name</label>
            <div class="control has-icons-left">
              <input
                v-model="cityName"
                class="input"
                type="text"
                placeholder="e.g., London, Paris, New York"
                @keyup.enter="handleSearch"
              />
              <span class="icon is-left">
                <i class="fas fa-city"></i>
              </span>
            </div>
          </div>
        </div>

        <div v-if="searchType === 'zip'" class="box">
          <div class="field">
            <label class="label">ZIP Code</label>
            <div class="control has-icons-left">
              <input
                v-model="zipCode"
                class="input"
                type="text"
                placeholder="e.g., 10001"
                @keyup.enter="handleSearch"
              />
              <span class="icon is-left">
                <i class="fas fa-map-pin"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">Country Code (Optional)</label>
            <div class="control">
              <input
                v-model="countryCode"
                class="input"
                type="text"
                placeholder="e.g., us, uk, de"
                maxlength="2"
                @keyup.enter="handleSearch"
              />
            </div>
          </div>
        </div>

        <div v-if="searchType === 'coords'" class="box">
          <div class="field">
            <label class="label">Latitude</label>
            <div class="control">
              <input
                v-model="latitude"
                class="input"
                type="number"
                step="any"
                placeholder="e.g., 51.5074"
                @keyup.enter="handleSearch"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Longitude</label>
            <div class="control">
              <input
                v-model="longitude"
                class="input"
                type="number"
                step="any"
                placeholder="e.g., -0.1278"
                @keyup.enter="handleSearch"
              />
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="has-text-centered py-5">
          <button class="button is-loading is-large is-text"></button>
          <p class="mt-3">Fetching weather data...</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button 
          class="button has-background-info has-text-white" 
          @click="handleSearch"
          :class="{ 'is-loading': isLoading }"
          :disabled="isLoading || !canSearch"
        >
          <i class="fas fa-plus mr-2"></i>
          Add Forecast
        </button>
        <button class="button" @click="$emit('close')">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getWeatherByCity, getWeatherByZip, getWeatherByCoordinates } from '../services/weatherApi'
import { useNotification } from '../composables/useNotification'
import Notification from './Notification.vue'

const props = defineProps({
  isActive: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'add'])
const { success, error } = useNotification()

const searchType = ref('city')
const cityName = ref('')
const zipCode = ref('')
const countryCode = ref('lt')
const latitude = ref('')
const longitude = ref('')
const isLoading = ref(false)

const canSearch = computed(() => {
  if (searchType.value === 'city') return cityName.value.trim() !== ''

  if (searchType.value === 'zip') return zipCode.value.trim() !== ''

  if (searchType.value === 'coords') return latitude.value !== '' && longitude.value !== ''
  return false
})

const handleSearch = async () => {
  if (!canSearch.value || isLoading.value) return

  isLoading.value = true
  let result

  try {
    if (searchType.value === 'city') {
      result = await getWeatherByCity(cityName.value)
    } else if (searchType.value === 'zip') {
      result = await getWeatherByZip(zipCode.value, countryCode.value)
    } else if (searchType.value === 'coords') {
      result = await getWeatherByCoordinates(
        parseFloat(latitude.value),
        parseFloat(longitude.value)
      )
    }

    if (result.success) {
      emit('add', result.data)
      success(`Weather forecast for ${result.data.name} added successfully!`)
      resetForm()
      emit('close')
    } else {
      error(result.error || 'Failed to fetch weather data')
    }
  } catch (err) {
    error('An unexpected error occurred')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  cityName.value = ''
  zipCode.value = ''
  countryCode.value = 'lt'
  latitude.value = ''
  longitude.value = ''
  searchType.value = 'city'
}
</script>