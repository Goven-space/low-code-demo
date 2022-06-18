import { Collapse, Form, Switch } from "antd";
import Personnel from '../externalSubProcess/personnel'

const ForwardCirculation = ({}: any) => {

    return (
        <>
            <Collapse defaultActiveKey={['1', '2']}>
                <Collapse.Panel header="转交设置" key="1">
                    <Form.Item label="禁止转他人处理" name="NoReassFlag" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="禁止转他人处理时从地址本中选择用户" name="NoReassSelUserFlag" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="禁止再次转交" name="NoMoreReassFlag" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="指定默认转交的用户" name={['ReassignmentOwner', 'ReassignmentOwner_show']}>
                        <Personnel />
                    </Form.Item>
                </Collapse.Panel>
                <Collapse.Panel header="传阅设置" key="2">
                    <Form.Item label="禁止传阅" name="NoCopyToFlag" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="禁止从地址本中选择传阅人员" name="NoCopyToSelectFlag" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="指定默认传阅的用户" name={['CopyToOwner', 'CopyToOwner_show']}>
                        <Personnel />
                    </Form.Item>
                </Collapse.Panel>
            </Collapse>
        </>
    )
}

export default ForwardCirculation