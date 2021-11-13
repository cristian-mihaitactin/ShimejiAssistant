const https_serivce = require('./http-service');
import env from "env";
const rest_api_users_path = env.path_users;

export const getUser = async (userId) => {
    console.log(rest_api_users_path)
    var userPath = rest_api_users_path + "/" + userId;
    console.log(userPath)

    var returnValue = '';
    await https_serivce.restapi_get(userPath).then((value) => {
        returnValue =  value;
    }).catch(
        (reason) => {
             console.log('RestApi-Project.Get rejected promise ('+reason+') here.');
             throw new Error(reason);
         }
    );

    return returnValue;
}