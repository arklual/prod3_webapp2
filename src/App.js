import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { MainButton, WebAppProvider, useWebApp } from '@vkruglikov/react-telegram-web-app';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CountryRegionCitySelect = () => {
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const webApp = useWebApp();

    useEffect(() => {
        fetch('countries.json')
            .then(response => response.json())
            .then(data => setCountries(data));
    }, []);

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
        setSelectedRegion(null);
        setSelectedCity(null);
        if (selectedOption) {
            const countryId = countries.find(country => country.title_ru === selectedOption.value).country_id;
            fetch(`countries/${countryId}/regions.json`)
                .then(response => response.json())
                .then(data => setRegions(data));
        } else {
            setRegions([]);
            setCities([]);
        }
    };

    const handleRegionChange = (selectedOption) => {
        setSelectedRegion(selectedOption);
        setSelectedCity(null);
        if (selectedOption) {
            const countryId = countries.find(country => country.title_ru === selectedCountry.value).country_id;
            const regionId = regions.find(region => region.title_ru === selectedOption.value).region_id;
            fetch(`countries/${countryId}/${regionId}.json`)
                .then(response => response.json())
                .then(data => setCities(data));
        } else {
            setCities([]);
        }
    };
    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
    };

    const handleMainButton = () => {
        webApp?.sendData({
            'country': selectedCountry,
            'region': selectedRegion, 
            'city': selectedCity,
        });
    }

    const countryOptions = countries.map(country => ({ value: country.title_ru, label: country.title_ru }));
    const regionOptions = regions.map(region => ({ value: region.title_ru, label: region.title_ru }));
    const cityOptions = cities.map(city => ({ value: city, label: city }));

    return (
        <WebAppProvider>
            <div className="select-container">
                <Select
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    placeholder="Выберите страну"
                />

                <Select
                    options={regionOptions}
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    placeholder="Выберите регион"
                />

                <Select
                    options={cityOptions}
                    value={selectedCity}
                    onChange={handleCityChange}
                    placeholder="Выберите город"
                />
            </div>
            <MainButton onClick={handleMainButton}
                text="Отправить" />
        </WebAppProvider>
    );
};

export default CountryRegionCitySelect;

