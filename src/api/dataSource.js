import { get } from './'

export const getAppsCategory = (params) => get('/rest/core/apps', params);

export const getAppsCategoryChildren = (params) => get('/rest/core/appservicecategory/treejson/select', params);

export const getApiList = (params) => get('/rest/core/services', params);