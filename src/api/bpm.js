import { get, post } from './'

export const getMenu = (appId, params) => get(`/rest/base/menu/tree/${appId}`, params);

export const getProcesses = (params) => get('/bpm/rest/process/applicable', params, 0, 'bpm');

export const getPersonnelList = (pagination, { wf_num, wf_gridnum, OrgClass, Folderid, RoleNumber }) => {
    const extraParams = (OrgClass ? `&OrgClass=${OrgClass}` : '') + (Folderid ? `&Folderid=${Folderid}` : '') + (RoleNumber ? `&RoleNumber=${RoleNumber}` : '');
    return post(`/bpm/r?wf_num=${wf_num}&wf_gridnum=${wf_gridnum}${extraParams}`, pagination, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 'bpm');
}

export const getPersonnelRule = (params) => get('/bpm/rule', params, 0, 'bpm');

export const saveFromRender = (params) => post('/rest/bpm/form/save',params);

export const getFromRender = (orUnid, params) => get(`/rest/bpm/form/get/${orUnid}`, params);

export const getAllFormRules = (params) => get('/bpm/navtree', params, 0, 'bpm');

export const setFormConfig = (wf_num, params) => post(`/bpm/rule?wf_num=${wf_num}`, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 'bpm');

export const getFormConfig = (params) => get('/bpm/rest/forms/config', params, 0, 'bpm');

export const getRoleList = ({ wf_num, wf_gridnum, RoleType }, params) => post(`/bpm/r?wf_num=${wf_num}&wf_gridnum=${wf_gridnum}&RoleType=${RoleType}`, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 'bpm');

//审批组件
export const approvavlSubmit = (params) => post('/bpm/r?wf_num=R_S003_B035', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 'bpm');

export const saveDoc = (params) => post('/bpm/r?wf_num=R_S003_B031', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 'bpm');

export const getDocUnid = (params) => get('/rest/bpm/form/generate/uuid', params);

export const setApprovavlRemark = (params) => post('/bpm/rule?wf_num=R_S003_B037', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 'bpm')