import { Form, Input, Switch, TreeSelect } from "antd"

const InnerExtendConfig = ({subProcessData} :any) => {
    return (
        <>
            <Form.Item label="子流程Processid(扩展参数)" name="ExtSubProcessid">
                <TreeSelect treeData={subProcessData} />
            </Form.Item>
            <Form.Item label="子流程目标节点Nodeid" name="StartSubNodeid">
                <Input />
            </Form.Item>
            <Form.Item label="每用户启动一个子流程实例" name="StartMulInsByUserid" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
            <Form.Item label="拷贝所有数据到子流程" name="SubCopyData" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
            <Form.Item label="拷贝所有附件到子流程" name="subCopyAttach" valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
        </>
    )
}

export default InnerExtendConfig