import {
    post,
    get
} from '../api/index'
/**
 * 获取日志明细接口
 * @param {*} params 
 * @returns 
 */
export const getLog = (params) => get('/rest/core/lowcode/page/log/get/'+params.id);
/**
 * 获取日志列表接口
 * @param {*} params 
 * @returns 
 */
export const getLogList = (params) => get('/rest/core/lowcode/page/log/list/page', params);
/**
 * 删除日志接口
 * @param {*} params 
 * @returns 
 */
export const deleteLog = (params) => post('/rest/core/lowcode/page/log/delete', params,{},'restcloud');
/**
 * 获取版本列表接口
 * @param {*} params 
 * @returns 
 */
 export const getVersion = (params) => get('/rest/core/lowcode/page/version/get/'+params.id);
/**
 * 获取版本列表接口
 * @param {*} params 
 * @returns 
 */
export const getVersionList = (params) => get('/rest/core/lowcode/page/version/page', params);
/**
 * 发布版本接口
 * @param {*} params 
 * @returns 
 */
 export const publishVersion = (params) => post('/rest/core/lowcode/page/version/publish', params,{},'restcloud');
/**
 * 回滚版本接口
 * @param {*} params 
 * @returns 
 */
export const recoverVersion = (params) => post('/rest/core/lowcode/page/version/recover', params,{},'restcloud');
/**
 * 版本删除接口
 * @param {*} params 
 * @returns 
 */
export const deleteVersion = (params) => post('/rest/core/lowcode/page/version/delete', params,{},'restcloud');