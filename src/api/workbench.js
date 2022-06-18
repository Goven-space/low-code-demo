import { get, post, baseURL} from './index'

export const saveForm = (params) => post('/rest/core/lowcode/workbench/config/save', params);

export const getForm = (params) => get('/rest/core/lowcode/workbench/config/bpm', params);

export const getAppList = (params) => get('/bpm/json', params, 0, 'bpm');

export const getMyTodo = (params) => get('/bpm/rest/task/count', params, 0, 'bpm');

export const getChartTree = (params) => post('/rest/core/lowcode/page/version/listCategoryAndChart/tree', params);
