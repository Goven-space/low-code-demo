import { Collapse, Form, Input, Radio, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';
import { getSelectData } from '../apiList';

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

const ExternalSystemSetting = ({}: any) => {
    const [formList, setFormList] = useState([]);
    const [childFormList, setChildFormList] = useState([])
    
    useEffect(() => {
        getFormList()
    }, [])

    const getFormList = () => {
        getSelectData('wf_num=R_S009_B001').then(res => {
            setFormList(treeDataFormat(res.data))
        })
        getSelectData('?wf_num=R_S009_B002').then(res => {
            setChildFormList(treeDataFormat(res.data))
        })
    }

    return (
        <>
            <Collapse defaultActiveKey={['1', '2', '3']}>
                <Collapse.Panel header="外部系统设置" key="1">
                    <Form.Item label="外部子流程名称" name="SystemName">
                        <Input />
                    </Form.Item>
                    <Form.Item label="外部子流程处理URL" name="url">
                        <Input />
                    </Form.Item>
                </Collapse.Panel>
                <Collapse.Panel header="主表单设置" key="2">
                    <Form.Item label="主表单更换为" name="FormNumber">
                        <TreeSelect treeData={formList} />
                    </Form.Item>
                </Collapse.Panel>
                <Collapse.Panel header="处理单设置" key="3">
                    <Form.Item label="选项" name="ApprovalAutoFlag" valuePropName='checked'>
                        <Radio.Group>
                            <Radio value={1}>系统自动生成</Radio>
                            <Radio value={2}>指定处理单</Radio>
                            <Radio value={3}>无</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="自定义处理单" name="CusApprovalFormNum">
                        <TreeSelect treeData={childFormList} />
                    </Form.Item>
                    <Form.Item label="处理单提示信息" name="ApprovalMsg">
                        <Input />
                    </Form.Item>
                </Collapse.Panel>
            </Collapse>
        </>
    )
}

export default ExternalSystemSetting