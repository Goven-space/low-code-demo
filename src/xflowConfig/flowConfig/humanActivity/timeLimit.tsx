import { Form, InputNumber } from "antd"

const HumanTimeLimit = ({}: any) => {
    
    return (
        <>
            <Form.Item label="活动持续时间" name="ExceedTime">
                <InputNumber style={{width: '100%'}} addonAfter="(小时)" />
            </Form.Item>
            <Form.Item label="提前" name="FirstTriggerTime" extra="第一次触发规则">
                <InputNumber style={{width: '100%'}} addonAfter="(小时)" />
            </Form.Item>
            <Form.Item label="触发规则重复间隔" name="RepeatTime" extra="0表示不重复">
                <InputNumber style={{width: '100%'}} addonAfter="(小时)" />
            </Form.Item>
        </>
    )
}

export default HumanTimeLimit