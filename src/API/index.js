
 export  const getCountry = async(country) => {
    const url = 'https://api.api-ninjas.com/v1/country?name='+country
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'X-Api-Key': 'Ivljd+6SycpaeRDfJQsYMA==rBCrHxHOV7gkEmak'},
})
 return response.json()
}

export const getCity = async(cityName) => {
    const url = 'https://api.api-ninjas.com/v1/city?name=' + cityName
    const response = await fetch(url, 
        {
        method: 'GET',
        headers: { 'X-Api-Key': 'Ivljd+6SycpaeRDfJQsYMA==rBCrHxHOV7gkEmak'},
})
 return response.json()
}

export const euCountries = [
    "Austria",
    "Belgium",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czechia",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
  ];
 export const euCandidateCountries = [
    "Albania",
    "Macedonia",
    "Montenegro",
    "Serbia",
    "Turkey",
  ];
  //code to get info about countries and capitals in one function call
export const allCountries = euCountries.concat(euCandidateCountries);
      console.log("allCountries::::::", allCountries);


export  async function getCountryFullInfo (countriesArr) {

    console.log('countriesArr::::::',countriesArr);
    const fetchAllCountries = countriesArr.map(async (country) => {
        const countryData = await getCountry(country);
        const capital = countryData[0].capital;
        const capitalData = await getCity(capital);
        return {
          countryName: country,
          countryData: countryData[0],
          capitalData: capitalData[0],
        };
      });
    const allData = await Promise.all(fetchAllCountries);
    console.log("allData::::::", allData);
    return allData
}