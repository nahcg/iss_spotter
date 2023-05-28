/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // Print the error if one occurred
    if (error !== null) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
    // Print the response status code if not 200
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${response}`;
      callback(Error(msg), null);
    } else {
    // Print the API
      const ip = JSON.parse(body).ip;
      callback(null, ip);
    }
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request('http://ipwho.is/' + ip, (error, response, body) => {
    // Print the error if one occurred
    if (error !== null) {
      callback(error, null);
    }
    // If success = false, print error msg, else print the lat and long
    const obj = JSON.parse(body);
    if (obj.success === false) {
      const msg = `Success status was ${obj.success}. Server message says: ${obj.message} when fetching for IP ${obj.ip}`;
      callback(msg, null);
    } else {
      const lat = obj.latitude;
      const long = obj.longitude;
      const latlong = `{ latitude: ${lat}, longitude: ${long} }`;
      callback(null, latlong);
    }
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  // request lat and long from api
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error !== null) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      // Print the response status code if not 200, invalid lat and lon would give message "invalid coordinates in body"
      const msg = `Status Code ${response.statusCode}. Response: ${body}`;
      callback(Error(msg), null);
    } else {
    // Print the API
      const response = JSON.parse(body).response;
      callback(null, response);
    }
  });
};


module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes
};
