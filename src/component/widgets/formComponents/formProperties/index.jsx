import React, { useEffect, useState } from 'react';
import { Form, Input, TreeSelect, Select, Button, Checkbox, Row, Col, message } from 'antd';
import { getAllFormRules, setFormConfig } from '../../../../api/bpm';
import { getAppList } from '../../../../api/workbench';


const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
}

const FormProperties = (props) => {
    const [formRules, setFormRules] = useState([]);
    const [appList, setAppList] = useState([]);

    const { id, formConfig } = props
    
    const [form] = Form.useForm();

    useEffect(() => {
        loadFormRule()
        loadAppList()
    }, [])

    useEffect(() => {
        if (!!Object.keys(formConfig).length) {
            const Status = []
            formConfig.Status && Status.push('Status')
            formConfig.WF_NoUpdate && Status.push('WF_NoUpdate')
            formConfig.UseCodeMode && Status.push('UseCodeMode')
            form.setFieldsValue(
                {
                    WF_Appid: formConfig.WF_Appid,
                    Folderid: formConfig.Folderid,
                    FormName: formConfig.FormName,
                    FormNumber: formConfig.FormNumber,
                    WF_Version: formConfig.WF_Version,
                    Status
                }
            )
        }
    }, [formConfig])
    

    const loadAppList = () => {
        getAppList({ wf_num: 'D_S001_J020', wf_gridnum: 'V_S001_G024' }).then(res => {
            const { data, status } = res
            if (status === 200) {
                const list = data.rows.map(item => ({
                    label: item.AppName,
                    value: item.WF_Appid
                }))
                form.getFieldValue('WF_Appid') || form.setFieldsValue({ WF_Appid: list[0].value })
                setAppList(list)
            }
        })
    }
    
    const loadFormRule = () => {
        const transform = (data) => {
            return data.map(item => (
                {
                    title: item.text,
                    value: item.id,
                    children: item.children && transform(item.children)
                }
            ))
        }
        getAllFormRules({ wf_num: 'T_S009_001' }).then(res => {
            const { status, data } = res
            if (status === 200) {
                const rules = transform(data)
                form.getFieldValue('Folderid') || form.setFieldsValue({ Folderid: rules[0].value })
                setFormRules(rules)
            }
        })
    }

    const handleSave = (values) => {
        const params = {
            WF_KeyFdName: 'FormNumber',
            WF_RuleFdName: 'FormName',
            WF_TableName: 'BPM_FormList',
            WF_DocUnid: id,
            WF_Appid: values.WF_Appid,
            Folderid: values.Folderid,
            FormName: values.FormName,
            FormNumber: values.FormNumber,
            WF_Version: values.WF_Version,
            Status: values.Status.includes('Status') ? 1 : '',
            WF_NoUpdate: values.Status.includes('WF_NoUpdate') ? 1 : '',
            UseCodeMode: values.Status.includes('UseCodeMode') ? 1 : ''
        }
        setFormConfig('R_S001_B002', params).then(res => {
            if (res.data.Status === 'ok') {
                message.success(res.data.msg)
            } else {
                message.error('????????????')
            }
            
        })
    }

    const onFormNumChange = (value) => {
        const params = {
            WF_OrUnid: id,
            WF_Elid: value,
            WF_TableColName: 'FormNumber',
            WF_TableName: 'BPM_FormList',
        }
        return setFormConfig('R_S001_B005', params).then(res => {
            if (res.data.Status) {
                return Promise.resolve()
            } else {
                return Promise.reject(new Error('??????????????????????????????'))
            }
        })
    }

    return (
        <Row justify='center' style={{marginTop:'20px'}}>
            <Col span={16}>
                <Form {...formItemLayout} onFinish={handleSave} form={form}>
                    <Form.Item label="????????????" name="WF_Appid" rules={[{ required: true, message: "?????????????????????" }]} >
                        <Select options={appList} />
                    </Form.Item>
                    <Form.Item label="????????????" name="Folderid" rules={[{ required: true, message: "???????????????????????????" }]}>
                        <TreeSelect treeData={formRules} treeExpandedKeys={[formRules[0]?.value]} />
                    </Form.Item>
                    <Form.Item label="????????????" name="FormName" rules={[{ required: true, message: "?????????????????????" }]}>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                        name="FormNumber"
                        rules={[
                            { required: true, message: "?????????????????????" },
                            {
                                validator: (_, value) => {
                                    return onFormNumChange(value)
                                }
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="??????" name="WF_Version" initialValue="1.0" >
                        <Input />
                    </Form.Item>
                    <Form.Item label="??????" name="Status" initialValue={['Status', 'WF_NoUpdate', 'UseCodeMode']}>
                        <Checkbox.Group
                            options={[
                                { label: '??????', value: 'Status' },
                                { label: '?????????????????????', value: 'WF_NoUpdate' },
                                { label: '???????????????????????????', value: 'UseCodeMode' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 4, offset: 11}}>
                        <Button type="primary" htmlType="submit">??????</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
        
    );
}

export default FormProperties;