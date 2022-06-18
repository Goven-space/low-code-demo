import {
    createGraphConfig,
    JsonSchemaForm,
    NsJsonSchemaForm,
    NsNodeCmd,
    useXFlowApp,
    XFlowNodeCommands,
    IEvent,
} from '@antv/xflow';
import { Drawer, Button, Form, Tabs, Space } from 'antd';
import { FC, useState, ReactElement } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { getSelectData } from './apiList';
import InnerSubProcess from './innerSubProcess';
import InnerExtendConfig from './innerSubProcess/extendConfig';
import InnerEventSetting from './innerSubProcess/eventSetting';
import InnerXmlCode from './innerSubProcess/xmlCode';
import ExternalSubProcess from './externalSubProcess';
import ExternalSystemSetting from './externalSubProcess/systemSetting';
import ExternalEventSetting from './externalSubProcess/eventSetting';
import ExternalTimeLimit from './externalSubProcess/timeLimit';
import ExternalXmlCode from './externalSubProcess/xmlCode';
import AutomatedActivity from './automatedActivity';
import AutomatedDataOutflow from './automatedActivity/dataOutflow';
import AutomatedSendEmail from './automatedActivity/sendEmail';
import AutomatedSendMsg from './automatedActivity/sendMsg';
import AutomatedEventSetting from './automatedActivity/eventSetting';
import AutomatedEventXmlCode from './automatedActivity/xmlCode';
import HumanActivity from './humanActivity';
import HumanExtendConfig from './humanActivity/extendConfig';
import ForwardCirculation from './humanActivity/forwardCirculation';
import HumanActionBtns from './humanActivity/actionBtns';
import HumanFormSetting from './humanActivity/formSetting';
import HumanEventSetting from './humanActivity/eventSetting';
import HumanFieldsAuthority from './humanActivity/fieldsAuthority';
import HumanApplyOpinion from './humanActivity/applyOpinion'
import HumanTimeLimit from './humanActivity/timeLimit';
import HumanEmailSetting from './humanActivity/emailSetting';
import HumanXmlCode from './humanActivity/xmlCode';
import Gateway from './gateway';
import GatewayEventSetting from './gateway/eventSetting';
import GatewayXmlCode from './gateway/xmlCode';
import FlowStart from './flowStart';
import FlowStartEventSetting from './flowStart/eventSetting';
import FlowStartXmlCode from './flowStart/xmlCode';
import FlowEnd from './flowEnd';
import FlowEndEventSetting from './flowEnd/eventSetting';
import FlowEndXmlCode from './flowEnd/xmlCode';
import FlowEvent from './flowEvent';
import FlowEventSetting from './flowEvent/eventSetting';
import FlowEventXmlCode from './flowEvent/xmlCode';

interface NodeConfigProps {
    show?: boolean;
    setShow?: (bol: boolean) => void;
    data?: any;
}

const nodeName: any = {
    'inner-sub-process': '内部子流程',
    'external-sub-process': '外部子流程',
    'automated-activity': '自动活动',
    'human-activity': '人工活动',
    gateway: '网关',
    'flow-start': '流程开始',
    'flow-end': '流程结束',
    'flow-event': '事件',
};

const treeDataFormat = (data: any) => {
    return data.map((item: any) => {
        let obj: any = {
            title: item.text,
            value: item.id,
        };
        if (item.children) {
            obj.children = treeDataFormat(item.children);
        }
        return obj;
    });
};

const NodeConfig: FC<NodeConfigProps> = ({ show: flowConfigShow, setShow, data: nodeData }) => {
    const app = useXFlowApp();
    const [subProcessData, setSubProcessData] = useState([]);
    const [processRuleData, setProcessRuleData] = useState([]);
    const [form] = Form.useForm();

    const formSchemaService = async (args: any) => {
        var _a;
        const { targetType } = args;
        const isGroup = (_a = args.targetData) === null || _a === void 0 ? void 0 : _a.isGroup;
        const groupSchema = {
            tabs: [
                {
                    name: '设置',
                    groups: [
                        {
                            name: 'groupName',
                            controls: [
                                {
                                    label: '分组名',
                                    name: 'group-service',
                                    shape: 'group-service',
                                    placeholder: '分组名称',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        const nodeSchema = {
            tabs: [
                {
                    name: '设置',
                    groups: [
                        {
                            name: 'groupName',
                            controls: [
                                {
                                    label: '节点名',
                                    name: 'node-service',
                                    shape: 'node-service',
                                    placeholder: '节点名称',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        const edgeSchema = {
            tabs: [
                {
                    name: '设置',
                    groups: [
                        {
                            name: 'groupName',
                            controls: [
                                {
                                    label: '边',
                                    name: 'edge-service',
                                    shape: 'edge-service',
                                    placeholder: '边名称',
                                    strokeDasharray: false,
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        if (isGroup) {
            return groupSchema;
        }
        if (targetType === 'node') {
            return nodeSchema;
        }
        if (targetType === 'edge') {
            return edgeSchema;
        }
        return {
            tabs: [
                {
                    name: '设置',
                    groups: [
                        {
                            name: 'groupName',
                            controls: [
                                {
                                    label: '',
                                    name: 'canvas-service',
                                    shape: 'canvas-service',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    };

    const getTreeData = async () => {
        await getSelectData('wf_num=R_S002_B016').then((res: any) => {
            setSubProcessData(treeDataFormat(res.data));
        });
        await getSelectData('wf_num=R_S010_B001').then((res: any) => {
            setProcessRuleData(treeDataFormat(res.data));
        });
    };

    const getCustomRenderComponent: NsJsonSchemaForm.ICustomRender = (targetType, targetData) => {
        if (targetType === 'node' && targetData) {
            if (!subProcessData.length || !processRuleData.length) {
                // if (targetData.name === 'inner-sub-process') {
                    getTreeData();
                // }
            }
            return () => <></>;
        }
        return () => <></>;
    };

    const onClose = () => {
        setShow && setShow(false);
    };

    const drawerTitle =
        nodeData && nodeData.name ? (
            <div className="config-header">
                <div>{nodeName[nodeData.name]}</div>
                <div>
                    <CloseOutlined className="config-close" onClick={onClose} />
                </div>
            </div>
        ) : (
            ''
        );
    const element: any = {
        'inner-sub-process': [
            <Tabs.TabPane tab="基本属性" key="basic">
                <InnerSubProcess {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="扩展属性" key="extend">
                <InnerExtendConfig {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="事件设置" key="event">
                <InnerEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML源码" key="xml">
                <InnerXmlCode
                    data={nodeData}
                    value={`<Items>
    <WFItem name="ExtNodeType">subProcess</WFItem>
    <WFItem name="NodeName">zmm-test</WFItem>
    <WFItem name="WF_OrUnid">eb91fb720fb34048450801305ed5f75f2542</WFItem>
    <WFItem name="StartProcessRuleNum"></WFItem>
    <WFItem name="SubProcessid"></WFItem>
    <WFItem name="ExceedTime">(0)</WFItem>
    <WFItem name="StartSubNodeid"></WFItem>
    <WFItem name="SubCopyData"></WFItem>
    <WFItem name="ExtSubProcessid"></WFItem>
    <WFItem name="subCopyAttach"></WFItem>
    <WFItem name="SubProcessType">subProcess</WFItem>
    <WFItem name="undefined"></WFItem>
    <WFItem name="NodeType">SubProcess</WFItem>
    <WFItem name="Nodeid">S10012</WFItem>
    <WFItem name="SubRuleNum"></WFItem>
    <WFItem name="Processid">922b4204009bb04dcb0b4040559f4bb6840e</WFItem>
    <WFItem name="StartMulInsByUserid"></WFItem>
</Items>`}
                />
            </Tabs.TabPane>,
        ],
        'external-sub-process': [
            <Tabs.TabPane tab="基本属性" key="basic">
                <ExternalSubProcess {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="外部系统设置" key="system">
                <ExternalSystemSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="事件设置" key="event">
                <ExternalEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="时限设置" key="timelimit">
                <ExternalTimeLimit {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML源码" key="xml">
                <ExternalXmlCode
                    value={`<Items>
    <WFItem name="ExtNodeType">subProcess</WFItem>
    <WFItem name="NodeName">zmm-test</WFItem>
    <WFItem name="WF_OrUnid">eb91fb720fb34048450801305ed5f75f2542</WFItem>
    <WFItem name="StartProcessRuleNum"></WFItem>
    <WFItem name="SubProcessid"></WFItem>
    <WFItem name="ExceedTime">(0)</WFItem>
    <WFItem name="StartSubNodeid"></WFItem>
    <WFItem name="SubCopyData"></WFItem>
    <WFItem name="ExtSubProcessid"></WFItem>
    <WFItem name="subCopyAttach"></WFItem>
    <WFItem name="SubProcessType">subProcess</WFItem>
    <WFItem name="undefined"></WFItem>
    <WFItem name="NodeType">SubProcess</WFItem>
    <WFItem name="Nodeid">S10012</WFItem>
    <WFItem name="SubRuleNum"></WFItem>
    <WFItem name="Processid">922b4204009bb04dcb0b4040559f4bb6840e</WFItem>
    <WFItem name="StartMulInsByUserid"></WFItem>
</Items>`}
                />
            </Tabs.TabPane>,
        ],
        'automated-activity': [
            <Tabs.TabPane tab="基本属性" key="basic">
                <AutomatedActivity {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="数据流出" key="dataOutflow">
                <AutomatedDataOutflow {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="发送邮件" key="sendEmail">
                <AutomatedSendEmail {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="发送短信" key="sendMsg">
                <AutomatedSendMsg {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="事件设置" key="event">
                <AutomatedEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML源码" key="xml">
                <AutomatedEventXmlCode
                    value={`<Items>
<WFItem name="ExtNodeType">subProcess</WFItem>
<WFItem name="NodeName">zmm-test</WFItem>
<WFItem name="WF_OrUnid">eb91fb720fb34048450801305ed5f75f2542</WFItem>
<WFItem name="StartProcessRuleNum"></WFItem>
<WFItem name="SubProcessid"></WFItem>
<WFItem name="ExceedTime">(0)</WFItem>
<WFItem name="StartSubNodeid"></WFItem>
<WFItem name="SubCopyData"></WFItem>
<WFItem name="ExtSubProcessid"></WFItem>
<WFItem name="subCopyAttach"></WFItem>
<WFItem name="SubProcessType">subProcess</WFItem>
<WFItem name="undefined"></WFItem>
<WFItem name="NodeType">SubProcess</WFItem>
<WFItem name="Nodeid">S10012</WFItem>
<WFItem name="SubRuleNum"></WFItem>
<WFItem name="Processid">922b4204009bb04dcb0b4040559f4bb6840e</WFItem>
<WFItem name="StartMulInsByUserid"></WFItem>
</Items>`}
                />
            </Tabs.TabPane>,
        ],
        'human-activity': [
            <Tabs.TabPane tab="基本属性" key="basic">
                <HumanActivity {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="扩展属性" key="extend">
                <HumanExtendConfig {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="转交传阅" key="forward">
                <ForwardCirculation {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="操作按钮" key="actionBtns">
                <HumanActionBtns />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="表单设置" key="formSetting">
                <HumanFormSetting />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="事件设置" key="event">
                <HumanEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="字段权限" key="fieldsAuthority">
                <HumanFieldsAuthority {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="办理意见" key="applyOpinion">
                <HumanApplyOpinion {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="时限设置" key="timelimit">
                <HumanTimeLimit {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="邮件设置" key="email">
                <HumanEmailSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML源码" key="xml">
                <HumanXmlCode
                    value={`<Items>
    <WFItem name="ExtNodeType">subProcess</WFItem>
    <WFItem name="NodeName">zmm-test</WFItem>
    <WFItem name="WF_OrUnid">eb91fb720fb34048450801305ed5f75f2542</WFItem>
    <WFItem name="StartProcessRuleNum"></WFItem>
    <WFItem name="SubProcessid"></WFItem>
    <WFItem name="ExceedTime">(0)</WFItem>
    <WFItem name="StartSubNodeid"></WFItem>
    <WFItem name="SubCopyData"></WFItem>
    <WFItem name="ExtSubProcessid"></WFItem>
    <WFItem name="subCopyAttach"></WFItem>
    <WFItem name="SubProcessType">subProcess</WFItem>
    <WFItem name="undefined"></WFItem>
    <WFItem name="NodeType">SubProcess</WFItem>
    <WFItem name="Nodeid">S10012</WFItem>
    <WFItem name="SubRuleNum"></WFItem>
    <WFItem name="Processid">922b4204009bb04dcb0b4040559f4bb6840e</WFItem>
    <WFItem name="StartMulInsByUserid"></WFItem>
</Items>`}
                />
            </Tabs.TabPane>,
        ],
        gateway: [
            <Tabs.TabPane tab="基本属性" key="basic">
                <Gateway {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="事件设置" key="event">
                <GatewayEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML源码" key="xml">
                <GatewayXmlCode
                    value={`<Items>
    <WFItem name="ExtNodeType">subProcess</WFItem>
    <WFItem name="NodeName">zmm-test</WFItem>
    <WFItem name="WF_OrUnid">eb91fb720fb34048450801305ed5f75f2542</WFItem>
    <WFItem name="StartProcessRuleNum"></WFItem>
    <WFItem name="SubProcessid"></WFItem>
    <WFItem name="ExceedTime">(0)</WFItem>
    <WFItem name="StartSubNodeid"></WFItem>
    <WFItem name="SubCopyData"></WFItem>
    <WFItem name="ExtSubProcessid"></WFItem>
    <WFItem name="subCopyAttach"></WFItem>
    <WFItem name="SubProcessType">subProcess</WFItem>
    <WFItem name="undefined"></WFItem>
    <WFItem name="NodeType">SubProcess</WFItem>
    <WFItem name="Nodeid">S10012</WFItem>
    <WFItem name="SubRuleNum"></WFItem>
    <WFItem name="Processid">922b4204009bb04dcb0b4040559f4bb6840e</WFItem>
    <WFItem name="StartMulInsByUserid"></WFItem>
</Items>`}
                />
            </Tabs.TabPane>,
        ],
        'flow-start': [
            <Tabs.TabPane tab="基本属性" key="basic">
                <FlowStart {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="事件设置" key="event">
                <FlowStartEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML源码" key="xml">
                <FlowStartXmlCode
                    value={`<Items>
    <WFItem name="ExtNodeType">subProcess</WFItem>
    <WFItem name="NodeName">zmm-test</WFItem>
    <WFItem name="WF_OrUnid">eb91fb720fb34048450801305ed5f75f2542</WFItem>
    <WFItem name="StartProcessRuleNum"></WFItem>
    <WFItem name="SubProcessid"></WFItem>
    <WFItem name="ExceedTime">(0)</WFItem>
    <WFItem name="StartSubNodeid"></WFItem>
    <WFItem name="SubCopyData"></WFItem>
    <WFItem name="ExtSubProcessid"></WFItem>
    <WFItem name="subCopyAttach"></WFItem>
    <WFItem name="SubProcessType">subProcess</WFItem>
    <WFItem name="undefined"></WFItem>
    <WFItem name="NodeType">SubProcess</WFItem>
    <WFItem name="Nodeid">S10012</WFItem>
    <WFItem name="SubRuleNum"></WFItem>
    <WFItem name="Processid">922b4204009bb04dcb0b4040559f4bb6840e</WFItem>
    <WFItem name="StartMulInsByUserid"></WFItem>
</Items>`}
                />
            </Tabs.TabPane>,
        ],
        'flow-end': [
            <Tabs.TabPane tab="基本属性" key="basic">
                <FlowEnd {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="事件设置" key="event">
                <FlowEndEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML源码" key="xml">
                <FlowEndXmlCode
                    value={`<Items>
    <WFItem name="ExtNodeType">subProcess</WFItem>
    <WFItem name="NodeName">zmm-test</WFItem>
    <WFItem name="WF_OrUnid">eb91fb720fb34048450801305ed5f75f2542</WFItem>
    <WFItem name="StartProcessRuleNum"></WFItem>
    <WFItem name="SubProcessid"></WFItem>
    <WFItem name="ExceedTime">(0)</WFItem>
    <WFItem name="StartSubNodeid"></WFItem>
    <WFItem name="SubCopyData"></WFItem>
    <WFItem name="ExtSubProcessid"></WFItem>
    <WFItem name="subCopyAttach"></WFItem>
    <WFItem name="SubProcessType">subProcess</WFItem>
    <WFItem name="undefined"></WFItem>
    <WFItem name="NodeType">SubProcess</WFItem>
    <WFItem name="Nodeid">S10012</WFItem>
    <WFItem name="SubRuleNum"></WFItem>
    <WFItem name="Processid">922b4204009bb04dcb0b4040559f4bb6840e</WFItem>
    <WFItem name="StartMulInsByUserid"></WFItem>
</Items>`}
                />
            </Tabs.TabPane>,
        ],
        'flow-event': [
            <Tabs.TabPane tab="基本属性" key="basic">
                <FlowEvent {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="事件设置" key="event">
                <FlowEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML源码" key="xml">
                <FlowEventXmlCode
                    value={`<Items>
    <WFItem name="ExtNodeType">subProcess</WFItem>
    <WFItem name="NodeName">zmm-test</WFItem>
    <WFItem name="WF_OrUnid">eb91fb720fb34048450801305ed5f75f2542</WFItem>
    <WFItem name="StartProcessRuleNum"></WFItem>
    <WFItem name="SubProcessid"></WFItem>
    <WFItem name="ExceedTime">(0)</WFItem>
    <WFItem name="StartSubNodeid"></WFItem>
    <WFItem name="SubCopyData"></WFItem>
    <WFItem name="ExtSubProcessid"></WFItem>
    <WFItem name="subCopyAttach"></WFItem>
    <WFItem name="SubProcessType">subProcess</WFItem>
    <WFItem name="undefined"></WFItem>
    <WFItem name="NodeType">SubProcess</WFItem>
    <WFItem name="Nodeid">S10012</WFItem>
    <WFItem name="SubRuleNum"></WFItem>
    <WFItem name="Processid">922b4204009bb04dcb0b4040559f4bb6840e</WFItem>
    <WFItem name="StartMulInsByUserid"></WFItem>
</Items>`}
                />
            </Tabs.TabPane>,
        ],
    };

    return (
        <div className="node-config-wrapper">
            <JsonSchemaForm
                position={{ width: 0, top: 0, right: 0 }}
                formSchemaService={formSchemaService}
                getCustomRenderComponent={getCustomRenderComponent}
            ></JsonSchemaForm>
            <Drawer
                title={drawerTitle}
                visible={flowConfigShow}
                placement="right"
                closable={false}
                width={600}
                headerStyle={{ padding: 0 }}
                contentWrapperStyle={{ padding: '0 24px', background: '#fff' }}
                bodyStyle={{ position: 'relative', padding: 0 }}
            >
                <Form className="node-form-wrapper" form={form} layout="vertical">
                    <Tabs defaultActiveKey="basic">
                        {nodeData &&
                            nodeData.name &&
                            element[nodeData.name].map((item: ReactElement) => item)}
                    </Tabs>
                </Form>
                <Space className="node-form-footer">
                    <Button type="primary">保存</Button>
                    <Button className="xflow-save-btn" onClick={onClose}>
                        关闭
                    </Button>
                </Space>
            </Drawer>
        </div>
    );
};

export default NodeConfig;
