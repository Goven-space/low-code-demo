import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Layout, message } from "antd";
import React, { useEffect, useState, FunctionComponent, useRef } from 'react';
import ReactDOM from 'react-dom';
import './login.less';
import Footer from './footer';
import { baseURL } from "./api";
import { userLogin } from './api/login';
import { setCookie } from './tool'

const Login: FunctionComponent = () => {
    // const { baseURL, setBaseURL } = useContext(MainContext);
    // const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const onFinish = async (values:any) => {
        userLogin({
            ...values
        }).then((res) => {
            const { identitytoken, userId, userName, state, msg,appKey} = res.data;
            if(state){
                // localStorage.setItem("serverHost", values.serverHost);
                localStorage.setItem("identitytoken", identitytoken);
                localStorage.setItem("userId", userId);
                localStorage.setItem("userName", userName);
                localStorage.setItem("appKey",appKey)
                setCookie("identitytoken", identitytoken);
                setCookie("userId", userId);
                setCookie("userName", userName);
                setCookie("appKey",appKey)
                window.location.href= `./workbench.html`
            } else {
                message.error(msg)
            }
        })
    }
    
    const img = require('./assets/logo.png')

    return (
        <Layout className="login-wrapper">
            <Layout.Header className="login-header">
                <img src={img.default} alt="LOGO" />
                <span>系统登录</span>
            </Layout.Header>
            <Layout.Content className="login-body">
                <Card className="login-form" title="系统登录">
                    <Form form={form} name="login" labelCol={{ span: 3 }} onFinish={onFinish}>
                        {/* <Form.Item
                            className="mb0"
                            name="serverHost"
                            label="服务器"
                            initialValue={baseURL}
                            rules={[{ required: true }]}
                            extra="请指定要登录的后端API服务器的URL地址"
                        >
                            <Input />
                        </Form.Item> */}
                        <Form.Item name="userName" label="用户名" rules={[{ required: true }]}>
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                            <Input.Password prefix={<LockOutlined />} visibilityToggle={false} />
                        </Form.Item>
                        <Form.Item extra={<p className="login-tips">请使用谷歌或火狐浏览器登录本系统...</p>}>
                            <Button className="login-btn" type="primary" /* loading={loading} */ htmlType="submit">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Layout.Content>
            <Layout.Footer className="login-footer">
                <Footer />
            </Layout.Footer>
        </Layout>
    );
};


ReactDOM.render(<Login />, document.getElementById('login'));
