import { Drawer, List, Spin, Tooltip, Input, Divider, Card, Modal, Tag } from 'antd';
import { Button, Message, Loading, Dialog } from '@alifd/next';
import { FunctionComponent, useState, useEffect } from 'react';
import iojson from 'iojson';
import {
  FileSearchOutlined,
  RollbackOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  MessageTwoTone,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  getLog,
  getLogList,
  getVersionList,
  deleteLog,
  deleteVersion,
  recoverVersion,
  getVersion,
} from '../../api/version';
import { getUrlSearch } from '../../tool';
import './index.less';
import { project } from '@alilc/lowcode-engine';
const { confirm } = Modal;
const { Search } = Input;

interface versionProps {}

const VersionManager: FunctionComponent = (props: versionProps) => {
  // 用于监听控件重新打开刷新
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [versionLoading, setVersionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [logData, setLogData] = useState<any>([]);
  const [logPageNo, setLogPageNo] = useState(1);
  const [logTotal, setLogTotal] = useState(1);
  const [versionData, setVersionData] = useState<any>([]);
  const [versionPageNo, setVersionPageNo] = useState(1);
  const [versionTotal, setVersionTotal] = useState(1);
  const [logSearchVale, setLogSearchVale] = useState<string>('');
  useEffect(() => {
    loadMoreLogData('',true);
    loadMoreVersionData(true);
  }, [refresh]);
  /**
   * 下拉加载日志列表数据
   * @param searchValue 搜索框值
   * @param initFlag 初始化标识
   * @returns
   */
  const loadMoreLogData = (searchValue: string = logSearchVale, initFlag: boolean = false) => {
    if (loading) {
      return;
    }
    setLoading(true);
    let postParam = {
      pageNo: initFlag ? 1 : logPageNo,
      pageSize: 15,
      filters: { pageId: getUrlSearch('id') },
      searchFilters: {
        submitUserName: initFlag ? searchValue : logSearchVale,
        createTime: initFlag ? searchValue : logSearchVale,
      },
    };
    getLogList(postParam)
      .then((res) => {
        if (res.data.state) {
          if (initFlag) {
            setLogData(res.data.rows);
            setLogPageNo(2);
          } else {
            setLogData([...logData, ...res.data.rows]);
            setLogPageNo(logPageNo + 1);
          }
          setLogTotal(res.data.total);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };
  /**
   * 下拉加载版本列表
   * @param initFlag 初始化标识
   * @returns
   */
  const loadMoreVersionData = (initFlag: boolean = false) => {
    /**
     * 初始化请求第一页数据
     * 非初始化追加返回数据
     */
    if (versionLoading) {
      return;
    }
    setVersionLoading(true);
    let postParam = {
      pageNo: initFlag ? 1 : logPageNo,
      pageSize: 15,
      filters: { pageId: getUrlSearch('id') },
    };
    getVersionList(postParam)
      .then((res) => {
        if (res.data.state) {
          if (initFlag) {
            setVersionData(res.data.rows);
            setVersionPageNo(2);
          } else {
            setVersionData([...versionData, ...res.data.rows]);
            setVersionPageNo(versionPageNo + 1);
          }

          setVersionTotal(res.data.total);
          setVersionLoading(false);
        }
      })
      .catch(() => {
        setVersionLoading(false);
      });
  };
  /**
   * 日志搜索框搜索
   * @param value 搜索框值
   */
  const onSearch = (value: string) => {
    setLogSearchVale(value);
    loadMoreLogData(value, true);
  };
  /**
   * 删除日志
   * @param id 日志id
   */
  const deleteLogOnChange = (id: string) => {
    deleteLog({ id })
      .then((res) => {
        if (res.data.state) {
          Message.success(res.data.msg);
          loadMoreLogData(logSearchVale, true);
        } else {
          Message.error(res.data.msg);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };
  /**
   * 删除版本
   * @param id 版本id
   */
  const deleteVersionOnChange = (id: string) => {
    deleteVersion({ id })
      .then((res) => {
        if (res.data.state) {
          Message.success(res.data.msg);
          loadMoreVersionData(true);
        } else {
          Message.error(res.data.msg);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };
  /**
   * 恢复页面历史记录
   * @param id 日志id
   */
  const recoverLogOnChange = (id: String) => {
    setExportLoading(true);
    getLog({ id })
      .then((res) => {
        if (res.data.state) {
          let pageJson = JSON.parse(res.data.data.pageConfigJson);
          project.importSchema(pageJson);
        } else {
          Message.error(res.data.msg);
        }
        setExportLoading(false);
      })
      .catch(() => {
        setExportLoading(false);
      });
  };
  /**
   * 查看版本记录
   * @param id 版本id
   */
  const lookVersionOnChange = (id: String) => {
    setExportLoading(true);
    getVersion({ id })
      .then((res) => {
        if (res.data.state) {
          let pageJson = JSON.parse(res.data.data.pageConfigJson);
          project.importSchema(pageJson);
        } else {
          Message.error(res.data.msg);
        }
        setExportLoading(false);
      })
      .catch(() => {
        setExportLoading(false);
      });
  };
  /**
   * 回滚版本
   * @param pageId 页面ID
   * @param versionId 版本ID
   */
  const recoverVersionOnChange = (pageId: string, versionId: string) => {
    recoverVersion({ pageId, versionId })
      .then((res) => {
        if (res.data.state) {
          Message.success(res.data.msg);
          loadMoreVersionData(true);
        } else {
          Message.error(res.data.msg);
        }
      })
      .catch(() => {});
  };
  /**
   * 导出版本JSON
   * @param id 版本对象
   */
  const exportVersionJson = (id: string) => {
    setExportLoading(true);
    getVersion({ id })
      .then((res) => {
        if (res.data.state) {
          iojson.exportJSON(
            res.data.data,
            localStorage.getItem('pageName') + 'V' + res.data.data.version + '-' + new Date().getTime(),
          );
        } else {
          Message.error(res.data.msg);
        }
        setExportLoading(false);
      })
      .catch(() => {
        setExportLoading(false);
      });
  };
  /**
   * 确认模态框事件（当前抽屉里通用）
   * @param item 日志数据/版本数据
   * @param flag 类型标识
   */
  const showConfirm = (item: any, flag: string) => {
    // 删除日志确认
    if (flag === 'log-delete') {
      Dialog.confirm({
        title: '删除后无法恢复该记录，确定要删除该日志记录吗?',
        content: item.createTime + '-' + item.submitUserName,
        onOk() {
          deleteLogOnChange(item.id);
        },
      });
      // 恢复日志确认
    } else if (flag === 'log-recover') {
      Dialog.confirm({
        title: '恢复日志记录会覆盖当前设计，确定恢复吗?',
        content: item.createTime + '-' + item.submitUserName,
        onOk() {
          recoverLogOnChange(item.id);
        },
      });
      // 删除版本确认
    } else if (flag === 'version-look') {
      Dialog.confirm({
        title: '恢复版本记录会覆盖当前设计，确定恢复吗?',
        content: 'V' + item.version + '-' + item.publisherName + '-' + item.createTime,
        onOk() {
          lookVersionOnChange(item.id);
        },
      });
      // 删除版本确认
    } else if (flag === 'version-delete') {
      Dialog.confirm({
        title: '确定要删除该版本吗?',
        content: 'V' + item.version + '-' + item.publisherName + '-' + item.createTime,
        onOk() {
          deleteVersionOnChange(item.id);
        },
      });
      // 回滚版本确认
    } else if (flag === 'version-recover') {
      Dialog.confirm({
        title: '确定要回滚该版本吗?',
        content: 'V' + item.version + '-' + item.publisherName + '-' + item.createTime,
        onOk() {
          recoverVersionOnChange(item.pageId, item.id);
        },
      });
      //  版本导出确认
    } else if (flag === 'version-download') {
      Dialog.confirm({
        title: '确定要导出该版本数据吗?',
        content: 'V' + item.version + '-' + item.publisherName + '-' + item.createTime,
        onOk() {
          exportVersionJson(item.id);
        },
      });
    }
  };
  return (
    <div>
      <Button
        onClick={() => {
          setVisible(true);
          setRefresh(!refresh);
        }}
      >
        版本历史
      </Button>
      <Drawer
        placement="right"
        closable={false}
        visible={visible}
        onClose={() => setVisible(false)}
        maskClosable
        destroyOnClose={true}
        maskStyle={{
          background: 'rgba(0, 0, 0, 0)',
        }}
        getContainer={false}
        width="20.8%"
        style={{ maxHeight: '100%', paddingTop: '50px' }}
        bodyStyle={{ padding: '10px' }}
      >
        <Loading tip="加载中。。。" color="#0fb3b4" fullScreen={true} visible={exportLoading}>
          {/* 历史记录列表 */}
          <Card
            title={
              <span>
                <FileSearchOutlined /> 历史记录
              </span>
            }
            extra={
              <Tooltip title="刷新">
                <Button text onClick={() => loadMoreLogData(logSearchVale, true)}>
                  <ReloadOutlined />
                </Button>
              </Tooltip>
            }
            size="small"
            bordered={false}
            bodyStyle={{ padding: '10px 20px', overflow: 'hidden' }}
          >
            <Search size="small" onSearch={onSearch} placeholder="日期|创建者" allowClear />
            <div
              id="scrollableDiv"
              style={{
                marginTop: 5,
                height: 450,
                overflowY: 'auto',
              }}
            >
              <InfiniteScroll
                dataLength={logData.length}
                next={loadMoreLogData}
                hasMore={logData.length < logTotal}
                loader={
                  <div className="example">
                    <Spin />
                  </div>
                }
                endMessage={<Divider plain>数据已加载完成</Divider>}
                scrollableTarget="scrollableDiv"
              >
                <List
                  bordered={false}
                  size="small"
                  dataSource={logData}
                  renderItem={(item: any) => (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        title={
                          <span className="log-title">
                            {item.createTime}-{item.submitUserName}
                          </span>
                        }
                      />
                      <span className="log-title">
                        <Tooltip title="恢复日志">
                          <Button text onClick={() => showConfirm(item, 'log-recover')}>
                            <RollbackOutlined />
                          </Button>
                        </Tooltip>{' '}
                        <Tooltip title="删除日志">
                          <Button text onClick={() => showConfirm(item, 'log-delete')}>
                            <CloseOutlined />
                          </Button>
                        </Tooltip>
                      </span>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </Card>
          <hr />
          {/* 版本信息列表 */}
          <Card
            title={
              <span>
                <FileSearchOutlined /> 版本信息
              </span>
            }
            extra={
              <Tooltip title="刷新">
                <Button text onClick={() => loadMoreVersionData(true)}>
                  <ReloadOutlined />
                </Button>
              </Tooltip>
            }
            size="small"
            bordered={false}
            bodyStyle={{ padding: '10px 20px', overflow: 'auto' }}
          >
            <div
              id="scrollableDiv"
              style={{
                marginTop: 5,
                height: 270,
                overflowY: 'auto',
              }}
            >
              <InfiniteScroll
                dataLength={versionData.length}
                next={loadMoreVersionData}
                hasMore={versionData.length < versionTotal}
                loader={
                  <div className="example">
                    <Spin />
                  </div>
                }
                endMessage={<Divider plain>数据已加载完成</Divider>}
                scrollableTarget="scrollableDiv"
              >
                <List
                  bordered={false}
                  size="small"
                  dataSource={versionData}
                  renderItem={(item: any) => (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        title={
                          <span className="log-title">
                            <Tooltip
                              title={
                                <span>
                                  <p>版本说明|描述:</p>
                                  <p>{item.message}</p>
                                </span>
                              }
                            >
                              <Button text onClick={() => {}}>
                                <MessageTwoTone twoToneColor="#0fb3b4" />
                              </Button>
                            </Tooltip>{' '}
                            <Tooltip title="恢复版本记录">
                              <a onClick={() => showConfirm(item, 'version-look')}>
                                V{item.version}-{item.publisherName}-{item.createTime}
                              </a>
                            </Tooltip>
                          </span>
                        }
                      />
                      <span className="log-title">
                        {item.status === '1' ? (
                          <Tooltip title="当前发布使用的版本">
                            <Tag color="#0fb3b4" style={{ padding: '0 1', margin: 0 }}>
                              已发布
                            </Tag>
                          </Tooltip>
                        ) : (
                          <span>
                            <Tooltip title="回滚版本">
                              <Button text onClick={() => showConfirm(item, 'version-recover')}>
                                <RollbackOutlined />
                              </Button>
                            </Tooltip>{' '}
                            <Tooltip title="删除版本">
                              <Button text onClick={() => showConfirm(item, 'version-delete')}>
                                <CloseOutlined />
                              </Button>
                            </Tooltip>
                          </span>
                        )}{' '}
                        <Tooltip title="导出版本配置">
                          <Button text onClick={() => showConfirm(item, 'version-download')}>
                            <DownloadOutlined />
                          </Button>
                        </Tooltip>
                      </span>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </Card>
        </Loading>
      </Drawer>
    </div>
  );
};

export default VersionManager;
