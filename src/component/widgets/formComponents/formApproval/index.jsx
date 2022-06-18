import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Form, message, Checkbox, Button, Space, Input, Divider, Tag, Row, Col, Select, Tooltip } from 'antd';

import PersonnelSelected from '../personnelSelected';
import { PlusCircleOutlined } from '@ant-design/icons';
import { setApprovavlRemark } from '../../../../api/bpm';
import './index.less';

const { Item } = Form;
const { Group } = Checkbox;
const { TextArea } = Input;

const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 }
}


const FormApproval = (props, ref) => {
    const [processData, setProcessData] = useState({})
    const [copyToSelectedList, setCopyToSelectedList] = useState([]);
    const [participatorData, setParticipatorData] = useState([])
    const [successorNodeGroup, setSuccessorNodeGroup] = useState([])
    const [remarkList, setRemarkList] = useState([]);

    useImperativeHandle(ref, () => ({
        participatorData,
        copyToSelectedList
    }))

    const [form] = Form.useForm();

    const { currentModNodeDoc } = processData

    useEffect(() => {
        if (Object.keys(props.processData).length) {
            setProcessData(props.processData)
            const { nextNodeList, commonRemarkList } = props.processData
            const list = getSuccessorNodeGroup(nextNodeList)
            setSuccessorNodeGroup(list)
            commonRemarkList && (setRemarkList(getRemarkList(commonRemarkList)))
            form.setFieldsValue({ successorNode: [list[0].value] })
        }
    }, [props.processData])

    const getSuccessorNodeGroup = (data) => {
        const list = data.map(item => ({
            label: item.NodeName || "未定义",
            value: item.Nodeid
        }))
        return list
    }

    const getRemarkList = (data) => {
        const list = data.map((item, index) => (
            {
                label: item,
                value: `remark_${index}`
            }
        ))
        return list
    }

    const getParticipatorList = (data) => {
        let str = ""
        data.forEach(item => {
            str += (item.CnName + '\r\n')
        })
        return str
    }

    const addCommonRemark = () => {
        const Remark = form.getFieldValue('Remark')
        setApprovavlRemark({ Remark }).then(res => {
            console.log(res)
        })
    }

    const onRemarkSelected = (value) => {
        console.log(value)
    }

    return (
        <Form className="approval-from-wapper" form={form}>
            <Item label="请选择后继节点" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }} name="successorNode">
                <Group options={successorNodeGroup} disabled={successorNodeGroup.length === 1} />
            </Item>
            <Row gutter={16} justify="start">
                <Col span={10}>
                    <Item label="请选择参与者" {...formLayout} disabled={currentModNodeDoc?.OwnerSelectType === "2"}>
                        <Space
                            style={{ width: "100%" }}
                            direction="vertical"
                        >
                            <TextArea
                                autoSize={{ maxRows: currentModNodeDoc?.OwnerUserSize || 5 }}
                                value={currentModNodeDoc?.OwnerSelectType === "2" ? "全员参与" : getParticipatorList(participatorData)}
                            />
                            {
                                currentModNodeDoc?.OwnerSelectType !== "2" &&
                                <PersonnelSelected save={setParticipatorData} min={currentModNodeDoc?.OwnerMinUserNum || "1"} max={currentModNodeDoc?.OwnerMaxUserNum || "0"} type="participator" />
                            }
                        </Space>
                    </Item>
                </Col>
                {
                    currentModNodeDoc?.NoCopyToSelectFlag !== "1" &&
                    <Col span={10}>
                        <Item label="抄送" {...formLayout} >
                            <Space style={{ width: "100%" }} wrap>
                                {
                                    copyToSelectedList.map(item => (
                                        <Tag>{item.CnName}</Tag>
                                    ))
                                }
                            </Space>
                            <PersonnelSelected save={setCopyToSelectedList} type="copyToSelected" />
                        </Item>
                    </Col>
                }
                {
                    currentModNodeDoc?.RemarkNullFlag !== "3" &&
                    <Col span={10}>
                        <Item label="办理意见" {...formLayout}>
                            <Space
                                style={{ width: "100%" }}
                                direction="vertical"
                            >
                                <Select placeholder="选择常用处理意见" options={remarkList} onSelect={onRemarkSelected} labelInValue />
                                <Item name="Remark">
                                    <TextArea placeholder="请输入办理意见" />
                                </Item>
                                <button className="add-option-Btn" onClick={addCommonRemark}><PlusCircleOutlined />加入到常用处理意见中</button>
                            </Space>
                        </Item>
                    </Col>
                }
            </Row>
        </Form>
    );
}

export default forwardRef(FormApproval);