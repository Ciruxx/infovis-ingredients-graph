const axios = require('axios');


async function getAreas(){
    return await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
}
async function getMealsByArea(country){
    return await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`);
}
async function getMealDetails(meal){
    return await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
}

module.exports = {
    getAreas,
    getMealsByArea,
    getMealDetails
}