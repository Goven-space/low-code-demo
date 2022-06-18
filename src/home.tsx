import ReactDOM from 'react-dom';
import React, { useEffect, useState, FunctionComponent } from 'react';
import { ConfigProvider, Layout, Menu, Badge, Breadcrumb, Space, Button,Avatar } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import Icon from './component/icon';
import { getMenu } from './api/bpm';
import Content from './pages/content';
import InitiateNewProcess from './component/initiateNewProcess';
import './home.less';
import { LogoutOutlined, ExportOutlined } from '@ant-design/icons';
import { getUrlSearch, getTime,clearCookie } from './tool';
import dayjs from 'dayjs';
import Footer from '../src/footer'

dayjs.locale('zh-cn')
let userName = localStorage.getItem("userName")
const SamplePreview: FunctionComponent = () => {
  const [menuData, setMenuData] = useState([]);
  const [pageId, setPageId] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [breadCrunmName, setBreadCrunmName] = useState('');
  const [title, setTitle] = useState("");
  const [appId, setAppId] = useState("");
  useEffect(() => {
    getMenu(getUrlSearch('rc_appId') || 'bpm_todo').then((res) => {
      setMenuData(res.data.data);
      let item = res.data.data[0]
      setTitle(res.data.appName)
      const hostValue = getUrlSearch("menuKey")
      const initArray = res.data.data.filter(o => o.nodeId === hostValue)
      //当路由后缀没有menuKey时
      setSelectedKeys([initArray && initArray.length ? (initArray[0].pageId || initArray[0].nodeId) :item.pageId]);
      setBreadCrunmName(initArray&&initArray.length?initArray[0].menuName:item.menuName);
      if(initArray&&initArray.length){
        const page = initArray[0].pageType === '0' ? initArray[0].pageId : initArray[0].url;
        setPageId(page);
      } else {
        const skipAppId = getUrlSearch("bpm_appId")
        const itemPage = item.pageType === "0" ? item.pageId : item.url
        setAppId(skipAppId)
        setPageId(itemPage);
      }
    });
  }, []);

  const MenuTemplate = (data: any) => {
    return data.map((item: any) => {
      if (item.children) {
        return (
          <Menu.SubMenu
            key={item.pageType === '0' ? item.pageId : item.url}
            title={item.menuName}
            icon={item.icon ? <Icon type={item.icon} /> : undefined}
          >
            {MenuTemplate(item.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={item.pageType === '0' ? (item.pageId || item.nodeId) : item.url}
            icon={item.icon ? <Icon type={item.icon} /> : undefined}
            onClick={() => handleMenuClick(item)}
          >
            <span>{item.menuName}</span>
            {item.count ? (
              <Badge
                count={item.count}
                style={{ backgroundColor: '#52c41a' }}
                offset={[5, -3]}
              ></Badge>
            ) : (
              ''
            )}
          </Menu.Item>
        );
      }
    });
  };

  const handleMenuClick = (item: any) => {
    setBreadCrunmName(item.menuName);
    if (item.pageType === '0') {
      setPageId(item.pageId);
      
      setSelectedKeys([item.pageId || item.nodeId]);
    } else {
      window.open(item.url);
    }
  };

  const handleLogOut = () => {
    window.location.href = `./login.html`;
    clearCookie()
  }

  const handleMywork = () => {
    window.location.href = `./workbench.html`;
  }

  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="layout-wrapper">
        <Layout.Header className="layout-header">
          <div className="logo">{title}</div>
          <Space>
            <div style={{ color: 'white' }}>
            <Avatar src="/avatar.png" size={32} style={{ backgroundColor: '#7265e6' }} />{' '}
              {userName} 您好 {dayjs().format('M月D日 dddd')}
            </div>
            <button
            className="header-btn-mywork"
            onClick={handleMywork}
            >
              <ExportOutlined />{' '}
              返回工作台
            </button>
            <button
              className="header-btn"
              onClick={handleLogOut}
            >
              <LogoutOutlined />
              退出
            </button>
          </Space>
        </Layout.Header>
        <Layout className="layout-body">
          <Layout.Sider theme="light">
            <Menu selectedKeys={selectedKeys}>{MenuTemplate(menuData)}</Menu>
          </Layout.Sider>
          <Layout.Content className="layout-content">
            <Breadcrumb style={{ padding: 20 }}>
              <Breadcrumb.Item>{breadCrunmName}</Breadcrumb.Item>
            </Breadcrumb>
            {pageId && <Content pageId={pageId} />}
            {selectedKeys[0] === 'Initiate_new_process' && <InitiateNewProcess appId={appId} />}
            <Layout.Footer>
              <Footer />
            </Layout.Footer>
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

ReactDOM.render(<SamplePreview />, document.getElementById('ice-container'));
