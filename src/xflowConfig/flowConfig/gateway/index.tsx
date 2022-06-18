import { Form, Input, Select } from "antd"

const Gateway = ({nodeData}: any) => {

    return (
        <>
            <Form.Item label="节点ID">
                <div>{nodeData ? nodeData.id : ""}</div>
            </Form.Item>
            <Form.Item label="网关名称" name="NodeName">
                <Input />
            </Form.Item>
            <Form.Item label="网关类型" name="ExtNodeType">
                <Select>
                    <Select.Option value="exclusiveGateway">唯一网关</Select.Option>
                    <Select.Option value="parallelGateway">并行网关</Select.Option>
                    <Select.Option value="complexGateway">复杂网关</Select.Option>
                </Select>
            </Form.Item>
        </>
    )
}

export default Gateway