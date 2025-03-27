import React, {useState, useEffect} from 'react';

const LocationWeather = () => {
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [selectCity, setSelectCity] = useState(null)
    const [weather, setWeather] = useState(null);

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    
    // function to fetch the suggested cities when the user types in the input fields
    const fetchCities = async () => {
        if (!city) {
            setSuggestions([]);
            return;
        }
        let query = city;
        if (state) {
            query += `,${state}`;
        }
        if (country) {
            query += `,${country}`;
        }
        if (!query) {
            console.error("Query is invalid");
            return; // Stop execution if query is invalid
        }
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`)
        //
        if (!response.ok) {
            console.error('Error fetching location data:', response.status, response.statusText);
            return;
        }
        const data = await response.json();
        console.log("API Response:", data);

        if (!Array.isArray(data) || data.length === 0) {
            console.error("No valid city data received");
            setSuggestions([]);
            return;
        }
    
        // Store city suggestions
        setSuggestions(data);
    };

    const fetchWeather = async (lat,lon) => {
        const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        if (!response2.ok) {
            console.error('Error fetching data:', response2.status, response2.statusText);
            return;
        }
        const data2 = await response2.json();
        setWeather(data2);
    }



    useEffect(() => {
        fetchCities();
    }, [city, state, country]);

    console.log(suggestions);

    // handles information setting when user selects a city
    const handleSelectCity = async (city) => {
        setSelectCity(city);
        setCity(city.name);
        setState(city.state || '');
        setCountry(city.country);
        setSuggestions([]);
        await fetchWeather(city.lat, city.lon);
        
    };
    console.log("Rendering LocationSearch component");

    return (
        <div>
            <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            />
            <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter state"
            />
            <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter country"
            />
            {/* displays a list of all suggested cities from which user can select */}
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((city, index) => (
                        <li key={`${city.name}-${city.state || "unknown"}${city.country}-${index}`} onClick={() => handleSelectCity(city)} className="p-2 bg-pink-100 hover:bg-pink-200 rounded-xl shadow-md cursor-pointer transition-all">
                            {city.name}, {city.state ? city.state :  ''},  {city.country}
                        </li>
                    ))}
                </ul>
            )}
            {suggestions.length === 0 && <p>No suggestions found.</p>}
            
            {/* displays the selected city choice in bold */}
            {selectCity && (
                <div>
                    <h3>Selected City: {selectCity.name}, {selectCity.state || ''}, {selectCity.country}</h3>
                </div>
            )}
            {weather && (
                <div>
                    <h3>Weather Information:</h3>
                    <p>Temperature: {Math.round(((weather.main.temp - 273.15) * (9/5) + 32) * 100) / 100}°F</p>
                    <p>Weather: {weather.weather[0].description}</p>
                    <p>Humidity: {weather.main.humidity}%</p>
                    <p>Wind Speed: {weather.wind.speed} m/s</p>
                    {/* I'm thinkin use the weather name I think as the main UI change and then the description can be used to add "accent" UI like maybe gray clouds for overcast cloudt */}
                </div>
            )}
        </div>
    )
}

export default LocationWeather;



