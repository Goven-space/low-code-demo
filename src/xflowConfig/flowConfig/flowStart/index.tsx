import { Form, Input, Select } from "antd"

const FlowStart = ({nodeData}: any) => {

    return (
        <>
            <Form.Item label="节点名称" name="NodeName">
                <Input />
            </Form.Item>
            <Form.Item label="节点ID">
                <div>{nodeData ? nodeData.id : ""}</div>
            </Form.Item>
        </>
    )
}

export default FlowStart