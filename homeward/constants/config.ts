import Constants from 'expo-constants';

// Pulls the apiUrl safely from app.json
const extra = Constants.expoConfig?.extra || {};

export const API_BASE_URL = extra.apiUrl;