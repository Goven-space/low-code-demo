import { Form, Input, Checkbox, Radio, InputNumber } from 'antd';
import { useState } from 'react';
import Personnel from '../externalSubProcess/personnel'

const HumanActivity = ({nodeData, subProcessData, processRuleData}: any) => {
    const [usePostType, setUsePostType] = useState(1)
    
    return (
        <>
            <Form.Item label="节点名称" name="NodeName">
                <Input />
            </Form.Item>
            <Form.Item label="节点ID">
                <div>{nodeData ? nodeData.id : ""}</div>
            </Form.Item>
            <Form.Item name="UsePostOwner" valuePropName="checked" initialValue={usePostType}>
                <Checkbox value={1} onChange={(e) => {setUsePostType(e.target.checked ? 1 : 0)}}>使用处理单中选择的用户作为参与者</Checkbox>
            </Form.Item>
            {
                usePostType === 1 && (
                <Form.Item label='用户选择范围' name={['ApprovalFormOwner', 'ApprovalFormOwner_show']}>
                    <Personnel />
                </Form.Item>)
            }
            {
                usePostType === 0 && (
                    <Form.Item label='活动参与者' name={['PotentialOwner', 'PotentialOwner_show']}>
                        <Personnel />
                    </Form.Item>
                )
            }
            <Form.Item label="参与范围" name="OwnerSelectType">
                <Radio.Group>
                    <Radio value={1}>部分参与</Radio>
                    <Radio value={2}>全部参与</Radio>
                    <Radio value={3}>默认选中</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="任务类型" name="LoopType">
                <Radio.Group>
                    <Radio value={1}>抢占</Radio>
                    <Radio value={2}>多实例</Radio>
                    <Radio value={3}>会签</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="最大参与人数" name="OwnerMaxUserNum">
                <InputNumber />
            </Form.Item>
            <Form.Item label="最小参与人数" name="OwnerMinUserNum">
                <InputNumber />
            </Form.Item>
            <Form.Item label="选择框高度" name="OwnerUserSize">
                <InputNumber />
            </Form.Item>
            <Form.Item label="选项" style={{marginBottom: 0}}>
                <Form.Item name="OwnerSelectFlag" valuePropName='checked'>
                    <Checkbox value={1}>允许在地址本中选择人员</Checkbox>
                </Form.Item>
                <Form.Item name="IsSequential" valuePropName='checked'>
                    <Checkbox value={1}>按先后顺序串行处理</Checkbox>
                </Form.Item>
            </Form.Item>
            <Form.Item label="自动跳过" style={{marginBottom: 0}}>
                <Form.Item name="NoUserAutoFlag" valuePropName='checked'>
                    <Checkbox value={1}>当处理人为空时</Checkbox>
                </Form.Item>
                <Form.Item name="SelfAutoFlag" valuePropName='checked'>
                    <Checkbox value={1}>当处理人为自已时</Checkbox>
                </Form.Item>
            </Form.Item>
        </>
    )
}

export default HumanActivity