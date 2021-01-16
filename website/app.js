/* Global Variables */
// Personal API Key for OpenWeatherMap API
const Base_URL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const Api_Key = '9c2ab9b6db2f5332e8998990053636e2';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e) {
    const newZip = document.getElementById('zip').value;
    const cont = document.getElementById('feelings').value;

    getApiData(Base_URL, newZip, Api_Key)
        .then(function(data) {
            let date = new Date(data.dt * 1000)
            let date_str = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            postData('/add', { temperature: data.main.temp, date: date_str, userResponse: cont });
            updateUI('/all');
        })
};

/* Function to GET Web API Data*/
const getApiData = async(Base_URL, newZip, Api_Key) => {
    const response = await fetch(Base_URL + newZip + '&appid=' + Api_Key + '&units=imperial');
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('error', error);
    };
};


/* Function to POST data */
const postData = async(url = '', data = {}) => {

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header        
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
};

/* Update UI */
const updateUI = async(url = '') => {
    const request = await fetch(url);
    try {
        let allData = await request.json()
        const mostRecentRecord = allData.data[0];
        document.getElementById('date').innerHTML = 'Date: ' + mostRecentRecord.date;
        document.getElementById('temp').innerHTML = 'Temperature: ' + mostRecentRecord.temperature;
        document.getElementById('content').innerHTML = 'Feelings: ' + mostRecentRecord.userResponse;
    } catch (error) {
        console.log("error", error)
    }
}