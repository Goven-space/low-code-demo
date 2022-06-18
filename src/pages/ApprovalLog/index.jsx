import { Button, Space, Tabs, Collapse, Card, Descriptions, Avatar, Popover } from 'antd';
import './index.less';
import { DeploymentUnitOutlined, CaretRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useState } from 'react';
import ApprovalRecords from './approvalRecords'
import ReadingRecord from './readingRecord'

const { TabPane } = Tabs;
const { Panel } = Collapse;

const ApprovalLog = (props) => {

    return (
        <>
            <Tabs defaultActiveKey="1" type="card" tabBarGutter={40}>
                <TabPane tab="审批记录" key="1">
                    <ApprovalRecords />
                </TabPane>
                <TabPane tab="阅读记录" key="2">
                    <ReadingRecord />
                </TabPane>
            </Tabs>
            <Button
                type="link"
                style={{ position: 'absolute', top: '80px', right: '20px', color: '#0fb3b4' }}
                icon={<DeploymentUnitOutlined />}
            >
                查看流程图
            </Button>
        </>
    );
};

export default ApprovalLog;
