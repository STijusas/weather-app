import axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

// Put Api key
const API_KEY = 'c059ac779f7a86d3f65abddbd847ed78'
const BASE_URL = '/api/data/2.5'

const axiosInstance = axios.create({
  baseURL: BASE_URL
})
// Cache 5 minutes
const api = setupCache(axiosInstance, {
  ttl: 5 * 60 * 1000, 
  interpretHeader: false
})

export const getWeatherByCity = async (cityName) => {
  try {
    const response = await api.get('/weather', {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric'
      }
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch weather data' 
    }
  }
}

export const getWeatherByZip = async (zipCode, countryCode = 'lt') => {
  try {
    const response = await api.get('/weather', {
      params: {
        zip: `${zipCode},${countryCode}`,
        appid: API_KEY,
        units: 'metric'
      }
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch weather data' 
    }
  }
}

export const getWeatherByCoordinates = async (lat, lon) => {
  try {
    const response = await api.get('/weather', {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric'
      }
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch weather data' 
    }
  }
}

export const refreshWeatherData = async (forecast) => {
  if (forecast.coord) {
    return await getWeatherByCoordinates(forecast.coord.lat, forecast.coord.lon)
  }
  return { success: false, error: 'No coordinates available' }
}