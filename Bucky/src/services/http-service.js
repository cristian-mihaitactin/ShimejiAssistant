const request = require('request');
import env from "env";
import url from "url";
// https.globalAgent.options.ca = require('ssl-root-cas/latest').create();

const rest_api_url = env.RESTAPI_URL;
const rest_api_port = env.RESTAPI_PORT;

export const restapi_get = function (path) {
    console.log(path);
    console.log(encodeURIComponent(path));
    return new Promise((resolve, reject) => {
        const pathToUrl = rest_api_url + ":" + rest_api_port + path;
        request
        .get(pathToUrl, function (error, response, body) {
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            resolve(JSON.parse(body));
        }).on('error', function (err) {
            console.error(err);
        });
    });
}
