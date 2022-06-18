import { post,get} from '../api/index'

export const userLogin = (params) => post('/bpm/login',params,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },"bpm")
export const copyRight = (parmas) => get('/rest/base/platformConfig/system/permissions',parmas)
export const getFormData = (params) => get("/rest/bpm/form/process/get",params)