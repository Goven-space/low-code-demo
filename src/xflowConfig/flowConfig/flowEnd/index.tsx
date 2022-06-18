import { Checkbox, Form, Input, Select, Switch, TreeSelect } from "antd"

const FlowEnd = ({nodeData, processRuleData}: any) => {

    return (
        <>
            <Form.Item label="节点名称" name="NodeName">
                <Input />
            </Form.Item>
            <Form.Item label="节点ID">
                <div>{nodeData ? nodeData.id : ""}</div>
            </Form.Item>
            <Form.Item label="业务状态说明" name="EndBusinessName">
                <Input />
            </Form.Item>
            <Form.Item label="业务状态标识" name="EndBusinessid">
                <Input />
            </Form.Item>
            <Form.Item label="流程终止" name="Terminate" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
            <Form.Item label="返回主流程" name="BackToMainProcess" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
            <Form.Item label="数据返回选项" name="SubCopyData">
                <Checkbox.Group>
                    <Checkbox value={1}>返回所有业务数据到主流程</Checkbox>
                    <Checkbox value={2}>返回所有附件到主流程</Checkbox>
                </Checkbox.Group>
            </Form.Item>
            <Form.Item label="自定义数据返回规则" name="SubRuleNum">
                <TreeSelect treeData={processRuleData} />
            </Form.Item>
        </>
    )
}

export default FlowEnd