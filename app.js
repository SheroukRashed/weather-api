const request = require('postman-request');

const geoCode = (callback) => {
    const address = "New%20York";
    const geocodeUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1Ijoic2hlcm91azIwMjE5NCIsImEiOiJja3VrMmR3bzExOHg0MnFteW8wZndjM3dvIn0.-Dd1BVk_UoL4AgL6Fsg0Vw&limit=1'
    request({url: geocodeUrl, json: true}, (error, {body}) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    });
}


const forcast = (callback) => {
    geoCode((error, { latitude, longitude, location }) => {
        if (error) {
            return console.log(error)
        }else{
            const url = 'http://api.weatherstack.com/current?access_key=ef4e15eb553578ec9b3ef3b401989e5d&query='+ latitude + ',' + longitude;
            request({url: url}, (error, {body}) => {
                body = JSON.parse(body);
                if (error) {
                    callback('Unable to connect to weather service!', undefined)
                } else if (body.error) {
                    callback('Unable to find location', undefined)
                } else {
                    callback(undefined, body.current.observation_time + ' It is currently ' + body.current.temperature + ' degress out. There is a ' + body.current.humidity + '% chance of rain.')
                }
            });
        }
    
    })
    
}


forcast((error, forecastData) => {
    if (error) {
        return console.log(error)
    }else{
        console.log(forecastData)
    }
});