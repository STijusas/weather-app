/**
 * Convert a Unix timestamp (seconds) to a formatted time string "HH:MM"
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * Return the URL for OpenWeather weather icon
 */
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
