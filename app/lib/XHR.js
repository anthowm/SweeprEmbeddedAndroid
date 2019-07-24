import axios from 'axios';
import { AsyncStorage } from 'react-native';

class XHR {
  constructor({ axiosDefaults }) {
    this.axiosInstance = axios.create(axiosDefaults);
  }

  create(url, payload) {
    return this.xhr(url, payload, 'POST');
  }

  read(url) {
    return this.xhr(url, null, 'GET');
  }

  update(url, payload) {
    if (!payload.id) {
      throw new ReferenceError('Missing ID property', 'XHR.js');
    }
    url = url + '/' + payload.id;
    return this.xhr(url, payload, 'PUT');
  }

  delete(url) {
    return this.xhr(url, null, 'DELETE');
  }

  async xhr(url, body, verb) {
    this.isAuth = /\/user$|\/user\/isp\/register$|\/login$/gi.test(url);

    // Token management
    // In case we need, but don't have a token, we retrieve it here.
    // To set the class instance token (this.token), we do as follows:
    // - If the Axios instance already has a token, use that.
    // - If the Axios instance does NOT have a token, try to find the token from AsyncStorage, use that.
    // Now the class instance has the correct token, so we set the Axios instance token to that.
    if (!this.isAuth && !this.token) {
      this.token = this.axiosInstance.defaults.headers.common['SWEEPR-TOKEN']
        ? this.axiosInstance.defaults.headers.common['SWEEPR-TOKEN']
        : await AsyncStorage.getItem('@User:token');

      this.axiosInstance.defaults.headers.common['SWEEPR-TOKEN'] = this.token;
    } else if (this.isAuth && this.token) {
      this.token = null;
      delete this.axiosInstance.defaults.headers.common['SWEEPR-TOKEN'];
    }

    // In case the above token retrieval resulted in a missing token, we catch it here.
    if (!this.isAuth && !this.token) {
      throw new TypeError('Token is ' + this.token + ' for call ' + url, 'XHR.js');
    }

    console.info(verb, url, `->`, body);
    // console.info(this.axiosInstance.defaults.headers)

    return this.axiosInstance
      .request({
        method: verb,
        url: url,
        data: body ? body : null
      })
      .then((response) => {
        console.info(`${verb}:`, response.request.status, `-> ${response.request.responseURL}`);
        console.log('Response:', response);
        switch (response.status) {
          case 200: // OK
          case 201: // Created
          case 202: // Accepted
          case 203: // Non-Authoritative Information
          case 204: // No content
            return response.data;

          default:
            throw new RangeError('Unhandled request response', 'XHR.js');
        }
      })
      .catch((error) => {
        // Let's the Saga handle errors in their try/catch instead.
        console.info('Ouch, error:', error.response);
        throw error.response
          ? { message: error.response.data.value, name: 'Request Error', error: error }
          : { message: error.message, name: 'Request Error', error: error };
      });
  }
}

export default XHR;
