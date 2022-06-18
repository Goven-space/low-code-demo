import { Switch, Form, Input } from "antd"
import Personnel from '../externalSubProcess/personnel';

const AutomatedSendMsg = (props: any) => {

    return (
        <>
            <Form.Item label="本环节启动后发送手机短信" name="SendSmsFlag" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
            <Form.Item label="收件人" name="SmsSendTo">
                <Personnel />
            </Form.Item>
            <Form.Item label="内容" name="SmsBody" extra="{字段名}可以获得表单字段值{Node.Nodeid}可获得节点参与者{DOCLINK}获得文档链接">
                <Input.TextArea />
            </Form.Item>
        </>
    )
}

export default AutomatedSendMsg