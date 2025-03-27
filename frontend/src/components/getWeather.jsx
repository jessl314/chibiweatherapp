import React, {useState, useEffect} from 'react';

/* 
TODO:
- make the search bar only include the city input I think
- move the search bar to a location and adjust the css such that when suggestions pop up, things don't shift
- somehow move the weather informtion into another component since I want the initial page to just be search 


*/

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
        
        // checks for if no city is entered or user types a response that is unlikely to lead to a valid city
        // if so then there should be "no suggestions found" and no city selected
        if (!city || city.length < 3 || !/^[a-zA-Z\s]+$/.test(city)) {
            setSuggestions([]);
            setSelectCity(null);  
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
        
        if (!response.ok) {
            console.error('Error fetching location data:', response.status, response.statusText);
            return;
        }

        const data = await response.json();
        console.log("API Response:", data);
        // filtering out any suggestions that are returned that are not real cities 
        // ex: xxx leads to some random websites, this filter arrow function takes those out.
        const validCities = data.filter(city => {
            const isNotRandom = !/^([a-zA-Z])\1{2,}$/.test(city.name); // Exclude repeated characters like "xxx"
            const isValidCity = city.name.length > 2 && city.state !== undefined && city.country !== undefined && isNotRandom;
            return isValidCity;
        });

        if (validCities.length === 0) {
            setSuggestions([]);
            setSelectCity("")
        } else {
            setSuggestions(validCities);
        }
    };
    
    // arrow function that fetches the weather data for the location based on latitude and longitude
    const fetchWeather = async (lat,lon) => {
        try {
            const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
            if (!response2.ok) {
                throw new Error("failed to fetch weather data")
            }
            const data2 = await response2.json();
            setWeather(data2);
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    }
    
    // every time a user enters something, fetchCities() should execute
    useEffect(() => {
        fetchCities();
    }, [city, state, country]);
    
    // if a city is selected then fetchWeather should execute
    useEffect(() => {
        if (selectCity) {
            fetchWeather(selectCity.lat, selectCity.lon);
        }
    }, [selectCity]);

    console.log(suggestions);

    // handles information setting when user selects a city
    const handleSelectCity = async (city) => {
        setSelectCity(city);
        setCity(city.name);
        setTimeout(() => setSuggestions([]), 100);
        // await fetchWeather(city.lat, city.lon);
        
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
                        <li key={`${city.name}-${city.state || "unknown"}${city.country}-${index}`} onClick={() => handleSelectCity(city)} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-200 cursor-pointer">
                             <span>📍{city.name}, {city.state ? city.state :  ''},  {city.country}</span>
                        </li>
                    ))}
                </ul>
            )}
            {suggestions.length === 0 && !selectCity && <p>No suggestions found.</p>}
            
            {/* displays the selected city choice in bold */}
            {selectCity && (
                <div>
                    <h3>Selected City: {selectCity.name}, {selectCity.state || ''}, {selectCity.country}</h3>
                </div>
            )}
            {weather && selectCity && (
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



