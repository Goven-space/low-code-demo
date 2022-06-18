import './index.less';
import nodes from '../../../public/assets/xflow.json';
import { CaretDownOutlined } from '@ant-design/icons';
import { Space } from 'antd';

const ProcessView = () => {
    console.log(nodes.nodes);
    const contentValue = nodes.nodes;
    //流程开始
    const flowStart = contentValue.filter((item) => item.name === 'flow-start');
    const automatedActivity = contentValue.filter((item) => item.name === 'automated-activity');
    const flowEvent = contentValue.filter((item) => item.name === 'flow-event');
    const humanActivity = contentValue.filter((item) => item.name === 'human-activity');
    const flowEnd = contentValue.filter((item) => item.name === 'flow-end');
    return (
        <div className="process_content">
            {flowStart && flowStart.length ? (
                <>
                    <div className="processStarted_less">
                        <Space>
                            <img
                                src={flowStart[0].label.props.children[0].props.src}
                                alt="icon"
                            ></img>
                            <span>{flowStart[0].label.props.children[1]}</span>
                        </Space>
                    </div>
                    <div>
                        <div className="dotted"></div>
                        <CaretDownOutlined style={{ color: '#10b3b3' }} />
                    </div>
                </>
            ) : undefined}

            {automatedActivity && automatedActivity.length ? (
                <>
                    <div className="processStarted_less">
                        <Space>
                            <img
                                src={automatedActivity[0].label.props.children[0].props.src}
                                alt="icon"
                            ></img>
                            <span>{automatedActivity[0].label.props.children[1]}</span>
                        </Space>
                    </div>
                    <div>
                        <div className="dotted"></div>
                        <CaretDownOutlined style={{ color: '#10b3b3' }} />
                    </div>
                </>
            ) : undefined}
            {/* 事件 */}
            {flowEvent && flowEvent.length ? (
                <>
                    <div className="flowEvent_less">
                        <Space>
                            <img
                                src={flowEvent[0].label.props.children[0].props.src}
                                alt="icon"
                            ></img>
                            <span>{flowEvent[0].label.props.children[1]}</span>
                        </Space>
                    </div>
                    <div>
                        <div className="line"></div>
                        <CaretDownOutlined style={{ color: '#F0F0F0' }} />
                    </div>
                </>
            ) : undefined}
            {/* 人工活动 */}
            {humanActivity && humanActivity.length ? (
                <>
                    <div className="humanActivity_less">
                        <Space>
                            <img
                                src={humanActivity[0].label.props.children[0].props.src}
                                alt="icon"
                            ></img>
                            <span>{humanActivity[0].label.props.children[1]}</span>
                        </Space>
                        <Space size="large">
                            <div style={{ marginTop: 30 }}>
                                <span style={{ color: '#AAAAAA' }}>审批人：</span>
                                <span>公司主管领导</span>
                            </div>
                            <div style={{ marginTop: 30 }}>
                                <span style={{ color: '#AAAAAA' }}>绑定表单：</span>
                                <span>无</span>
                            </div>
                        </Space>
                    </div>
                    <div>
                        <div className="line"></div>
                        <CaretDownOutlined style={{ color: '#F0F0F0' }} />
                    </div>
                </>
            ) : undefined}

            {flowEnd && flowEnd.length ? (
                <>
                    <div className="flowEnd_less">
                        <Space>
                            <img
                                src={flowEnd[0].label.props.children[0].props.src}
                                alt="icon"
                            ></img>
                            <span>{flowEnd[0].label.props.children[1]}</span>
                        </Space>
                    </div>
                </>
            ) : undefined}
        </div>
    );
};

export default ProcessView;
