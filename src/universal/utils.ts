import { material, project } from '@alilc/lowcode-engine';
import { filterPackages } from '@alilc/lowcode-plugin-inject'
import { Message, Dialog } from '@alifd/next';
import { TransformStage } from '@alilc/lowcode-types';
import { baseURL } from '../api';


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
const path = getUrlSearch('id');

export const loadIncrementalAssets = () => {
  material?.onChangeAssets(() => {
    Message.success('[MCBreadcrumb] 物料加载成功');
  });

  material.loadIncrementalAssets({
    packages: [
      {
        title: 'MCBreadcrumb',
        package: 'mc-breadcrumb',
        version: '1.0.0',
        urls: [
          'https://unpkg.alibaba-inc.com/mc-breadcrumb@1.0.0/dist/MCBreadcrumb.js',
          'https://unpkg.alibaba-inc.com/mc-breadcrumb@1.0.0/dist/MCBreadcrumb.css',
        ],
        library: 'MCBreadcrumb',
      },
    ],
    components: [
      {
        componentName: 'MCBreadcrumb',
        title: 'MCBreadcrumb',
        docUrl: '',
        screenshot: '',
        npm: {
          package: 'mc-breadcrumb',
          version: '1.0.0',
          exportName: 'MCBreadcrumb',
          main: 'lib/index.js',
          destructuring: false,
          subName: '',
        },
        props: [
          {
            name: 'prefix',
            propType: 'string',
            description: '样式类名的品牌前缀',
            defaultValue: 'next-',
          },
          {
            name: 'title',
            propType: 'string',
            description: '标题',
            defaultValue: 'next-',
          },
          {
            name: 'rtl',
            propType: 'bool',
          },
          {
            name: 'children',
            propType: {
              type: 'instanceOf',
              value: 'node',
            },
            description: '面包屑子节点，需传入 Breadcrumb.Item',
          },
          {
            name: 'maxNode',
            propType: {
              type: 'oneOfType',
              value: [
                'number',
                {
                  type: 'oneOf',
                  value: ['auto'],
                },
              ],
            },
            description:
              '面包屑最多显示个数，超出部分会被隐藏, 设置为 auto 会自动根据父元素的宽度适配。',
            defaultValue: 100,
          },
          {
            name: 'separator',
            propType: {
              type: 'instanceOf',
              value: 'node',
            },
            description: '分隔符，可以是文本或 Icon',
          },
          {
            name: 'component',
            propType: {
              type: 'oneOfType',
              value: ['string', 'func'],
            },
            description: '设置标签类型',
            defaultValue: 'nav',
          },
          {
            name: 'className',
            propType: 'any',
          },
          {
            name: 'style',
            propType: 'object',
          },
        ],
        configure: {
          component: {
            isContainer: true,
            isModel: true,
            rootSelector: 'div.MCBreadcrumb',
          },
        },
      },
    ],

    componentList: [
      {
        title: '常用',
        icon: '',
        children: [
          {
            componentName: 'MCBreadcrumb',
            title: 'MC面包屑',
            icon: '',
            package: 'mc-breadcrumb',
            library: 'MCBreadcrumb',
            snippets: [
              {
                title: 'MC面包屑',
                screenshot:
                  'https://alifd.oss-cn-hangzhou.aliyuncs.com/fusion-cool/icons/icon-light/ic_light_breadcrumb.png',
                schema: {
                  componentName: 'MCBreadcrumb',
                  props: {
                    title: '物料中心',
                    prefix: 'next-',
                    maxNode: 100,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  });
};

// export const preview = (scenarioName: string = 'index') => {
//   saveSchema(scenarioName);
//   setTimeout(() => {
//     const search = location.search ? `${location.search}&scenarioName=${scenarioName}` : `?scenarioName=${scenarioName}`;
//     window.open(`./preview.html${search}`);
//   }, 500);
// };
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
    fetch(`${BaseURL}/rest/core/lowcode/page/config/save`, {
      method: 'post',
      headers: {
        identitytoken: identitytoken || '',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({ ...pageValue, pageConfigJson: saveData }),
    }).then((response: Response): any => {
      if (response.ok === true) {
        Message.success('保存成功!');
      } else {
        Message.error('保存失败!');
      }
    });
  } else {
    fetch(`${BaseURL}/rest/bpm/form/save`, {
      method: 'post',
      headers: {
        identitytoken: identitytoken || '',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({ orUnId: path, formConfigJson: saveData }),
    }).then((response: Response): any => {
      if (response.ok === true) {
        Message.success('保存成功!');
      } else {
        Message.error('保存失败!');
      }
    });
  }
};

export const resetSchema = async (scenarioName: string = 'index') => {
  try {
    await new Promise<void>((resolve, reject) => {
      Dialog.confirm({
        content: '确定要重置吗？您所有的修改都将消失！',
        onOk: () => {
          resolve();
        },
        onCancel: () => {
          reject()
        },
      })
    })
  } catch (err) {
    return
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
    value = await fetch(url, {
      method: 'get',
      headers: {
        identitytoken: identitytoken || '',
      },
    });
  }
  const data = await value?.json();

  const initData = window.schemaJson;

  // const pageSchema = schema?.componentsTree?.[0];
  if (data?.data) {
    console.log(data)
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