import ReactDOM from 'react-dom';
// import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState, FunctionComponent, useRef } from 'react';
import { ConfigProvider, Layout, Drawer, Space, Button, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import FormRender, { useForm } from 'form-render';
import './workbench.less';
import ChartModule from './component/widgets/chartModule';
import CommonApp from './component/widgets/commonApp';
import TodoButton from './component/widgets/todoButton';
import WorkbenchDesign from './workbenchDesign';
import { getForm } from './api/workbench';
import 'antd/dist/antd.less';
import { clearCookie } from './tool';
import dayjs from 'dayjs';
import Footer from './footer'

dayjs.locale('zh-cn')

let userName = localStorage.getItem("userName")

const defaultValue = {
  type: "object",
  properties: {
    todoButton_wQQbKA: {
      title: "",
      type: "array",
      widget: "todoButton"
    }
  }
};

const Workbench: FunctionComponent = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [id, setId] = useState('');
  const [workbenchValues, setWorkbenchValues] = useState(defaultValue);
  const form = useForm();

  useEffect(() => {
    loadWorkbench();
  }, []);

  const loadWorkbench = () => {
    getForm().then((res) => {
      const { data } = res;
      if (data.state) {
        setId(data.data.id);
        data.data.workbenchConfigJson &&
          setWorkbenchValues(JSON.parse(data.data.workbenchConfigJson));
      }
    });
  };

  const handleClick = () => {
    setShowDrawer(true);
  };

  const handleClose = () => {
    setShowDrawer(false);
  };

  const handleLogOut = () => {
    window.location.href = `./login.html`;
    clearCookie()
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="layout-wrapper">
        <Layout.Header className="layout-header">
          <div className="logo">工作台</div>
          <Space>
            <button className="editBtn" onClick={handleClick}>
              自定义工作台
            </button>
            <div style={{ color: 'white' }}>
              <Avatar src="/avatar.png" size={32} style={{ backgroundColor: '#7265e6' }} />{' '}
              {userName} 您好 {dayjs().format('M月D日 dddd')}
            </div>
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
          <Drawer
            title="自定义工作台"
            placement="bottom"
            closable
            onClose={handleClose}
            visible={showDrawer}
            key="bottom"
            destroyOnClose
            height={'95%'}
          >
            <WorkbenchDesign
              refresh={loadWorkbench}
              closeDrawer={handleClose}
              values={workbenchValues}
              id={id}
            />
          </Drawer>
          <div className="formRender-container">
            <FormRender
              form={form}
              schema={workbenchValues}
              widgets={{
                chartModule: (options) => <ChartModule options={options} />,
                commonApp: (options) => <CommonApp options={options} />,
                todoButton: TodoButton
              }}
            // watch={watch}
            // onFinish={handleSave}
            />
          </div>
        </Layout>
      </Layout>
      <Layout.Footer className="workbench-footer-wrapper">
        <Footer />
      </Layout.Footer>
    </ConfigProvider>
  );
};

ReactDOM.render(<Workbench />, document.getElementById('workbench'));
