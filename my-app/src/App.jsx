import React, { useState, useEffect } from 'react';
import './App.css';

// Note: Add this to your App.css file:
/*
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
*/

const WeatherApp = () => {
  const [currentPage, setCurrentPage] = useState('main');
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [city, setCity] = useState('Philadelphia');
  const [backgroundGradient, setBackgroundGradient] = useState(
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  );

  // Function to determine the appropriate gradient based on weather conditions
  const getWeatherGradient = (weatherDesc, icon, temp) => {
    const desc = weatherDesc?.toLowerCase() || '';
    const isNight = icon?.includes('n'); // Icons with 'n' are nighttime
    
    // Night conditions
    if (isNight) {
      if (desc.includes('clear')) {
        return 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'; // Deep night blue
      }
      if (desc.includes('rain') || desc.includes('drizzle')) {
        return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'; // Dark rainy night
      }
      if (desc.includes('cloud')) {
        return 'linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #2980b9 100%)'; // Cloudy night
      }
      if (desc.includes('snow')) {
        return 'linear-gradient(135deg, #373b44 0%, #4a5568 50%, #718096 100%)'; // Snowy night
      }
      if (desc.includes('thunder') || desc.includes('storm')) {
        return 'linear-gradient(135deg, #141e30 0%, #243b55 50%, #1a1a2e 100%)'; // Stormy night
      }
      return 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)'; // Default night
    }
    
    // Day conditions
    if (desc.includes('clear') || desc.includes('sunny')) {
      if (temp > 85) {
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ff6b6b 100%)'; // Hot sunny
      }
      return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)'; // Perfect sunny
    }
    
    if (desc.includes('rain') || desc.includes('drizzle')) {
      if (desc.includes('thunder') || desc.includes('storm')) {
        return 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #596275 100%)'; // Stormy
      }
      return 'linear-gradient(135deg, #5f72bd 0%, #9b23ea 50%, #667eea 100%)'; // Rainy
    }
    
    if (desc.includes('cloud')) {
      if (desc.includes('partly') || desc.includes('few')) {
        return 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 50%, #fbc2eb 100%)'; // Partly cloudy
      }
      return 'linear-gradient(135deg, #bdc3c7 0%, #8e9eab 50%, #7f8c9d 100%)'; // Overcast
    }
    
    if (desc.includes('snow')) {
      return 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 50%, #a8c0ff 100%)'; // Snowy
    }
    
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) {
      return 'linear-gradient(135deg, #bdc3c7 0%, #b8c6db 50%, #d8e2dc 100%)'; // Foggy
    }
    
    // Default fallback
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; // Original purple
  };

  // Update background gradient when weather info changes
  useEffect(() => {
    if (weatherInfo) {
      const gradient = getWeatherGradient(
        weatherInfo.desc,
        weatherInfo.icon,
        weatherInfo.temp
      );
      setBackgroundGradient(gradient);
    }
  }, [weatherInfo]);

  const getIconFromCode = (code) => {
    const mapping = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '🌤️',
      '02n': '☁️',
      '03d': '⛅',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    return mapping[code] || '⛅';
  };

  const formatText = (text) => {
    if (!text) return '';
    return text
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const formatWithOffset = (timestamp, offset, options = { hour: 'numeric', minute: '2-digit' }) => {
    if (timestamp === undefined || timestamp === null) return '--';
    const adjusted = new Date((timestamp + (offset || 0)) * 1000);
    return adjusted.toLocaleTimeString('en-US', { timeZone: 'UTC', ...options });
  };

  const formatHour = (timestamp, offset) => formatWithOffset(timestamp, offset, { hour: 'numeric' });

  const formatDay = (timestamp, offset, index) => {
    if (index === 0) return 'Today';
    if (timestamp === undefined || timestamp === null) return '--';
    const adjusted = new Date((timestamp + (offset || 0)) * 1000);
    return adjusted.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long' });
  };

  useEffect(() => {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 100 + 50 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = Math.random() * 10 + 15 + 's';
        particlesContainer.appendChild(particle);
      }
    }
  }, []);

  // Fetch weather for a given city (declared as function so it can be called from the UI)
  async function fetchWeather(cityToFetch = city) {
    const apiKey = process.env.REACT_APP_WEATHER_KEY;
    if (!apiKey) {
      setError('Missing API key');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityToFetch)}&units=imperial&appid=${apiKey}`);
      if (!currentResponse.ok) {
        throw new Error('current');
      }
      const currentJson = await currentResponse.json();
      const { coord = {}, name, sys = {}, timezone: currentOffset = 0, weather = [], main = {}, wind = {}, visibility } = currentJson;
      const { lat, lon } = coord;
      let offset = currentOffset || 0;
      let hourly = [];
      let daily = [];
      let currentIconCode = weather?.[0]?.icon;
      let currentDesc = weather?.[0]?.description;
      let tempValue = main?.temp;
      let feelsLikeValue = main?.feels_like;
      let humidityValue = main?.humidity;
      let windValue = wind?.speed;
      let visibilityValue = visibility;
      let pressureValue = main?.pressure;
      let sunriseValue = sys?.sunrise;
      let sunsetValue = sys?.sunset;
      let highValue = main?.temp_max;
      let lowValue = main?.temp_min;
      let uvValue = null;

      if (lat !== undefined && lon !== undefined) {
        try {
          const oneCallResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&units=imperial&appid=${apiKey}`);
          if (oneCallResponse.ok) {
            const oneCallJson = await oneCallResponse.json();
            offset = oneCallJson.timezone_offset !== undefined && oneCallJson.timezone_offset !== null ? oneCallJson.timezone_offset : offset;
            const hourlyEntries = Array.isArray(oneCallJson.hourly) ? oneCallJson.hourly.slice(0, 24) : [];
            if (hourlyEntries.length) {
              hourly = hourlyEntries.map((entry, index) => ({
                time: formatHour(entry.dt, offset),
                icon: getIconFromCode(entry.weather?.[0]?.icon),
                temp: entry.temp !== undefined && entry.temp !== null ? Math.round(entry.temp) : null,
                desc: formatText(entry.weather?.[0]?.description),
                feelsLike: entry.feels_like !== undefined && entry.feels_like !== null ? Math.round(entry.feels_like) : null,
                humidity: entry.humidity,
                wind: entry.wind_speed !== undefined && entry.wind_speed !== null ? Math.round(entry.wind_speed) : null,
                precipitation: entry.pop !== undefined && entry.pop !== null ? Math.round(entry.pop * 100) : null,
                uvIndex: entry.uvi !== undefined && entry.uvi !== null ? Math.round(entry.uvi * 10) / 10 : null,
                visibility: entry.visibility !== undefined && entry.visibility !== null ? `${Math.round((entry.visibility / 1609.34) * 10) / 10} mi` : '--',
                index
              }));
              const currentUv = oneCallJson.current?.uvi;
              if (currentUv !== undefined && currentUv !== null) {
                uvValue = Math.round(currentUv * 10) / 10;
              } else if (hourlyEntries[0] && hourlyEntries[0].uvi !== undefined && hourlyEntries[0].uvi !== null) {
                uvValue = Math.round(hourlyEntries[0].uvi * 10) / 10;
              }
            }
          }
        } catch (e) {
          console.warn('One Call fetch failed', e);
        }

        try {
          const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`);
          if (forecastResponse.ok) {
            const forecastJson = await forecastResponse.json();
            offset = forecastJson.city && forecastJson.city.timezone !== undefined && forecastJson.city.timezone !== null ? forecastJson.city.timezone : offset;
            const list = forecastJson.list || [];

            if (!hourly.length) {
              hourly = list.slice(0, 24).map((entry, index) => ({
                time: formatHour(entry.dt, offset),
                icon: getIconFromCode(entry.weather?.[0]?.icon),
                temp: entry.main?.temp !== undefined && entry.main?.temp !== null ? Math.round(entry.main.temp) : null,
                desc: formatText(entry.weather?.[0]?.description),
                feelsLike: entry.main?.feels_like !== undefined && entry.main?.feels_like !== null ? Math.round(entry.main.feels_like) : null,
                humidity: entry.main?.humidity,
                wind: entry.wind?.speed !== undefined && entry.wind?.speed !== null ? Math.round(entry.wind.speed) : null,
                precipitation: Math.round((entry.pop || 0) * 100),
                uvIndex: null,
                visibility: entry.visibility !== undefined && entry.visibility !== null ? `${Math.round((entry.visibility / 1609.34) * 10) / 10} mi` : '--',
                index
              }));
            }

            const daysMap = {};
            list.forEach((entry) => {
              const dayKey = new Date((entry.dt + (offset || 0)) * 1000).toISOString().slice(0, 10);
              if (!daysMap[dayKey]) {
                daysMap[dayKey] = { high: entry.main?.temp_max, low: entry.main?.temp_min, icon: entry.weather?.[0]?.icon, desc: entry.weather?.[0]?.description };
              } else {
                daysMap[dayKey].high = Math.max(daysMap[dayKey].high, entry.main?.temp_max);
                daysMap[dayKey].low = Math.min(daysMap[dayKey].low, entry.main?.temp_min);
              }
            });
            const dayKeys = Object.keys(daysMap).slice(0, 7);
            daily = dayKeys.map((dayKey, index) => {
              const d = daysMap[dayKey];
              return {
                day: index === 0 ? 'Today' : new Date(dayKey).toLocaleDateString('en-US', { weekday: 'long' }),
                icon: getIconFromCode(d.icon),
                high: d.high !== undefined ? Math.round(d.high) : null,
                low: d.low !== undefined ? Math.round(d.low) : null,
                desc: formatText(d.desc),
                humidity: null,
                wind: null,
                uvIndex: null,
                precipitation: null
              };
            });
          }
        } catch (e) {
          console.warn('Forecast fetch failed', e);
        }
      }

      const visibilityMiles = visibilityValue !== undefined && visibilityValue !== null ? Math.round((visibilityValue / 1609.34) * 10) / 10 : null;
      const pressureInHg = pressureValue !== undefined && pressureValue !== null ? Math.round(pressureValue * 0.02953 * 10) / 10 : null;

      setWeatherInfo({
        city: name && sys?.country ? `${name}, ${sys.country}` : name || 'Unknown',
        icon: getIconFromCode(currentIconCode),
        temp: tempValue !== undefined && tempValue !== null ? Math.round(tempValue) : null,
        desc: formatText(currentDesc),
        high: highValue !== undefined && highValue !== null ? Math.round(highValue) : null,
        low: lowValue !== undefined && lowValue !== null ? Math.round(lowValue) : null,
        humidity: humidityValue,
        wind: windValue !== undefined && windValue !== null ? Math.round(windValue) : null,
        feelsLike: feelsLikeValue !== undefined && feelsLikeValue !== null ? Math.round(feelsLikeValue) : null,
        uvIndex: uvValue,
        visibility: visibilityMiles !== null ? `${visibilityMiles} mi` : '--',
        pressure: pressureInHg !== null ? `${pressureInHg} in` : '--',
        sunrise: formatWithOffset(sunriseValue, offset),
        sunset: formatWithOffset(sunsetValue, offset)
      });
      setHourlyData(hourly);
      setDailyData(daily);
    } catch (err) {
      setError('Unable to load weather data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    fetchWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const WeatherAnimation = ({ icon, containerId }) => {
    useEffect(() => {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      container.innerHTML = '';
      
      switch(icon) {
        case '🌧️':
          for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(drop);
          }
          break;
        case '⛈️':
          for (let i = 0; i < 60; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 0.3 + 0.3) + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(drop);
          }
          const lightning = document.createElement('div');
          lightning.className = 'lightning';
          container.appendChild(lightning);
          break;
        case '☀️':
          const sunRays = document.createElement('div');
          sunRays.className = 'sun-rays';
          for (let i = 0; i < 12; i++) {
            const ray = document.createElement('div');
            ray.className = 'sun-ray';
            ray.style.transform = `rotate(${i * 30}deg)`;
            sunRays.appendChild(ray);
          }
          container.appendChild(sunRays);
          break;
        case '⛅':
        case '🌤️':
        case '🌥️':
          for (let i = 0; i < 3; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.width = (Math.random() * 100 + 80) + 'px';
            cloud.style.height = (Math.random() * 40 + 30) + 'px';
            cloud.style.top = (Math.random() * 60 + 10) + '%';
            cloud.style.animationDuration = (Math.random() * 20 + 15) + 's';
            cloud.style.animationDelay = (i * 5) + 's';
            container.appendChild(cloud);
          }
          break;
      }
    }, [icon, containerId]);

    return <div id={containerId} className="weather-animation"></div>;
  };

  const MainPage = () => {
    if (!weatherInfo) return null;

    const humidityPercent = weatherInfo.humidity !== undefined && weatherInfo.humidity !== null ? weatherInfo.humidity : null;
    const uvValue = weatherInfo.uvIndex !== undefined && weatherInfo.uvIndex !== null ? weatherInfo.uvIndex : null;
    const uvPercent = uvValue !== null ? (Math.min(uvValue, 11) / 11) * 100 : 0;

    return (
      <div className="main-page">
        <div className="header">
          <button className="icon-btn">☰</button>
          <div className="location">
            <span>📍</span>
            <span>{weatherInfo?.city || city}</span>
          </div>

          <div className="search-form-container">
            <div className="search-form">
              <input
                className="city-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchWeather(city);
                    setCurrentPage('main');
                  }
                }}
                placeholder="Enter city"
                aria-label="City"
              />
              <button 
                onClick={() => {
                  fetchWeather(city);
                  setCurrentPage('main');
                }}
                className="search-btn"
              >
                Search
              </button>
            </div>
          </div>

          <div className="icon-group">
            <button className="icon-btn" onClick={() => fetchWeather(city)}>🔍</button>
            <button className="icon-btn" onClick={() => alert('Settings')}>⚙️</button>
          </div>
        </div>

        <div className="main-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="card current-weather">
              <div className="weather-icon-large">{weatherInfo.icon}</div>
              <div className="temp-display">{weatherInfo.temp !== null && weatherInfo.temp !== undefined ? `${weatherInfo.temp}°` : '--'}</div>
              <div className="description">{weatherInfo.desc || '--'}</div>
              <div className="high-low">H: {weatherInfo.high !== null && weatherInfo.high !== undefined ? `${weatherInfo.high}°` : '--'} L: {weatherInfo.low !== null && weatherInfo.low !== undefined ? `${weatherInfo.low}°` : '--'}</div>
            </div>

            <div className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div className="section-title">7-Day Forecast</div>
                <button className="search-btn" onClick={() => setCurrentPage('daily-full')}>View All</button>
              </div>
              <div className="forecast-grid">
                {dailyData.length ? (
                  dailyData.map((day, index) => (
                    <div
                      key={index}
                      className="forecast-item"
                      onClick={() => {
                        setSelectedDay(day);
                        setCurrentPage('day-detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="forecast-day">{day.day}</div>
                      <div className="forecast-icon">{day.icon}</div>
                      <div className="forecast-temps">{day.high !== undefined && day.high !== null ? `${day.high}°` : '--'} / {day.low !== undefined && day.low !== null ? `${day.low}°` : '--'}</div>
                    </div>
                  ))
                ) : (
                  <div className="forecast-item">
                    <div className="forecast-day">Forecast</div>
                    <div className="forecast-icon">--</div>
                    <div className="forecast-temps">Unavailable</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div className="section-title">Hourly Forecast</div>
                <button className="search-btn" onClick={() => setCurrentPage('hourly-full')}>View All</button>
              </div>
              <div className="hourly-scroll">
                {hourlyData.length ? (
                  hourlyData.map((hour) => (
                    <div
                      key={hour.index}
                      className="hourly-item"
                      onClick={() => {
                        setSelectedHour(hour);
                        setCurrentPage('hourly-detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="hour">{hour.time}</div>
                      <div className="hourly-icon">{hour.icon}</div>
                      <div className="hourly-temp">{hour.temp !== undefined && hour.temp !== null ? `${hour.temp}°` : '--'}</div>
                    </div>
                  ))
                ) : (
                  <div className="hourly-item">
                    <div className="hour">--</div>
                    <div className="hourly-icon">⛅</div>
                    <div className="hourly-temp">--</div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="section-title">Weather Details</div>
              <div className="details-grid">
                <div className="detail-box">
                  <div className="detail-icon">💧</div>
                  <div className="detail-label">Humidity</div>
                  <div className="detail-value">{humidityPercent !== null ? `${humidityPercent}%` : '--'}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${humidityPercent !== null ? humidityPercent : 0}%` }}></div>
                  </div>
                </div>
                <div className="detail-box">
                  <div className="detail-icon">💨</div>
                  <div className="detail-label">Wind Speed</div>
                  <div className="detail-value">{weatherInfo.wind !== null && weatherInfo.wind !== undefined ? `${weatherInfo.wind} mph` : '--'}</div>
                </div>
                <div className="detail-box">
                  <div className="detail-icon">🌡️</div>
                  <div className="detail-label">Feels Like</div>
                  <div className="detail-value">{weatherInfo.feelsLike !== null && weatherInfo.feelsLike !== undefined ? `${weatherInfo.feelsLike}°` : '--'}</div>
                </div>
                <div className="detail-box">
                  <div className="detail-icon">☀️</div>
                  <div className="detail-label">UV Index</div>
                  <div className="detail-value">{uvValue !== null ? uvValue : '--'}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uvPercent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="details-grid">
                <div className="detail-box">
                  <div className="detail-icon">👁️</div>
                  <div className="detail-label">Visibility</div>
                  <div className="detail-value">{weatherInfo.visibility || '--'}</div>
                </div>
                <div className="detail-box">
                  <div className="detail-icon">🎚️</div>
                  <div className="detail-label">Pressure</div>
                  <div className="detail-value">{weatherInfo.pressure || '--'}</div>
                </div>
                <div className="detail-box">
                  <div className="detail-icon">🌅</div>
                  <div className="detail-label">Sunrise</div>
                  <div className="detail-value">{weatherInfo.sunrise || '--'}</div>
                </div>
                <div className="detail-box">
                  <div className="detail-icon">🌇</div>
                  <div className="detail-label">Sunset</div>
                  <div className="detail-value">{weatherInfo.sunset || '--'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HourlyDetailPage = () => {
    if (!selectedHour) return null;

    const feelsLike = selectedHour.feelsLike !== undefined && selectedHour.feelsLike !== null ? selectedHour.feelsLike : selectedHour.temp;
    const humidity = selectedHour.humidity !== undefined && selectedHour.humidity !== null ? selectedHour.humidity : null;
    const wind = selectedHour.wind !== undefined && selectedHour.wind !== null ? selectedHour.wind : null;
    const precipitation = selectedHour.precipitation !== undefined && selectedHour.precipitation !== null ? selectedHour.precipitation : null;
    const uvIndex = selectedHour.uvIndex !== undefined && selectedHour.uvIndex !== null
      ? selectedHour.uvIndex
      : weatherInfo && weatherInfo.uvIndex !== undefined && weatherInfo.uvIndex !== null
        ? weatherInfo.uvIndex
        : null;
    const visibility = selectedHour.visibility || weatherInfo?.visibility || '--';
    const timelineItems = [selectedHour.index - 1, selectedHour.index, selectedHour.index + 1, selectedHour.index + 2]
      .map((idx) => hourlyData[idx])
      .filter(Boolean);

    return (
      <div className="detail-page">
        <button className="back-button" onClick={() => setCurrentPage('main')}>
          ← Back to Overview
        </button>

        <div className="detail-hero">
          <WeatherAnimation icon={selectedHour.icon} containerId="hourlyWeatherAnimation" />
          <div className="detail-hero-icon">{selectedHour.icon}</div>
          <div className="detail-hero-time">{selectedHour.time}</div>
          <div className="detail-hero-temp">{selectedHour.temp !== undefined && selectedHour.temp !== null ? `${selectedHour.temp}°` : '--'}</div>
          <div className="detail-hero-desc">{selectedHour.desc}</div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-icon">🌡️</div>
            <div className="info-card-title">Feels Like</div>
            <div className="info-card-value">{feelsLike !== undefined && feelsLike !== null ? `${feelsLike}°` : '--'}</div>
            <div className="info-card-desc">Actual temperature feels slightly different due to humidity and wind</div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">💧</div>
            <div className="info-card-title">Humidity</div>
            <div className="info-card-value">{humidity !== null ? `${humidity}%` : '--'}</div>
            <div className="info-card-desc">Relative humidity for this hour</div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">💨</div>
            <div className="info-card-title">Wind</div>
            <div className="info-card-value">{wind !== null ? `${wind} mph` : '--'}</div>
            <div className="info-card-desc">Wind speed based on hourly forecast</div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">🌧️</div>
            <div className="info-card-title">Precipitation</div>
            <div className="info-card-value">{precipitation !== null ? `${precipitation}%` : '--'}</div>
            <div className="info-card-desc">Probability of precipitation for this hour</div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">☀️</div>
            <div className="info-card-title">UV Index</div>
            <div className="info-card-value">{uvIndex !== null ? uvIndex : '--'}</div>
            <div className="info-card-desc">UV intensity for the selected hour</div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">👁️</div>
            <div className="info-card-title">Visibility</div>
            <div className="info-card-value">{visibility}</div>
            <div className="info-card-desc">Estimated visibility range</div>
          </div>
        </div>

        <div className="timeline-card">
          <div className="timeline-title">Surrounding Hours</div>
          {timelineItems.length ? (
            timelineItems.map((item) => {
              const isCurrent = item.index === selectedHour.index;
              return (
                <div
                  key={item.index}
                  className="timeline-item"
                  style={isCurrent ? { background: 'rgba(255, 255, 255, 0.25)', border: '2px solid rgba(255, 255, 255, 0.4)' } : {}}
                >
                  <div className="timeline-time">{item.time}</div>
                  <div className="timeline-icon">{item.icon}</div>
                  <div className="timeline-info">
                    <div className="timeline-temp">{item.temp !== undefined && item.temp !== null ? `${item.temp}°` : '--'}</div>
                    <div className="timeline-desc">{isCurrent ? `${item.desc} (Current)` : item.desc}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="timeline-item">
              <div className="timeline-time">--</div>
              <div className="timeline-icon">⛅</div>
              <div className="timeline-info">
                <div className="timeline-temp">--</div>
                <div className="timeline-desc">Unavailable</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DayDetailPage = () => {
    if (!selectedDay) return null;

    const descriptionText = selectedDay.desc || '';

    const getOutfitRecommendations = () => {
      const { desc, high, low } = selectedDay;
      
      if (desc.includes('Rain') || desc.includes('Thunderstorm')) {
        return {
          outfits: [
            { icon: '🧥', name: 'Rain Jacket', desc: 'Waterproof essential' },
            { icon: '🥾', name: 'Waterproof Boots', desc: 'Keep feet dry' },
            { icon: '☂️', name: 'Umbrella', desc: 'Stay protected' },
            { icon: '👖', name: 'Long Pants', desc: 'Full coverage' }
          ],
          tips: [
            { icon: '💧', text: 'Bring a waterproof bag to protect your electronics and valuables' },
            { icon: '🌂', text: 'Layer your clothing in case it gets chilly with the rain' },
            { icon: '👟', text: 'Avoid suede or canvas shoes - opt for waterproof footwear' }
          ]
        };
      } else if (high > 75) {
        return {
          outfits: [
            { icon: '👕', name: 'Light T-Shirt', desc: 'Breathable fabric' },
            { icon: '🩳', name: 'Shorts', desc: 'Stay cool' },
            { icon: '🕶️', name: 'Sunglasses', desc: 'UV protection' },
            { icon: '🧢', name: 'Hat/Cap', desc: 'Sun protection' },
            { icon: '👟', name: 'Sneakers', desc: 'Comfortable walking' },
            { icon: '🧴', name: 'Sunscreen', desc: 'SPF 30+' }
          ],
          tips: [
            { icon: '☀️', text: 'Choose light colors to reflect heat and keep cool' },
            { icon: '💦', text: 'Wear breathable, moisture-wicking fabrics like cotton or linen' },
            { icon: '🌡️', text: 'Apply sunscreen 30 minutes before going outside and reapply every 2 hours' }
          ]
        };
      } else if (high > 60) {
        return {
          outfits: [
            { icon: '👕', name: 'Long Sleeve Shirt', desc: 'Comfortable layer' },
            { icon: '👖', name: 'Jeans', desc: 'Versatile choice' },
            { icon: '🧥', name: 'Light Jacket', desc: 'Easy to remove' },
            { icon: '👟', name: 'Sneakers', desc: 'All-day comfort' }
          ],
          tips: [
            { icon: '🌤️', text: 'Perfect weather for layering - easy to adjust as temperature changes' },
            { icon: '👔', text: 'A light jacket or cardigan is perfect for morning and evening' },
            { icon: '🎒', text: 'Bring a layer you can easily tie around your waist if it warms up' }
          ]
        };
      } else {
        return {
          outfits: [
            { icon: '🧥', name: 'Warm Jacket', desc: 'Essential layer' },
            { icon: '👖', name: 'Long Pants', desc: 'Full coverage' },
            { icon: '🧣', name: 'Scarf', desc: 'Extra warmth' },
            { icon: '🧤', name: 'Light Gloves', desc: 'Hand protection' }
          ],
          tips: [
            { icon: '🥶', text: 'Layer your clothing for better insulation and flexibility' },
            { icon: '🧊', text: 'Wear a windbreaker as your outer layer to block cold air' },
            { icon: '🌬️', text: 'Cover exposed skin to prevent wind chill effects' }
          ]
        };
      }
    };

    const getActivities = () => {
      const { desc, high } = selectedDay;
      
      if (desc.includes('Sunny') && high > 70) {
        return [
          { name: '🏖️ Beach Day', recommended: true },
          { name: '🚴 Cycling', recommended: true },
          { name: '⚽ Outdoor Sports', recommended: true },
          { name: '🎾 Tennis', recommended: true },
          { name: '🏃 Running', recommended: true },
          { name: '🧘 Outdoor Yoga', recommended: true },
          { name: '🎣 Fishing', recommended: true }
        ];
      } else if (desc.includes('Rain') || desc.includes('Thunderstorm')) {
        return [
          { name: '🎬 Movie Theater', recommended: true },
          { name: '🎨 Museum Visit', recommended: true },
          { name: '📚 Library/Reading', recommended: true },
          { name: '🎳 Bowling', recommended: true },
          { name: '☕ Cozy Café', recommended: true },
          { name: '🏃 Outdoor Run', recommended: false },
          { name: '⛳ Golf', recommended: false }
        ];
      } else if (desc.includes('Cloudy')) {
        return [
          { name: '🚶 Walking/Hiking', recommended: true },
          { name: '📸 Photography', recommended: true },
          { name: '🛍️ Shopping', recommended: true },
          { name: '🏃 Jogging', recommended: true },
          { name: '🚴 Biking', recommended: true }
        ];
      } else {
        return [
          { name: '🎭 Theater', recommended: true },
          { name: '🍽️ Dining Out', recommended: true },
          { name: '🎪 Events', recommended: true },
          { name: '🚶 City Walk', recommended: true }
        ];
      }
    };

    const { outfits, tips } = getOutfitRecommendations();
    const activities = getActivities();

    const precipChance = selectedDay.precipitation !== undefined && selectedDay.precipitation !== null
      ? `${selectedDay.precipitation}%`
      : descriptionText.includes('Rain') ? '80%' : descriptionText.includes('Thunderstorm') ? '90%' : descriptionText.includes('Sunny') ? '5%' : '20%';
    const uvIndex = selectedDay.uvIndex !== undefined && selectedDay.uvIndex !== null
      ? selectedDay.uvIndex
      : descriptionText.includes('Sunny') ? '7' : '4';
    const windValue = selectedDay.wind !== undefined && selectedDay.wind !== null ? `${selectedDay.wind} mph` : '8-12 mph';
    const uvNumeric = typeof uvIndex === 'number' ? uvIndex : Number(uvIndex);
    const uvDescription = Number.isFinite(uvNumeric)
      ? uvNumeric >= 6
        ? 'High UV levels - sunscreen recommended'
        : uvNumeric >= 3
          ? 'Moderate UV levels - sunscreen suggested'
          : 'Low UV levels'
      : 'UV data unavailable';
    const precipDescription = selectedDay.precipitation !== undefined && selectedDay.precipitation !== null
      ? selectedDay.precipitation >= 60
        ? 'Expect periods of rain throughout the day'
        : selectedDay.precipitation >= 30
          ? 'Spotty showers possible'
          : 'Low chance of rain, mostly dry conditions'
      : descriptionText.includes('Thunderstorm')
        ? 'Expect heavy rain and storms'
        : descriptionText.includes('Rain')
          ? 'High chance of rain throughout the day'
          : descriptionText.includes('Sunny')
            ? 'Clear skies all day'
            : 'Slight chance of light rain';

    return (
      <div className="day-detail-page">
        <button className="back-button" onClick={() => setCurrentPage('main')}>
          ← Back to Overview
        </button>

        <div className="day-hero">
          <WeatherAnimation icon={selectedDay.icon} containerId="dayWeatherAnimation" />
          <div className="day-hero-icon">{selectedDay.icon}</div>
          <div className="day-hero-title">{selectedDay.day}</div>
          <div className="day-hero-temps">High: {selectedDay.high}° / Low: {selectedDay.low}°</div>
          <div className="day-hero-desc">{selectedDay.desc}</div>
        </div>

        <div className="outfit-section">
          <div className="outfit-title">
            <span>👔</span>
            <span>What to Wear</span>
          </div>
          <div className="outfit-grid">
            {outfits.map((outfit, index) => (
              <div key={index} className="outfit-item">
                <div className="outfit-icon">{outfit.icon}</div>
                <div className="outfit-name">{outfit.name}</div>
                <div className="outfit-desc">{outfit.desc}</div>
              </div>
            ))}
          </div>
          <div className="tips-section">
            <div className="tips-title">
              <span>💡</span>
              <span>Outfit Tips</span>
            </div>
            {tips.map((tip, index) => (
              <div key={index} className="tip-item">
                <div className="tip-icon">{tip.icon}</div>
                <div className="tip-content">
                  <div className="tip-text">{tip.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="activities-section">
          <div className="activities-title">✨ Recommended Activities</div>
          <div className="activity-tags">
            {activities.map((activity, index) => (
              <div 
                key={index} 
                className={`activity-tag ${activity.recommended ? 'recommended' : 'not-recommended'}`}
              >
                {activity.name}
              </div>
            ))}
          </div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-icon">🌡️</div>
            <div className="info-card-title">Temperature Range</div>
            <div className="info-card-value">{selectedDay.low}° - {selectedDay.high}°</div>
            <div className="info-card-desc">
              {selectedDay.desc.includes('Sunny') ? 'Perfect sunny weather' : 
               selectedDay.desc.includes('Rain') ? 'Cool and damp conditions' :
               'Comfortable temperatures'}
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">💧</div>
            <div className="info-card-title">Precipitation</div>
            <div className="info-card-value">{precipChance}</div>
            <div className="info-card-desc">{precipDescription}</div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">💨</div>
            <div className="info-card-title">Wind</div>
            <div className="info-card-value">{windValue}</div>
            <div className="info-card-desc">Forecast wind speed throughout the day</div>
          </div>
          <div className="info-card">
            <div className="info-card-icon">☀️</div>
            <div className="info-card-title">UV Index</div>
            <div className="info-card-value">{uvIndex !== undefined && uvIndex !== null ? uvIndex : '--'}</div>
            <div className="info-card-desc">{uvDescription}</div>
          </div>
        </div>
      </div>
    );
  };

  const FullHourlyPage = () => {
    return (
      <div className="detail-page">
        <button className="back-button" onClick={() => setCurrentPage('main')}>← Back to Overview</button>
        <div className="timeline-card">
          <div className="timeline-title">Full Hourly Forecast</div>
          {hourlyData.length ? (
            hourlyData.map((hour) => (
              <div
                key={hour.index}
                className="timeline-item"
                onClick={() => { setSelectedHour(hour); setCurrentPage('hourly-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{ cursor: 'pointer' }}
              >
                <div className="timeline-time">{hour.time}</div>
                <div className="timeline-icon">{hour.icon}</div>
                <div className="timeline-info">
                  <div className="timeline-temp">{hour.temp !== undefined && hour.temp !== null ? `${hour.temp}°` : '--'}</div>
                  <div className="timeline-desc">{hour.desc}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="timeline-item">
              <div className="timeline-time">--</div>
              <div className="timeline-icon">⛅</div>
              <div className="timeline-info"><div className="timeline-temp">--</div><div className="timeline-desc">Unavailable</div></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const FullDailyPage = () => {
    return (
      <div className="day-detail-page">
        <button className="back-button" onClick={() => setCurrentPage('main')}>← Back to Overview</button>
        <div className="day-hero" style={{padding: '20px'}}>
          <div className="day-hero-title">7-Day Forecast</div>
        </div>
        <div className="outfit-section">
          <div className="outfit-grid">
            {dailyData.length ? (
              dailyData.map((day, idx) => (
                <div key={idx} className="outfit-item" style={{cursor: 'pointer'}} onClick={() => { setSelectedDay(day); setCurrentPage('day-detail'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  <div className="outfit-icon" style={{fontSize: '48px'}}>{day.icon}</div>
                  <div className="outfit-name" style={{fontSize: '18px', fontWeight: 700}}>{day.day}</div>
                  <div className="outfit-desc">{day.desc}</div>
                  <div style={{marginTop: '8px', fontWeight: 600}}>{day.high !== undefined && day.high !== null ? `${day.high}°` : '--'} / {day.low !== undefined && day.low !== null ? `${day.low}°` : '--'}</div>
                </div>
              ))
            ) : (
              <div className="outfit-item">No forecast available</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Apply gradient to body element
  useEffect(() => {
    if (backgroundGradient) {
      document.body.style.background = backgroundGradient;
      document.body.style.backgroundSize = '200% 200%';
      document.body.style.animation = 'gradientShift 15s ease infinite';
      document.body.style.transition = 'background 1.5s ease-in-out';
      document.body.style.minHeight = '100vh';
    }
    
    return () => {
      // Cleanup
      document.body.style.background = '';
      document.body.style.backgroundSize = '';
      document.body.style.animation = '';
    };
  }, [backgroundGradient]);

  return (
    <>
      <div id="particles"></div>
      <div className="container">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-card">
                <div className="spinner" />
                <div className="loading-text">Loading weather for {city}...</div>
              </div>
            </div>
          )}
          {!loading && error && (
            <div className="card" style={{ textAlign: 'center', color: 'white', padding: '60px 30px' }}>
              {error}
            </div>
          )}
          {!loading && !error && currentPage === 'main' && <MainPage />}
          {!loading && !error && currentPage === 'hourly-detail' && <HourlyDetailPage />}
          {!loading && !error && currentPage === 'day-detail' && <DayDetailPage />}
          {!loading && !error && currentPage === 'hourly-full' && <FullHourlyPage />}
          {!loading && !error && currentPage === 'daily-full' && <FullDailyPage />}
        </div>
    </>
  );
};

export default WeatherApp;