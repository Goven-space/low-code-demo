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
    'inner-sub-process': '???????????????',
    'external-sub-process': '???????????????',
    'automated-activity': '????????????',
    'human-activity': '????????????',
    gateway: '??????',
    'flow-start': '????????????',
    'flow-end': '????????????',
    'flow-event': '??????',
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
                    name: '??????',
                    groups: [
                        {
                            name: 'groupName',
                            controls: [
                                {
                                    label: '?????????',
                                    name: 'group-service',
                                    shape: 'group-service',
                                    placeholder: '????????????',
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
                    name: '??????',
                    groups: [
                        {
                            name: 'groupName',
                            controls: [
                                {
                                    label: '?????????',
                                    name: 'node-service',
                                    shape: 'node-service',
                                    placeholder: '????????????',
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
                    name: '??????',
                    groups: [
                        {
                            name: 'groupName',
                            controls: [
                                {
                                    label: '???',
                                    name: 'edge-service',
                                    shape: 'edge-service',
                                    placeholder: '?????????',
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
                    name: '??????',
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
            <Tabs.TabPane tab="????????????" key="basic">
                <InnerSubProcess {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="extend">
                <InnerExtendConfig {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="event">
                <InnerEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML??????" key="xml">
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
            <Tabs.TabPane tab="????????????" key="basic">
                <ExternalSubProcess {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="??????????????????" key="system">
                <ExternalSystemSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="event">
                <ExternalEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="timelimit">
                <ExternalTimeLimit {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML??????" key="xml">
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
            <Tabs.TabPane tab="????????????" key="basic">
                <AutomatedActivity {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="dataOutflow">
                <AutomatedDataOutflow {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="sendEmail">
                <AutomatedSendEmail {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="sendMsg">
                <AutomatedSendMsg {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="event">
                <AutomatedEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML??????" key="xml">
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
            <Tabs.TabPane tab="????????????" key="basic">
                <HumanActivity {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="extend">
                <HumanExtendConfig {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="forward">
                <ForwardCirculation {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="actionBtns">
                <HumanActionBtns />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="formSetting">
                <HumanFormSetting />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="event">
                <HumanEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="fieldsAuthority">
                <HumanFieldsAuthority {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="applyOpinion">
                <HumanApplyOpinion {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="timelimit">
                <HumanTimeLimit {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="email">
                <HumanEmailSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML??????" key="xml">
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
            <Tabs.TabPane tab="????????????" key="basic">
                <Gateway {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="event">
                <GatewayEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML??????" key="xml">
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
            <Tabs.TabPane tab="????????????" key="basic">
                <FlowStart {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="event">
                <FlowStartEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML??????" key="xml">
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
            <Tabs.TabPane tab="????????????" key="basic">
                <FlowEnd {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="event">
                <FlowEndEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML??????" key="xml">
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
            <Tabs.TabPane tab="????????????" key="basic">
                <FlowEvent {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="????????????" key="event">
                <FlowEventSetting {...{ nodeData, subProcessData, processRuleData }} />
            </Tabs.TabPane>,
            <Tabs.TabPane tab="XML??????" key="xml">
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
                    <Button type="primary">??????</Button>
                    <Button className="xflow-save-btn" onClick={onClose}>
                        ??????
                    </Button>
                </Space>
            </Drawer>
        </div>
    );
};

export default NodeConfig;
