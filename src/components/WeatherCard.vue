<template>
  <div class="card weather-card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image">
            <img :src="weatherIconUrl" :alt="weather.weather[0].description" class="weather-icon-large">
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{{ weather.name }}, {{ weather.sys.country }}</p>
          <p class="subtitle is-6">{{ weather.weather[0].description }}</p>
        </div>
        <div class="media-right">
          <button class="delete is-medium delete-btn" @click="$emit('remove')"></button>
        </div>
      </div>

      <div class="content">
        <div class="columns is-mobile">
          <div class="column">
            <div class="has-text-centered">
              <p class="heading">Temperature</p>
              <p class="title is-5">{{ Math.round(weather.main.temp) }}°C</p>
            </div>
          </div>
          <div class="column">
            <div class="has-text-centered">
              <p class="heading">Feels Like</p>
              <p class="title is-5">{{ Math.round(weather.main.feels_like) }}°C</p>
            </div>
          </div>
          <div class="column">
            <div class="has-text-centered">
              <p class="heading">Humidity</p>
              <p class="title is-5">{{ weather.main.humidity }}%</p>
            </div>
          </div>
        </div>

        <div class="columns is-mobile">
          <div class="column">
            <div class="has-text-centered">
              <p class="heading">Wind Speed</p>
              <p class="title is-5">{{ weather.wind.speed }} m/s</p>
            </div>
          </div>
          <div class="column">
            <div class="has-text-centered">
              <p class="heading">Pressure</p>
              <p class="title is-5">{{ weather.main.pressure }} hPa</p>
            </div>
          </div>
        </div>

        <div class="columns is-mobile">
          <div class="column">
            <div class="has-text-centered">
              <p class="heading">
                <i class="fas fa-sunrise"></i> Sunrise
              </p>
              <p class="title is-6">{{ formatTime(weather.sys.sunrise) }}</p>
            </div>
          </div>
          <div class="column">
            <div class="has-text-centered">
              <p class="heading">
                <i class="fas fa-sunset"></i> Sunset
              </p>
              <p class="title is-6">{{ formatTime(weather.sys.sunset) }}</p>
            </div>
          </div>
        </div>

        <p class="is-size-7 has-text-grey has-text-right mt-3">
          Last updated: {{ new Date(weather.dt * 1000).toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatTime, getWeatherIconUrl } from '../utils/dateUtils'

const props = defineProps({
  weather: { type: Object, required: true }
})

defineEmits(['remove'])

const weatherIconUrl = computed(() => 
  getWeatherIconUrl(props.weather.weather[0].icon)
)
</script>