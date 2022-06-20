import { message, notification } from 'antd';
import axios from 'axios';

const getApiPath = () => {
  const { origin } = window.location;
  if (origin.includes('localhost')) {
    return 'http://kevyenking.vaiwan.com/restcloud'
  } else {
    return `${origin}/restcloud`
  }
}

export const baseURL = getApiPath();

axios.defaults.withCredentials = false;
export const service = axios.create({
  baseURL,
  timeout: 360 * 1000,
  responseType: 'json',
  withCredentials: false
});

service.interceptors.request.use(
  function (config) {
    if (!config.url.includes('/bpm/login')) {
      const identitytoken = localStorage.getItem('identitytoken');
      const appkey = localStorage.getItem("appkey")
      if (identitytoken) {
        config.headers.identitytoken = identitytoken;
      } else {
        // window.location.href="./login.html"
      }
      if(appkey){
        config.headers.appkey = appkey
      }
      
    }
    // // const serverHost = localStorage.getItem('serverHost');
    // if (config.baseURL !== serverHost && serverHost) {
    //   config.baseURL = serverHost;
    // }
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  function (res) {
    if (res.status === 200) {
      return Promise.resolve(res);
    } else {
      return Promise.reject(res);
    }
  },
  function (err) {
    if (!err) return false;
    if (err && !err.response) {
      //自己将超时的判断条件补全
      err.response = {};
      err.response.status = 2021;
      err.response.data = {};
      err.response.data.msg = '请求接口超时!';
      err.response.data.state = false;
      notification.error({
        message: '操作提示',
        description: '服务请求超时！',
      });
      return Promise.reject(err.response && err.response.data);
    } else if (err.response.status === 401){
      message.error(err.response && err.response.data && err.response.data.msg)
      window.location.href="./login.html"
    } 
    else if (err.response.status === 500) {
      notification.error({
        message: '操作提示',
        description: (err.response.data && err.response.data.msg) || '服务请求处理异常!',
      });
      return Promise.reject(err.response && err.response.data);
    } else if (err.response.status === 404) {
      notification.error({
        message: '操作提示',
        description:
          (err.response.data && err.response.data.msg) ||
          '服务请求失败,请检查服务器填写及服务接口是否正确!',
      });
      return Promise.reject(err.response && err.response.data);
    } else {
      message.error((err.response && err.response.data && err.response.data.msg) || '接口异常');
      return Promise.reject(err.response && err.response.data);
    }
  },
);

export const get = (url, params, config, type) => {
  return new Promise((resolve, reject) => {
    service
      .get(
        `${type === 'bpm' ? baseURL.replace('/restcloud', '') : ''}${url}`,
        {
          params,
        },
        config || undefined,
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const GET = get;

export const post = (url, params, config, type) => {
  let cType;
  let data ;
  if(config && config.headers){
    cType = config.headers['Content-Type'];
    if (cType === 'application/x-www-form-urlencoded') {
      if (params instanceof URLSearchParams) {
        data = params
      } else {
        data = ''
        for (let k in params) {
          data += `${data !== '' ? '&' : ''}${k}=${params[k]}`;
        }
      }
      
    }
  }
  return new Promise((resolve, reject) => {
    service
      .post(
        `${type === 'bpm' ? baseURL.replace('/restcloud', '') : ''}${url}`,
        cType === 'application/x-www-form-urlencoded'
          ? data
          : {
              ...params,
            },
        config || undefined,
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const POST = post;
