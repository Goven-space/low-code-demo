import React, {useEffect, useState} from 'react';
import { List, Card, Divider, Tag, Button, Row, Col } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { getProcesses } from '../../api/bpm';
import './index.less';

const { Meta } = Card;

const colorList = ['#4ec2e9', '#f5c547', '#119d9d', '#722ed1'];

const InitiateNewProcess = (props) => {
    const [processList, setProcessList] = useState([])
    const [appList,setAppList] = useState([])
    const {appId} = props

    useEffect(() => {
        loadProcessList()
    }, [])
    
    const loadProcessList = () => {
        const params = appId ? { appId } : undefined;
        getProcesses(params).then(res => {
            const { data } = res
            if (data.meta.success) {
                const newProcessList = {}
                if (appId) {
                    newProcessList[data.data.list[0].AppName] = data.data.list
                } else{
                    data.data.list.forEach(item => {
                        !newProcessList[item.AppName] && (newProcessList[item.AppName] = [])
                        newProcessList[item.AppName].push(item)
                    })
                }
                setAppList(Object.keys(newProcessList))
                setProcessList(newProcessList)
            }
        })
    }

    const handleClick = (processid) => {
        const baseUrl = window.location.hostname === 'localhost' ? 'http://120.77.47.73:8080' : window.location.origin;
        window.location.href = `${baseUrl}/bpm/r?wf_num=R_S003_B036&wf_processid=${processid}`;
    }

    return (
        <div className="initiate-new-process-wrapper">
            {
                appList.map((item, index) => (
                    <div key={`process_category_${item}`}>
                        <div className="process-category-label">{item}</div>
                        <List
                            grid={{ gutter: 24, xxl: 6, xl: 4 ,lg :3 }}
                            dataSource={processList[item]}
                            renderItem={item => (
                                <List.Item>
                                    <Card
                                        className="process-item-card"
                                        hoverable={true}
                                        bodyStyle={{
                                            padding:'0',
                                            borderTop: `9px solid ${colorList[index%4]}`
                                        }}
                                    >
                                        <div className="process-item-container">
                                            <div className="process-item-head">
                                                <span >{item.NodeName}</span>
                                                <span className="process-item-version">{item.WF_Version && `V${item.WF_Version}`}</span>
                                            </div>
                                            <Row justify="space-between" align="middle" className="process-item-body">
                                                <Col span={10}>
                                                    <Tag color="green" className="process-item-tag">{`平均办结:${item.totalTime}小时`}</Tag>
                                                </Col>
                                                <Col >
                                                    <Button className="process-item-btn" type="link" onClick={() => { handleClick(item.Processid) }} >发起流程<RightOutlined /></Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </div>
                ))
            }
        </div>
    );
}

export default InitiateNewProcess;