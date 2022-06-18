import { Form, Input, Select } from "antd"

const FlowEvent = ({nodeData}: any) => {

    return (
        <>
            <Form.Item label="节点名称" name="NodeName">
                <Input />
            </Form.Item>
            <Form.Item label="节点ID">
                <div>{nodeData ? nodeData.id : ""}</div>
            </Form.Item>
            <Form.Item label="事件类型" name="ExtNodeType">
                <Select>
                    <Select.Option value="frontEvent">节点前置事件(frontEvent)</Select.Option>
                    <Select.Option value="rearEvent">节点后置事件(rearEvent)</Select.Option>
                </Select>
            </Form.Item>
        </>
    )
}

export default FlowEvent