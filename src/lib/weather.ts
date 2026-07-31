import { HourlyForecast, WeatherData } from '../types';
import { fetchWithCache } from './api';
import { config } from './lguConfig';

/**
 * Map OpenWeatherMap icon codes to Lucide icon names
 */
export const mapWeatherIconToLucide = (iconCode: string): string => {
  const iconMap: Record<string, string> = {
    '01d': 'Sun',
    '01n': 'Moon',
    '02d': 'CloudSun',
    '02n': 'CloudMoon',
    '03d': 'Cloud',
    '03n': 'Cloud',
    '04d': 'Cloud',
    '04n': 'Cloud',
    '09d': 'CloudDrizzle',
    '09n': 'CloudDrizzle',
    '10d': 'CloudRain',
    '10n': 'CloudRain',
    '11d': 'CloudLightning',
    '11n': 'CloudLightning',
    '13d': 'CloudSnow',
    '13n': 'CloudSnow',
    '50d': 'Cloud',
    '50n': 'Cloud',
  };
  return iconMap[iconCode] || 'Cloud';
};

/**
 * Fetch weather data for configured LGU and transform to frontend type
 */
export const fetchWeatherData = async (): Promise<WeatherData[]> => {
  try {
    const cityName = config.location.weather.defaultCity;
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    // If VITE_OPENWEATHER_API_KEY is available, fetch directly from OpenWeatherMap
    if (apiKey) {
      const [weatherRes, forecastRes] = await Promise.all([
        fetchWithCache(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`
        ),
        fetchWithCache(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`
        ),
      ]);

      const hourly: HourlyForecast[] = (forecastRes.list || [])
        .slice(0, 4)
        .map((item: { dt: number; main: { temp: number }; weather: { icon: string }[] }) => ({
          hour: new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: 'numeric',
            hour12: true,
          }),
          temp: Math.round(item.main.temp),
          temperature: Math.round(item.main.temp),
          icon: mapWeatherIconToLucide(item.weather?.[0]?.icon || '01d'),
        }));

      return [
        {
          location: weatherRes.name || config.lgu.name,
          temperature: Math.round(weatherRes.main?.temp ?? 30),
          condition: weatherRes.weather?.[0]?.description ?? 'Clear',
          humidity: weatherRes.main?.humidity ?? 75,
          windSpeed: weatherRes.wind?.speed ?? 3,
          icon: mapWeatherIconToLucide(weatherRes.weather?.[0]?.icon ?? '01d'),
          hourly,
          pressure: weatherRes.main?.pressure ?? 1012,
          visibility: Math.round((weatherRes.visibility ?? 10000) / 1000),
        },
      ];
    }

    const cityKey = config.lgu.name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/ñ/g, 'n');

    // Always fetch specific city
    let data = await fetchWithCache(
      `/api/weather?city=${encodeURIComponent(cityName)}`
    );

    // If KV is empty or city missing, fallback to update
    if (!data || Object.keys(data).length === 0) {
      data = await fetchWithCache('/api/weather?update=true');
    }

    const city =
      data[cityKey] ||
      data[config.lgu.name.toLowerCase()] ||
      data[Object.keys(data)[0]];
    if (!city) {
      throw new Error(`No weather data returned for ${config.lgu.name}`);
    }

    // Transform 3-hour forecast (first 4 entries)
    const hourly: HourlyForecast[] = (city.hourly || [])
      .slice(0, 4)
      .map((h: { dt?: number; temp?: number; icon?: string }) => ({
        hour: h.dt
          ? new Date(h.dt * 1000).toLocaleTimeString([], {
              hour: 'numeric',
              hour12: true,
            })
          : '12 PM',
        temp: Math.round(h.temp ?? 30),
        temperature: Math.round(h.temp ?? 30),
        icon: mapWeatherIconToLucide(h.icon || '01d'),
      }));

    const weatherData: WeatherData = {
      location: city.name || config.lgu.name,
      temperature: Math.round(city.main?.temp ?? 0),
      condition: city.weather?.[0]?.description ?? 'Unknown',
      humidity: city.main?.humidity ?? 0,
      windSpeed: city.wind?.speed ?? 0,
      icon: mapWeatherIconToLucide(city.weather?.[0]?.icon ?? '01d'),
      hourly,
      pressure: city.main?.pressure ?? 0,
      visibility: Math.round((city.visibility ?? 0) / 1000),
    };

    return [weatherData];
  } catch (err) {
    console.warn('Weather API failed, using fallback data:', err);
    return [
      {
        location: config.lgu.name,
        temperature: 30,
        condition: 'Partly Cloudy',
        humidity: 78,
        windSpeed: 3.5,
        icon: 'CloudSun',
        hourly: [
          { hour: '12 PM', temp: 30, temperature: 30, icon: 'Sun' },
          { hour: '3 PM', temp: 31, temperature: 31, icon: 'Sun' },
          { hour: '6 PM', temp: 29, temperature: 29, icon: 'CloudSun' },
          { hour: '9 PM', temp: 27, temperature: 27, icon: 'Moon' },
        ],
        pressure: 1012,
        visibility: 10,
      },
    ];
  }
};
