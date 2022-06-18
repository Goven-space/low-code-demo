import { Form, Input, Radio, Select, Switch } from "antd";
import Personnel from '../externalSubProcess/personnel';

const HumanApplyOpinion = ({}: any) => {

    return (
        <>
            <Form.Item label="意见类型" name="RemarkType">
                <Select>
                    <Select.Option value="1">普通意见</Select.Option>
                    <Select.Option value="2">领导意见</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="填写选项" name="RemarkNullFlag" valuePropName="checked">
                <Radio.Group>
                    <Radio value={1}>可以填写</Radio>
                    <Radio value={2}>必须填写</Radio>
                    <Radio value={3}>无权填写</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="提示信息" name="RemarkInfo">
                <Input />
            </Form.Item>
            <Form.Item label="意见权限" name={['RemarkAcl', 'RemarkAcl_show']}>
                <Personnel />
            </Form.Item>
            <Form.Item label="初始意见" name="DefaultRemark">
                <Input />
            </Form.Item>
            <Form.Item label="处理单上不显示空意见" name="RemarkBlankFlag" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
        </>
    )
}

export default HumanApplyOpinion