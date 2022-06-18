import { baseURL, get, post } from '../../api/index'

const bpmUrl = baseURL.replace('/restcloud', '')

export const saveNodeConfig = (query: string, params?: any) => post(`${bpmUrl}/bpm/rule?${query}`, params);

export const getSelectData = (query: string, params?: any) => get(`${bpmUrl}/bpm/rule?${query}`, params);

export const getEventData = (query: string, params?: any) => get(`${bpmUrl}/bpm/r?${query}`, params);

export const getJsonData = (query: string, params?: any) => get(`${bpmUrl}/bpm/json?${query}`, params);