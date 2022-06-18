import { Space, Card, Collapse,Popover,Avatar,Descriptions,Button } from 'antd';
import { CheckCircleOutlined, CaretRightOutlined } from '@ant-design/icons';
import './index.less';

const { Panel } = Collapse;

const readingRecord = (props) => {

    const dot = (
        <div className='dot_less'></div> 
    )

    const content = (
        <>
            <div className="examination_hover">
                <div style={{ width: '100%', display: 'flex' }}>
                    <div style={{ width: '70%',marginTop:40,marginLeft:30}}>
                        <Descriptions layout="vertical" >
                            <Descriptions.Item label={<Space>{dot}<div>审批人</div></Space>} span={2}><b>刘雨泽</b></Descriptions.Item>
                            <Descriptions.Item label={<Space>{dot}<div>所在部门</div></Space>} span={2}><b>湖南省公司/网络部</b></Descriptions.Item>
                            <Descriptions.Item label={<Space>{dot}<div>是否超时</div></Space>} ><b>否</b></Descriptions.Item>
                            <Descriptions.Item label={<Space>{dot}<div>送达时间</div></Space>} ><b>2022-05-22 17:45:36</b></Descriptions.Item>
                            <Descriptions.Item label={<Space>{dot}<div>完成时间</div></Space>} ><b>2022-05-22 17:45:36</b></Descriptions.Item>
                            <Descriptions.Item label={<Space>{dot}<div>时限</div></Space>} ><b>6分钟</b></Descriptions.Item>
                            <Descriptions.Item label={<Space>{dot}<div>所在节点</div></Space>} ><b>部门主管审批</b></Descriptions.Item>
                            <Descriptions.Item label={<Space>{dot}<div>提交至</div></Space>} ><b>张正豪</b></Descriptions.Item>
                            <Descriptions.Item label={<Space>{dot}<div>操作类型</div></Space>} ><b>同意</b></Descriptions.Item>
                            <Descriptions.Item label={<Space>{dot}<div>意见</div></Space>} ><b>暂无意见</b></Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ color: '#0fb3b4', paddingLeft: 15 }}>
                    <Space>
                        <CheckCircleOutlined />
                        流程结束
                    </Space>
                </div>
                <div style={{ color: '#0fb3b4' }}>2022-05-27 23:36</div>
            </div>
            <Card style={{ marginTop: 10, borderRadius: 10 }}>累计耗时：3分</Card>
            <Collapse
                bordered={false}
                defaultActiveKey={['1', '2', '3']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            >
                <Panel header="总经理办公室审批" extra="2022-05-27 23:36" key="1">
                    <Card className='subprocess_less'>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                                子流程已完成（完成<b style={{ color: '#0fb3b4' }}>3</b>/3）
                            </span>
                            <span style={{ color: '#FFB138' }}>查看详情</span>
                        </div>
                        <div
                            style={{
                                marginTop: 20,
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Space>
                                <div className="childrenProcess"></div>
                                <b>内部子流程</b>
                            </Space>

                            <span style={{ cursor: 'pointer', color: '#0fb3b4' }}>流转完成</span>
                        </div>
                        <div style={{ marginTop: 20 }}>开始处理：2022-05-27 23:3</div>
                        <div style={{ marginTop: 20 }}>处理耗时：5分</div>
                    </Card>
                </Panel>
                <Panel header="部门主管审批" key="2">
                    <Card style={{ borderRadius: 10 }} className="departmentHead_less">
                        <Popover
                            placement="left"
                            trigger="click"
                            content={content}
                            title="部门主管审批"
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Space>
                                    <Avatar src="https://joeschmoe.io/api/v1/random" />
                                    <b>刘宇泽</b>
                                </Space>
                                <Button
                                    type="primary"
                                    style={{
                                        borderRadius: 16,
                                        background: '#fff',
                                        color: '#0fb3b4',
                                    }}
                                >
                                    同意
                                </Button>
                            </div>
                            <div style={{ marginTop: 20 }}>开始处理：2022-05-27 23:3</div>
                            <div style={{ marginTop: 20 }}>处理耗时：5分</div>
                        </Popover>
                    </Card>
                </Panel>
            </Collapse>
        </>
    );
};

export default readingRecord;
