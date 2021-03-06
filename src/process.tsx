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
            <div>????????????</div>
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
            ?????????????????????????????? ??????????????????<span>{currentState}</span>???
        </span>
    );

    const viewTitle = (
        <div className="viewTitle_less">
            <span>?????????</span>
            <div>
                <Space>
                    <Space>
                        <div style={{ width: '13px', height: '13px', background: '#10B3B3' }}></div>
                        <span style={{ fontSize: 12 }}>???????????????</span>
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
                            <span style={{ fontSize: 12 }}>???????????????</span>
                        </Col>
                    </Space>
                    <Space>
                        <Col>
                            <div
                                style={{ width: '13px', height: '13px', background: '#A7A7A7' }}
                            ></div>
                        </Col>
                        <Col>
                            <span style={{ fontSize: 12 }}>???????????????</span>
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
                            {userName} ?????? {dayjs().format('M???D??? dddd')}
                        </div>
                        <button className="header-btn-mywork" onClick={handleMywork}>
                            <ExportOutlined /> ???????????????
                        </button>
                        <button className="header-btn" onClick={handleLogOut}>
                            <LogoutOutlined />
                            ??????
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
                                        <b>???????????????</b>
                                        <span>{currentState}</span>
                                    </Space>
                                </Col>
                                <Col span={5}>
                                    <Space style={{ fontSize: 12 }}>
                                        <CopyOutlined style={{ color: '#0fb3b4' }} />
                                        <b>??????????????????</b>
                                        <span>??????????????????</span>
                                    </Space>
                                </Col>
                                <Col span={5}>
                                    <Space style={{ fontSize: 12 }}>
                                        <CopyOutlined style={{ color: '#0fb3b4' }} />
                                        <b>????????????</b>
                                        <span>??????????????????</span>
                                    </Space>
                                </Col>
                                <Col span={5}>
                                    <Space style={{ fontSize: 12 }}>
                                        <CopyOutlined style={{ color: '#0fb3b4' }} />
                                        <b>????????????</b>
                                        <span>2022-5-27 11:54:03</span>
                                    </Space>
                                </Col>
                                <Col span={4}>
                                    <Space>
                                        <Button type="primary" onClick={handleLogClick}>
                                            ??????????????????
                                        </Button>
                                        <Button type="primary" onClick={handleProcessClick}>
                                            ???????????????
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
                                    <div>????????????</div>
                                </Space>
                            }
                            bordered={false}
                        >
                            <Card style={{ marginTop: 20 }} bordered={false}>
                                <span style={{ fontSize: 12, color: '#0fb3b4' }}>???????????????</span>
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
                                    <Panel key="1" header="???????????????">
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
                                    <Button type="text">??????</Button>
                                    <Button type="text">??????</Button>
                                    <Button type="text">????????????</Button>
                                </Space>
                            </div>
                        </Card>
                        <Drawer
                            visible={visible}
                            onClose={onClose}
                            width={500}
                            title="????????????????????????????????????"
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
