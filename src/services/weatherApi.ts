import axios, { AxiosError } from 'axios'
import { setupCache } from 'axios-cache-interceptor'

// put Api key
const API_KEY = 'c059ac779f7a86d3f65abddbd847ed78'
const BASE_URL = '/api/data/2.5'

const axiosInstance = axios.create({
  baseURL: BASE_URL
})

// Cache for 5 minutes
const api = setupCache(axiosInstance, {
  ttl: 5 * 60 * 1000,
  interpretHeader: false
})

/* =====================
   Types
===================== */

export interface WeatherCoord {
  lat: number
  lon: number
}

export interface WeatherResponse {
  coord: WeatherCoord
  [key: string]: unknown
}

type ApiSuccess<T> = {
  success: true
  data: T
}

type ApiError = {
  success: false
  error: string
}

export type ApiResult<T> = ApiSuccess<T> | ApiError

/* =====================
   API calls
===================== */

export const getWeatherByCity = async (
  cityName: string
): Promise<ApiResult<WeatherResponse>> => {
  try {
    const response = await api.get<WeatherResponse>('/weather', {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric'
      }
    })

    return { success: true, data: response.data }
  } catch (error) {
    const err = error as AxiosError<any>
    return {
      success: false,
      error: err.response?.data?.message || 'Failed to fetch weather data'
    }
  }
}

export const getWeatherByZip = async (
  zipCode: string | number,
  countryCode: string = 'lt'
): Promise<ApiResult<WeatherResponse>> => {
  try {
    const response = await api.get<WeatherResponse>('/weather', {
      params: {
        zip: `${zipCode},${countryCode}`,
        appid: API_KEY,
        units: 'metric'
      }
    })

    return { success: true, data: response.data }
  } catch (error) {
    const err = error as AxiosError<any>
    return {
      success: false,
      error: err.response?.data?.message || 'Failed to fetch weather data'
    }
  }
}

export const getWeatherByCoordinates = async (
  lat: number,
  lon: number
): Promise<ApiResult<WeatherResponse>> => {
  try {
    const response = await api.get<WeatherResponse>('/weather', {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric'
      }
    })

    return { success: true, data: response.data }
  } catch (error) {
    const err = error as AxiosError<any>
    return {
      success: false,
      error: err.response?.data?.message || 'Failed to fetch weather data'
    }
  }
}

export const refreshWeatherData = async (
  forecast: WeatherResponse
): Promise<ApiResult<WeatherResponse>> => {
  if (forecast.coord) {
    return getWeatherByCoordinates(
      forecast.coord.lat,
      forecast.coord.lon
    )
  }

  return {
    success: false,
    error: 'No coordinates available'
  }
}
