import ReactDOM from 'react-dom';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import {
    ConfigProvider,
    Layout,
    Space,
    Avatar,
    Card,
    Row,
    Col,
    Button,
    Collapse,
    Drawer,
    Divider,
} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import './process.less';
import {
    LogoutOutlined,
    ExportOutlined,
    PlusSquareOutlined,
    MinusSquareOutlined,
} from '@ant-design/icons';
import { clearCookie, getUrlSearch } from './tool';
import dayjs from 'dayjs';
import { CopyOutlined } from '@ant-design/icons';
import Content from './pages/formContent';
import Footer from '../src/footer';
import { getFormData } from '../src/api/login';
import ApprovalLog from './pages/ApprovalLog';
import ProcessView from './pages/ProcessView';
import FormApporval from './component/widgets/formComponents/formApproval';
import ApprovalBtnGroup from './component/widgets/formComponents/approvalBtnGroup';

dayjs.locale('zh-cn');
const { Panel } = Collapse;
let userName = localStorage.getItem('userName');
let processId = getUrlSearch('processId');

const NewProcess: FunctionComponent = (props) => {
    const [processData, setProcessData] = useState({});
    const [buttonList, setButtonList] = useState('');
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState('');
    const [docUnid, setDocUnid] = useState('');
    const [title, setTitle] = useState('');
    const [currentState, setCurrentState] = useState('');
    const [processVisible, setProcessVisible] = useState(false);

    const approvalRef = useRef();

    const ref = useRef();

    useEffect(() => {
        getFormDataList();
    }, []);

    const getFormDataList = () => {
        getFormData({
            processId
        }).then((res) => {
            const { data } = res.data;
            const { formData } = data;
            setId(data.masterFormConfig.id || data.masterFormConfig.orUnId);
            setProcessData(data);
            setTitle(formData.WF_ProcessName);
            setCurrentState(formData.WF_CurrentNodeName);
            setDocUnid(formData.wf_docunid);
            const { ToolbarList } = data.currentModNodeDoc;
            setButtonList(ToolbarList);
        });
    };

    const handleMywork = () => {
        window.location.href = `./workbench.html`;
    };

    const handleLogOut = () => {
        window.location.href = `./login.html`;
        clearCookie();
    };

    const cardContent = (
        <Space>
            <div style={{ width: '4px', height: '15px', background: '#0fb3b4' }}></div>
            <div>审批详情</div>
        </Space>
    );

    const handleLogClick = () => {
        setVisible(true);
    };

    const handleProcessClick = () => {
        setProcessVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };
    const processViewClose = () => {
        setProcessVisible(false);
    };

    const getApprovalFormData = () => {
        const { nextNodeList, masterFormConfig } = processData;
        const rcFormData = window.rcFormData || {};
        const data = { ...rcFormData };
        data.WF_DocUnid = docUnid;
        data.WF_Processid = processId;
        data.WF_NextNodeid = nextNodeList[0].Nodeid;
        data.WF_NewDocFlag = processId ? true : false;
        const { copyToSelectedList, participatorData } = approvalRef.current;
        let nextUserList = '';
        let userList: string[] = [];
        participatorData.forEach((item) => {
            nextUserList && (nextUserList += ',');
            nextUserList += `${item.Userid}$${data.WF_NextNodeid}`;
            userList.push(item.Userid);
        });
        data.WF_NextUserList = nextUserList;
        data.userList = userList;
        let WF_SelCopyUser_show = '';
        let WF_CopyUserList = '';
        copyToSelectedList.forEach((item) => {
            WF_SelCopyUser_show && (WF_SelCopyUser_show += ',');
            WF_SelCopyUser_show += item.CnName;
            WF_CopyUserList && (WF_CopyUserList += ',');
            WF_CopyUserList += item.Userid;
        });
        data.WF_SelCopyUser_show = WF_SelCopyUser_show;
        data.WF_CopyUserList = WF_CopyUserList;
        data.WF_SelCopyUser = WF_CopyUserList;
        data.WF_Action = 'EndUserTask';
        data.WF_Appid = masterFormConfig.appId;
        return data;
    };

    const header = (
        <span>
            请填写以下信息再提交 （当前节点：<span>{currentState}</span>）
        </span>
    );

    const viewTitle = (
        <div className="viewTitle_less">
            <span>流程图</span>
            <div>
                <Space>
                    <Space>
                        <div style={{ width: '13px', height: '13px', background: '#10B3B3' }}></div>
                        <span style={{ fontSize: 12 }}>处理中节点</span>
                    </Space>
                    <Space>
                        <Col>
                            <div
                                style={{
                                    width: '13px',
                                    height: '13px',
                                    background: 'rgba(16, 179, 179, 0.1)',
                                }}
                            ></div>
                        </Col>
                        <Col>
                            <span style={{ fontSize: 12 }}>已流转节点</span>
                        </Col>
                    </Space>
                    <Space>
                        <Col>
                            <div
                                style={{ width: '13px', height: '13px', background: '#A7A7A7' }}
                            ></div>
                        </Col>
                        <Col>
                            <span style={{ fontSize: 12 }}>未流转节点</span>
                        </Col>
                    </Space>
                </Space>
            </div>
            <div className="delete_less"></div>
        </div>
    );

    return (
        <ConfigProvider locale={zhCN}>
            <Layout className="layout-wrapper">
                <Layout.Header className="layout-header">
                    <div className="logo">{title}</div>
                    <Space>
                        <div style={{ color: 'white' }}>
                            <Avatar
                                src="/avatar.png"
                                size={32}
                                style={{ backgroundColor: '#7265e6' }}
                            />{' '}
                            {userName} 您好 {dayjs().format('M月D日 dddd')}
                        </div>
                        <button className="header-btn-mywork" onClick={handleMywork}>
                            <ExportOutlined /> 返回工作台
                        </button>
                        <button className="header-btn" onClick={handleLogOut}>
                            <LogoutOutlined />
                            退出
                        </button>
                    </Space>
                </Layout.Header>
                <Layout className="layout-body">
                    <Layout.Content className="layout-content">
                        <Card title={cardContent} bordered={false}>
                            <Row style={{ marginLeft: 20 }}>
                                <Col span={5}>
                                    <Space style={{ fontSize: 12 }}>
                                        <CopyOutlined style={{ color: '#0fb3b4' }} />
                                        <b>当前状态：</b>
                                        <span>{currentState}</span>
                                    </Space>
                                </Col>
                                <Col span={5}>
                                    <Space style={{ fontSize: 12 }}>
                                        <CopyOutlined style={{ color: '#0fb3b4' }} />
                                        <b>当前处理人：</b>
                                        <span>公司主管领导</span>
                                    </Space>
                                </Col>
                                <Col span={5}>
                                    <Space style={{ fontSize: 12 }}>
                                        <CopyOutlined style={{ color: '#0fb3b4' }} />
                                        <b>申请人：</b>
                                        <span>公司主管领导</span>
                                    </Space>
                                </Col>
                                <Col span={5}>
                                    <Space style={{ fontSize: 12 }}>
                                        <CopyOutlined style={{ color: '#0fb3b4' }} />
                                        <b>申请时间</b>
                                        <span>2022-5-27 11:54:03</span>
                                    </Space>
                                </Col>
                                <Col span={4}>
                                    <Space>
                                        <Button type="primary" onClick={handleLogClick}>
                                            查看审批日记
                                        </Button>
                                        <Button type="primary" onClick={handleProcessClick}>
                                            查看流程图
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            style={{ marginTop: '20px' }}
                            title={
                                <Space>
                                    <div
                                        style={{
                                            width: '4px',
                                            height: '15px',
                                            background: '#0fb3b4',
                                        }}
                                    ></div>
                                    <div>流程表单</div>
                                </Space>
                            }
                            bordered={false}
                        >
                            <Card style={{ marginTop: 20 }} bordered={false}>
                                <span style={{ fontSize: 12, color: '#0fb3b4' }}>流程主表单</span>
                                <Content pageId={id} />
                            </Card>
                            <Divider />
                            <Card bordered={false}>
                                <Collapse
                                    bordered={false}
                                    defaultActiveKey={['1']}
                                    style={{ marginTop: 20 }}
                                    expandIcon={({ isActive }) =>
                                        isActive ? (
                                            <MinusSquareOutlined style={{ color: '#0fb3b4' }} />
                                        ) : (
                                            <PlusSquareOutlined style={{ color: '#0fb3b4' }} />
                                        )
                                    }
                                >
                                    <Panel key="1" header="流程子表单">
                                        {/* <Content pageId="LOWCODE_PAGE_220601004"  ref={ref}/> */}
                                        {/* <Content pageId="LOWCODE_PAGE_220527003" /> */}
                                    </Panel>
                                </Collapse>
                            </Card>
                            <Divider />
                            <Card bordered={false}>
                                <Collapse
                                    bordered={false}
                                    defaultActiveKey={['1']}
                                    expandIcon={({ isActive }) =>
                                        isActive ? (
                                            <MinusSquareOutlined style={{ color: '#0fb3b4' }} />
                                        ) : (
                                            <PlusSquareOutlined style={{ color: '#0fb3b4' }} />
                                        )
                                    }
                                    style={{ marginTop: 20 }}
                                >
                                    <Panel
                                        key="1"
                                        header={header}
                                        style={{ backgroundColor: '#fff' }}
                                    >
                                        <FormApporval ref={approvalRef} processData={processData} />
                                    </Panel>
                                </Collapse>
                            </Card>
                            <Divider />
                            <div style={{ marginTop: 20 }}>
                                <Space>
                                    <ApprovalBtnGroup
                                        btnList={buttonList}
                                        getApprovalFormData={getApprovalFormData}
                                    />
                                    <Button type="text">收藏</Button>
                                    <Button type="text">打印</Button>
                                    <Button type="text">安全日记</Button>
                                </Space>
                            </div>
                        </Card>
                        <Drawer
                            visible={visible}
                            onClose={onClose}
                            width={500}
                            title="查看流转记录含审批和阅读"
                        >
                            <ApprovalLog />
                        </Drawer>
                        <Drawer
                            visible={processVisible}
                            onClose={processViewClose}
                            width={500}
                            title={viewTitle}
                            closable={false}
                        >
                            <ProcessView />
                        </Drawer>
                        <Layout.Footer>
                            <Footer />
                        </Layout.Footer>
                    </Layout.Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

ReactDOM.render(<NewProcess />, document.getElementById('process'));
