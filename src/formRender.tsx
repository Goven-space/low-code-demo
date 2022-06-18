import ReactDOM from 'react-dom';
// import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState, FunctionComponent, useRef } from 'react';
import { ConfigProvider, Layout, Drawer, Space, Button, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import FormRender, { useForm } from 'form-render';
import './workbench.less';
import { getFromRender } from './api/bpm';
import {get} from './api'
import 'antd/dist/antd.less';
import { getUrlSearch } from './tool';
import dayjs from 'dayjs';

dayjs.locale('zh-cn')

const defaultValue = {
    type: 'object',
    properties: {
       
    },
};

const FormRenderWrap: FunctionComponent = () => {
    const [formValues, setFormValues] = useState(defaultValue);
    const [id, setId] = useState('')
    const form = useForm();

    useEffect(() => {
        const formId = getUrlSearch('id');
        loadFormRender(formId);
    }, []);

    const loadFormRender = (formId) => {
        getFromRender(formId).then((res) => {
            const { status, data } = res;
            if (status === 200) {
                data.data.formConfigJson &&
                    setFormValues(JSON.parse(data.data.formConfigJson));
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
    };

    return (
        <ConfigProvider locale={zhCN}>
            <Layout className="layout-wrapper">
                <Layout.Header className="layout-header">
                    <div className="logo">表单管理</div>
                    <Space>
                        <div style={{ color: 'white' }}>
                            <Avatar src="/avatar.png" size={32} style={{ backgroundColor: '#7265e6' }} />{' '}
                            {localStorage.getItem('userName')} 您好 {dayjs().format('M月D日 dddd')}
                        </div>
                        <Button
                            className="header-btn"
                            icon={<LogoutOutlined />}
                            onClick={handleLogOut}
                        >
                            退出
            </Button>
                    </Space>
                </Layout.Header>
                <Layout className="layout-body">
                    <div className="formRender-container">
                        <FormRender
                            form={form}
                            schema={formValues}
                            widgets={{
                            }}
                        // watch={watch}
                        // onFinish={handleSave}
                        />
                    </div>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

ReactDOM.render(<FormRenderWrap />, document.getElementById('formRenderWrap'));
