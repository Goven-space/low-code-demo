import { FunctionComponent, useEffect, useState } from 'react';
import { ConfigProvider, Button, Col, Modal, Row, Space, Table, Tag, Tree, Tooltip, Form, Input, Switch, Select, InputNumber, Card, Dropdown, Menu, message } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { DeleteOutlined, SettingOutlined, ArrowLeftOutlined, DownOutlined } from '@ant-design/icons';
import { getAppsCategory, getAppsCategoryChildren, getApiList } from '../../api/dataSource';
import './index.less';
import { project } from '@alilc/lowcode-engine';
import Params from './params'
import Editor from './editor';
import { objToArr, arrToObj } from '../../tool'

const AxiosDataSource: FunctionComponent = (props) => {
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [categoryData, setCategoryData] = useState([]);
  const [expandKey, setExpandKey] = useState([]);
  const [modalKey, setModalKey] = useState(new Date().getTime());
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [appId, setAppId] = useState(undefined);
  const [categoryId, setCategoryId] = useState(undefined);
  const [searchFilters, setSearchFilters] = useState<object | undefined>(undefined);
  const [apiList, setApiList] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectApiKeys, setSelectApiKey] = useState([]);
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorIndex, setEditorIndex] = useState<any>(undefined)
  const [form] = Form.useForm()

  const columns = [
    {
      title: 'method',
      key: 'method',
      render: (text: string, row: any) => {
        return <Tag color={row.options.method === 'POST' ? '#87d068' : '#108ee9'}>{row.options.method}</Tag>
      }
    },
    {
      title: "数据源ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: 'URL',
      key: 'url',
      width:'50%',
      render: (text: string, row: any) => {
        return row.options.uri
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, row: any, index: any) => {
        return (
          <Space>
            <Tooltip placement="bottom" title="高级设置">
              <Button className="action-btn" icon={<SettingOutlined />} onClick={() => handleSetting(index)}></Button>
            </Tooltip>
            <Tooltip placement="bottom" title="删除">
              <Button className="action-btn" icon={<DeleteOutlined />} onClick={() => handleDelete(index)}></Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const apiColumns = [
    {
      title: "method",
      dataIndex: "methodType",
      key: "methodType",
      render: (text: string) => {
        return <Tag color={text === 'POST' ? '#87d068' : '#108ee9'}>{text}</Tag>
      }
    },
    {
      title: "服务名",
      dataIndex: "configName",
      key: "configName",
    },
    {
      title: "URL",
      dataIndex: "mapUrl",
      key: "mapUrl"
    },
    {
      title: "应用",
      dataIndex: "appId",
      key: "appId"
    }
  ]

  

  useEffect(() => {
    const schema = project.exportSchema();
    const { componentsTree } = schema;
    const dataSourceList = componentsTree[0].dataSource?.list || []
    setDataSource([...dataSourceList])
  }, [])

  useEffect(() => {
    if (visible) {
      getAppsCategory().then((res) => {
        setCategoryData(
          res.data
            .filter((o: any) => o.appId !== 'new')
            .map((item: any) => ({
              title: item.appName,
              key: item.appId,
              isLeaf: false,
            })),
        );
      });
      getApiData()
    } else {
      setExpandKey([]);
      setModalKey(new Date().getTime());
      setSelectApiKey([])
      setSearchFilters(undefined)
      setPageNo(1)
      setPageSize(10)
    }
  }, [visible, pageNo, pageSize, appId, categoryId, searchFilters]);

  const handleCreateMenu = ({key}: any) => {
    if(key === "import"){
      setVisible(true);
    } else {
      setEditorVisible(true);
      setEditorIndex(undefined);
    }
  }

  const createMenu = (
    <Menu onClick={handleCreateMenu}>
      <Menu.Item key="new">新建API</Menu.Item>
      <Menu.Item key="import">从RestCloud导入</Menu.Item>
    </Menu>
  )

  const handleSetting = (index: number) => {
    const schema = project.exportSchema();
    const { componentsTree } = schema;
    const dataSourceList = componentsTree[0].dataSource?.list || []
    const obj: any = dataSourceList[index]
    setEditorVisible(true)
    setEditorIndex(index);
    setTimeout(() => {
      const params = obj.options.params ? objToArr(obj.options.params) : [];
      const headers = obj.options.headers ? objToArr(obj.options.headers) : [];
      form.setFieldsValue({
        id: obj.id,
        isInit: obj.isInit,
        uri: obj.options.uri,
        params,
        method: obj.options.method,
        isCors: obj.options.isCors,
        timeout: obj.options.timeout,
        headers,
        shouldFetch: obj?.shouldFetch,
        willFetch: obj?.willFetch,
        dataHandler: obj?.dataHandler,
        errorHandler: obj?.errorHandler,
      })
    })
  }

  const handleDelete = (index: number) => {
    const dd = dataSource.filter((o: any, i: number) => i !== index)
    setDataSource(dd);
    const schema = project.exportSchema();
    const { componentsTree } = schema;
    let dataSourceList = componentsTree[0].dataSource?.list || []
    dataSourceList.splice(index, 1);
    project.importSchema(schema)
  };

  const treeDataFormat = (data: any, parent: any) => {
    return data.map((item: any) => {
      return {
        title: item.label,
        key: item.key,
        isLeaf: item.isLeaf,
        parent,
        children:
          item.children && item.children.length ? treeDataFormat(item.children, parent) : undefined,
      };
    });
  };

  const handleExpand = (key: any, { expanded, node }: any) => {
    setExpandKey(key);
    if (expanded) {
      if (!node.parent) {
        getTreeData(node.key);
      }
    }
  };

  const getTreeData = (key: any) => {
    getAppsCategoryChildren({
      categoryId: `${key}.ServiceCategory`,
      rootName: 'root',
    }).then((res) => {
      const category = JSON.parse(JSON.stringify(categoryData));
      const index = category.findIndex((o: any) => o.key === key);
      if(res.data && res.data.length){
        category[index].children = treeDataFormat(res.data, key);
      } else {
        category[index].isLeaf = true;
      }
      setCategoryData(category);
    });
  };

  const getApiData = () => {
      getApiList({
        pageNo,
        pageSize,
        filters: {
            appId,
            categoryId
        },
        searchFilters
      }).then(res => {
        const { rows, total } = res.data;
        setApiList(rows);
        setTotal(total)
      })
  }

  const onLoadData = ({ key, children }: any) =>
    new Promise<void>((resolve) => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        resolve();
      });
    });

  const onTreeSelect = (keys: any, { node }: any) => {
    if(node.isLeaf){
      setPageNo(1)
      setPageSize(10)
      if(!node.parent){
        setAppId(node.key)
      } else {
        setAppId(node.parent)
        setCategoryId(node.key)
      }
    }
  };

  const handleSearch = (value: string) => {
    setPageNo(1);
    setPageSize(10);
    setSearchFilters({
      mapUrl: value,
      configName: value
    })
  }

  const handleOk = () => {
    const items = apiList.filter((o: any) => {
      const index = selectApiKeys.findIndex(i => i === o.configId);
      return index >= 0
    })

    const schema = project.exportSchema();
    const { componentsTree } = schema;
    const dataSourceList = componentsTree[0].dataSource?.list || []
    items.forEach((item: any) => {
      const index = dataSourceList.findIndex(o => o.id === item.configId);
      if(index < 0){
        dataSourceList.push({
          type: 'axios',
          isInit: false,
          options: {
            uri: item.mapUrl,
            isCors: true,
            timeout: 20000,
            method: item.methodType,
            params: item.inputparams || {},
            headers: {}
          },
          id: item.configId
        })
      }
    })
    project.importSchema(schema)
    setDataSource([...dataSourceList])
    setVisible(false)
  }

  const handleEditorRow = () => {
    const values = form.getFieldsValue();
    const schema = project.exportSchema();
    const { componentsTree } = schema;
    const dataSourceList = componentsTree[0].dataSource?.list || [];
    const state = componentsTree[0].state;
    const methods = componentsTree[0].methods;
    const variables = {...state, ...methods}
    const isExist = dataSourceList.findIndex(o => o.id === values.id);
    if(editorIndex !== isExist && isExist >= 0){
      message.error('数据源ID已存在,请重新输入!')
      return false
    }
    if(editorIndex !== undefined){
      const item: any = dataSourceList[editorIndex]
      item.id = values.id;
      item.type = "axios",
      item.isInit = values.isInit;
      item.options.uri = values.uri;
      item.options.method = values.method;
      if(values.headers?.length){
        const obj: any = {};
        values.headers.forEach((e: any) => {
          if(e.type !== 'variables'){
            obj[e.name] = e.value
          } else {
            obj[e.name] = {
              "type": "JSExpression",
              "value": e.value
            }
          }
        })
        item.options.headers = obj;
      }
      if(values.params?.length){
        const obj: any = {};
        values.params.forEach((e: any) => {
          if(e.type !== 'variables'){
            obj[e.name] = e.value
          } else {
            obj[e.name] = {
              "type": "JSExpression",
              "value": e.value
            }
          }
        })
        item.options.params = obj;
      }
      item.options.isCors = values.isCors;
      if(values.shouldFetch) item.shouldFetch = values.shouldFetch;
      if(values.willFetch) item.willFetch = values.willFetch;
      if(values.dataHandler) item.dataHandler = values.dataHandler;
      if(values.errorHandler) item.errorHandler = values.errorHandler;
    } else {
      const new_obj: any = {
        id: values.id,
        isInit: values.isInit,
        type: "axios",
        options: {
          uri: values.uri,
          method: values.method,
          isCors: values.isCors,
        },
        shouldFetch: values.shouldFetch,
        willFetch: values.willFetch,
        dataHandler: values.dataHandler,
        errorHandler: values.errorHandler,
      }
      if(values.headers?.length){
        const obj: any = {};
        values.headers.forEach((e: any) => {
          if(e.type === 'value'){
            obj[e.name] = e.value
          } else {
            obj[e.name] = {
              "type": "JSExpression",
              "value": e.value
            }
          }
        })
        new_obj.options.headers = obj;
      }
      if(values.params?.length){
        const obj: any = {};
        values.params.forEach((e: any) => {
          if(e.type === 'value'){
            obj[e.name] = e.value
          } else {
            obj[e.name] = {
              "type": "JSExpression",
              "value": e.value
            }
          }
        })
        new_obj.options.params = obj;
      }
      dataSourceList.push(new_obj)
    }
    project.importSchema(schema);
    setDataSource([...dataSourceList])
    setEditorVisible(false)
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className="axios-data-source-wrap">
        <div className="axios-data-source-scroll">
          <div className="axios-data-source-body" style={{transform: `translate(${editorVisible ? '-50%' : '0' }, 0)`}}>
            <div className="axios-data-source-list">
              <Dropdown placement="bottom" overlay={createMenu}>
                <Button className="add-btn" type="primary">
                  添加请求接口<DownOutlined />
                </Button>
              </Dropdown>
              <Table 
                columns={columns} 
                dataSource={dataSource} 
                rowKey={({id}) => id}
                size="small" 
                bordered
                scroll={{y: 500 }}
                pagination={false} 
              />
            </div>
            <Card 
              title={
                <div>
                  <Button className="action-btn" size="small" icon={<ArrowLeftOutlined />} onClick={() => setEditorVisible(false)}></Button>
                  <span>{editorIndex ? '编辑' : '新建'}数据源</span>
                </div>
              } 
              extra={
                <Button type="link" size="small" onClick={handleEditorRow}>保存</Button>
              }
              className="axios-data-source-editor"
            >
              {
                editorVisible ? (
                  <Form form={form} labelCol={{span: 6}}>
                    <Form.Item label="数据源ID" name="id" rules={[{required: true}]}>
                      <Input />
                    </Form.Item>
                    <Form.Item label="是否自动请求" name="isInit" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item label="请求地址" name="uri" rules={[{required: true}]}>
                      <Input />
                    </Form.Item>
                    <Form.Item label="请求参数" name="params">
                      <Params />
                    </Form.Item>
                    <Form.Item label="请求方法" name="method" initialValue="GET" rules={[{required: true}]}>
                      <Select>
                        <Select.Option value="GET">GET</Select.Option>
                        <Select.Option value="POST">POST</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="是否支持跨域" name="isCors" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item label="超时时长(毫秒)" initialValue={20000} name="timeout">
                      <InputNumber />
                    </Form.Item>
                    <Form.Item label="请求头" name="headers">
                      <Params />
                    </Form.Item>
                    <Form.Item label="发起请求的计算函数" name="shouldFetch">
                      <Editor />
                    </Form.Item>
                    <Form.Item label="请求前对参数的处理函数" name="willFetch">
                      <Editor />
                    </Form.Item>
                    <Form.Item label="请求成功对结果的处理函数" name="dataHandler">
                      <Editor />
                    </Form.Item>
                    <Form.Item label="请求失败对异常的处理函数" name="errorHandler">
                      <Editor />
                    </Form.Item>
                  </Form>
                ) : ""
              }
            </Card>
          </div>
        </div>
        <Modal
          title="选择API"
          key={modalKey}
          visible={visible}
          onCancel={() => setVisible(false)}
          width={1000}
          onOk={handleOk}
        >
          <Row>
            <Col span={6}>
              <Tree
                loadData={onLoadData}
                expandedKeys={expandKey}
                treeData={categoryData}
                onExpand={handleExpand}
                onSelect={onTreeSelect}
              />
            </Col>
            <Col span={18}>
              <Input.Search 
                className="api-search"
                placeholder="URL | 服务名"
                onSearch={handleSearch}
              />
              <Table 
                columns={apiColumns}
                dataSource={apiList}
                size="small"
                bordered
                rowKey={({configId}) => configId}
                rowSelection={{
                  selectedRowKeys: selectApiKeys,
                  onChange: (keys: any) => setSelectApiKey(keys)
                }}
                pagination={{
                  current: pageNo,
                  pageSize,
                  onChange: (page, size) => {
                    setPageNo(page)
                    setPageSize(size)
                    setSelectApiKey([])
                  },
                  total,
                  showTotal: t => `共${t}项`
                }}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default AxiosDataSource;
