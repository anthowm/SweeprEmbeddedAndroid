import { AsyncStorage } from 'react-native';
import _ from 'lodash';

// TODO: convert this to asyncstorage
export const __loadBasicProfile = () => {
  try {
    const serializedState = localStorage.getItem('profile');
    if (serializedState === null) return undefined;
    const val = JSON.parse(serializedState);
    return { profile: val };
  } catch (e) {
    console.warn('Error retrieving state from local storage', e);
    return undefined;
  }
};

// TODO: convert this to asyncstorage
export const __saveBasicProfile = (state) => {
  try {
    if (!state.authenticated) {
      console.info('Not authenticated, clearing local storage.');
    }
    if (!state.authenticated) {
      localStorage.clear();
      return undefined;
    }
    const serializedState = JSON.stringify(state);
    return localStorage.setItem('profile', serializedState);
  } catch (e) {
    console.warn('Error saving state to local storage', e);
    return undefined;
  }
};

// Returns stored token.
export const getTokenFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('@User:token');
    return token;
  } catch (e) {
    throw new TypeError('Could not retrieve token (AsyncStorage)', e);
  }
};

// Stores token in AsyncStorage
// Then invokes callback (callback would traditionally be an action)
export const storeAuthToken = async (token, callback = null) => {
  if (token && typeof token == 'string') {
    try {
      await AsyncStorage.setItem('@User:token', token);
      if (_.isFunction(callback)) return callback(token);
      return undefined;
    } catch (e) {
      throw new TypeError('Could not store token (AsyncStorage)', e);
    }
  } else {
    console.warn(`Could not store token, invalid type ${typeof token}`, token);
  }
};

export const ASYNC_KEYS = ['@User:token'];

// Removes all keys from async storage
// Then invokes callback (callback would traditionally be an action)
export const clearAppStorage = async function(callback = null) {
  try {
    await AsyncStorage.multiRemove(ASYNC_KEYS, (e) => {
      if (_.isNull(e)) {
        return;
      }
      console.warn('AsyncStorage.multiRemove error', e);
    });
    if (callback) {
      callback();
    }
  } catch (e) {
    throw new TypeError('Could not remove keys from AsyncStorage', e);
  }
};
