import React, {useState, useEffect} from 'react';

const LocationSearch = () => {
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [selectCity, setSelectCity] = useState(null)

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const fetchCities = async () => {
        if (!city) {
            setSuggestions([]);
            return;
        }
        let query = city;
        if (country) {
            query += `,${country}`;
        }
        const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${apiKey}`)
        const data = await response.json();
        setSuggestions(data.list || [])
    };

    useEffect(() => {
        fetchCities();
    }, [city, country]);

    const handleSelectCity = (city) => {
        setSelectCity(city);
        setCity(city.name);
        setCountry(city.sys.country);
        setSuggestions([]);
        console.log('Selected city: ', city);
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
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter country"
            />
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((city) => (
                        <li key={city.id} onClick={() => handleSelectCity(city)}>
                            {city.name}, {city.sys.country}
                        </li>
                    ))}
                </ul>
            )}
            {suggestions.length === 0 && <p>No suggestions found.</p>}
            
            {selectCity && (
                <div>
                    <h3>Selected City: {selectCity.name}, {selectCity.sys.country}</h3>
                </div>
            )}
        </div>
    )
}

export default LocationSearch;