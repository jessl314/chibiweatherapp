import React, {useState, useEffect} from 'react';

const LocationSearch = () => {
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
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
            console.error('Error fetching data:', response.status, response.statusText);
            return;
        }
        const data = await response.json();
        console.log("API Response:", data);
        // const uniqueCities = data.list.filter((value, index, self) =>
        //     index === self.findIndex((t) => (
        //         t.id === value.id && t.name === value.name && t.sys.country === value.sys.country
        //     ))
        // );
        setSuggestions(data.list || [])
    };

    useEffect(() => {
        fetchCities();
    }, [city, state, country]);
    console.log(suggestions);
    const handleSelectCity = (city) => {
        setSelectCity(city);
        setCity(city.name);
        setState(city.sys.state || '');
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
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((city) => (
                        <li key={`${city.id}-${city.name}-${city.sys.country}`} onClick={() => handleSelectCity(city)}>
                            {city.name}, {city.sys.state ? city.sys.state :  ''} {city.sys.country}
                        </li>
                    ))}
                </ul>
            )}
            {suggestions.length === 0 && <p>No suggestions found.</p>}
            
            {selectCity && (
                <div>
                    <h3>Selected City: {selectCity.sys.state || ''}, {selectCity.sys.country}</h3>
                </div>
            )}
        </div>
    )
}

export default LocationSearch;


// d20994c07bd543c0af0194744252403
