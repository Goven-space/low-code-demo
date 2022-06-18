import React, { useState, useEffect } from 'react';
import {  getChartTree } from '../../../api/workbench';
import { LineChartOutlined, TagsOutlined } from '@ant-design/icons';
import { Modal, Button, Tree, Row, Col, message } from 'antd';
import './options.less'

const ChartModuleOptions = (props) => {
    const [chartList, setChartList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([])

    useEffect(() => {
        loadChartList()
    }, [])
    
    useEffect(() => {
        !props.addons.formData.chartId && setShowModal(true)
    }, [props.addons.formData.$id])


    const loadChartList = () => {
        const transform = (data) => {
            const arr = data.map(item => (
                {
                    key: item.key,
                    title: item.label,
                    isLeaf: item.isLeaf,
                    selectable: item.type=== 'chart',
                    icon: item.type === 'chart' ? <LineChartOutlined /> : <TagsOutlined />,
                    children: item.children && transform(item.children)
                }
            ))
            return arr
        }

        getChartTree({ appId: 'bpm_report_form' }).then(res => {
            const { data } = res
            if (data.state) {
                const newChartList = transform(data.data)
                setChartList(newChartList)
            }
        })
    }

    const handleCancel = () => {
        
        setShowModal(false)
        props.onChange('none')
    }

    const handleSelectChange = (selectedKeys) => {
        setSelectedKeys(selectedKeys);
    }

    const onExpand = expandedKeys => {
        setExpandedKeys(expandedKeys)
    };

    const submit = () => {
        if (selectedKeys.length) {
            props.onChange(selectedKeys[0])
            setShowModal(false)
        } else {
            message.info('没有选择图表')
        }
       
        // setShowModal(false)
    }

    return (
        <div>
            <Modal title="选择图表" visible={showModal} onCancel={handleCancel} footer={null} maskClosable={false} >
                <Tree
                    rootClassName="chart-list-tree"
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={false}
                    treeData={chartList}
                    onSelect={handleSelectChange}
                    showIcon
                />
                <Row gutter={[8, 6]} justify="center" style={{ marginTop: "10px" }}>
                    <Col span={4}>
                        <Button type="primary" onClick={submit}>确定</Button>
                    </Col>
                    <Col span={4}>
                        <Button onClick={handleCancel}>关闭</Button>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
}

export default ChartModuleOptions