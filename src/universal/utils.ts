import { material, project } from '@alilc/lowcode-engine';
import { Message, Dialog } from '@alifd/next';
import { baseURL, post, get } from '../api';

export const getUrlSearch = (field: string) => {
    const url = window.location.search.replace('?', '');
    const params = url.split('&');
    const item = params.filter((o) => o.match(`${field}=`) !== null);
    if (item.length) {
        return item[0].replace(`${field}=`, '');
    } else {
        return undefined;
    }
};

const BaseURL = baseURL;
// const BaseURL = "http://192.168.8.107:8082/restcloud"
const path = getUrlSearch('id');

export const preview = () => {
    saveSchema();
    setTimeout(() => {
        window.open(`./preview.html?id=${path}`, '_blank');
        /* window.location.href = ``; */
    }, 500);
    
};

export const formPreview = () => {
    saveSchema();
    setTimeout(() => {
        window.open(`./formProcess.html?id=${path}`, '_blank');
        /* window.location.href = ``; */
    }, 500);
    
};

export const saveSchema = async () => {
    let saveData = JSON.stringify(project.exportSchema());
    const identitytoken = window.localStorage.getItem('identitytoken');
    if (window.location.href.indexOf('processDesign') == -1) {
        const pageValue = JSON.parse(localStorage.getItem('pageInfo'));
        post(`${BaseURL}/rest/core/lowcode/page/config/save`, { 
            ...pageValue, 
            pageConfigJson: saveData
         }).then((response: any) => {
            if (response.data.state === true) {
                Message.success('保存成功!');
            } else {
                Message.error('保存失败!');
            }
        });
    } else {
        post(`${BaseURL}/rest/bpm/form/save`, { 
            orUnId: path, 
            formConfigJson: saveData 
        }).then((response: any) => {
            if (response.data.state === true) {
                Message.success('保存成功!');
            } else {
                Message.error('保存失败!');
            }
        });
    }
};

export const resetSchema = async () => {
    try {
        await new Promise<void>((resolve, reject) => {
            Dialog.confirm({
                title: '确定要重置吗？',
                content: '当前设计都会被清除',
                onOk: () => {
                    resolve();
                },
                onCancel: () => {
                    reject();
                },
            });
        });
    } catch (err) {
        return;
    }

    let schema;
    try {
        schema = window.schemaJson;
    } catch (err) {
        schema = {
            componentName: 'Page',
            fileName: 'sample',
        };
    }

    window.localStorage.setItem(
        'projectSchema',
        JSON.stringify({
            componentsTree: [schema],
            componentsMap: material.componentsMap,
            version: '1.0.0',
            i18n: {},
        }),
    );

    project.getCurrentDocument()?.importSchema(schema);
    project.simulatorHost?.rerender();
    Message.success('成功重置页面');
};

export const getPageSchema = async (
    type: number,
    id?: string,
    mode?: string,
    flag: string = 'config',
) => {
    /* const schema = JSON.parse(
    window.localStorage.getItem('projectSchema') || '{}'
  ); */
    const identitytoken = window.localStorage.getItem('identitytoken');
    if (!identitytoken) {
        // window.location.href = '/login'
    }
    let url = '';
    const urlPath = path || id;
    let value;
    if (urlPath) {
        if (flag === 'config') {
            if (window.location.href.indexOf('processDesign') == -1) {
                url = `${BaseURL}/rest/core/lowcode/page/config/get/${urlPath}`;
            } else {
                url = `${BaseURL}/rest/bpm/form/get/${urlPath}`;
            }
        } else if (flag === 'form') {
            url = `${BaseURL}/rest/bpm/form/get/${urlPath}`;
        } else {
            url = `${BaseURL}/rest/core/lowcode/page/version/get/published/${urlPath}`;
        }
        value = await get(url);
    }
    const data = await value.data;
    const initData = window.schemaJson;

    // const pageSchema = schema?.componentsTree?.[0];
    if (data?.data) {
        localStorage.setItem('pageInfo', JSON.stringify(data.data));
        if (data.data.pageConfigJson) {
            if (type) {
                return JSON.parse(data.data.pageConfigJson || '{}');
            }
            return JSON.parse(data.data.pageConfigJson || '{}')?.componentsTree?.[0];
        } else if (data.data.formConfigJson) {
            if (type) {
                return JSON.parse(data.data.formConfigJson || '{}');
            }
            return JSON.parse(data.data.formConfigJson || '{}')?.componentsTree?.[0];
        } else {
            return initData;
        }
    }
    return initData;
};

function request(
    dataAPI: string,
    method = 'GET',
    data?: object | string,
    headers?: object,
    otherProps?: any,
): Promise<any> {
    return new Promise((resolve, reject): void => {
        if (otherProps && otherProps.timeout) {
            setTimeout((): void => {
                reject(new Error('timeout'));
            }, otherProps.timeout);
        }
        fetch(dataAPI, {
            method,
            headers,
            body: data,
            ...otherProps,
        })
            .then((response: Response): any => {
                switch (response.status) {
                    case 200:
                    case 201:
                    case 202:
                        return response.json();
                    case 204:
                        if (method === 'DELETE') {
                            return {
                                success: true,
                            };
                        } else {
                            return {
                                __success: false,
                                code: response.status,
                            };
                        }
                    case 400:
                    case 401:
                        window.location.href = './login.html';
                    case 403:
                    case 404:
                    case 406:
                    case 410:
                    case 422:
                    case 500:
                        return response
                            .json()
                            .then((res: object): any => {
                                return {
                                    __success: false,
                                    code: response.status,
                                    data: res,
                                };
                            })
                            .catch((): object => {
                                return {
                                    __success: false,
                                    code: response.status,
                                };
                            });
                    default:
                        return null;
                }
            })
            .then((json: any): void => {
                if (json && json.__success !== false) {
                    resolve(json);
                } else {
                    delete json.__success;
                    reject(json);
                }
            })
            .catch((err: Error): void => {
                reject(err);
            });
    });
}
