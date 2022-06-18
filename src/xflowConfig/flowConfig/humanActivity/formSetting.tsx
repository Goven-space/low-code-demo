import { Checkbox, Collapse, Form, Input, Radio, TreeSelect } from "antd";

const HumanFormSetting = ({}: any) => {

    return (
        <>
            <Collapse defaultActiveKey={['1', '2', '3']}>
                <Collapse.Panel header="主表单设置" key="1">
                    <Form.Item label="主表单更换为" name="FormNumber">
                        <TreeSelect />
                    </Form.Item>
                    <Form.Item label="手机表单更换为" name="FormNumberForMobile">
                        <TreeSelect />
                    </Form.Item>
                </Collapse.Panel>
                <Collapse.Panel header="子表单设置" key="2">
                    <Form.Item label="载入子表单" name="SubFormNumberLoad">
                        <TreeSelect />
                    </Form.Item>
                    <Form.Item label="子表单显示标题" name="SubFormCollapsedTitle">
                        <Input />
                    </Form.Item>
                    <Form.Item label="选项" style={{marginBottom: 0}}>
                        <Form.Item name="SubFormCollapsed" valuePropName="checked">
                            <Checkbox value={1}>折叠子表单</Checkbox>
                        </Form.Item>
                        <Form.Item name="RemoveDuplicationSubForm" valuePropName="checked">
                            <Checkbox value={2}>重审批时只显示最新的子表单</Checkbox>
                        </Form.Item>
                    </Form.Item>
                </Collapse.Panel>
                <Collapse.Panel header="处理单设置" key="3">
                    <Form.Item label="选项" className="ApprovalAutoFlag" valuePropName="checked">
                        <Radio.Group>
                            <Radio value={1}>系统自动生成</Radio>
                            <Radio value={2}>指定处理单</Radio>
                            <Radio value={3}>无</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="自定义处理单" name="CusApprovalFormNum">
                        <TreeSelect />
                    </Form.Item>
                    <Form.Item label="处理单提示信息" name="ApprovalMsg">
                        <Input />
                    </Form.Item>
                </Collapse.Panel>
            </Collapse>
        </>
    )
}

export default HumanFormSetting