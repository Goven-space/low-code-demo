import { Checkbox, Form, Input, TreeSelect } from 'antd'

const AutomatedActivity = ({nodeData, subProcessData, processRuleData}: any) => {
    return (
        <>
            <Form.Item label="节点名称" name="NodeName">
                <Input />
            </Form.Item>
            <Form.Item label="节点ID">
                <div>{nodeData ? nodeData.id : ""}</div>
            </Form.Item>
            <Form.Item label="节点类型">
                <div>businessRuleTask</div>
            </Form.Item>
            <Form.Item name="AllNodeEndStartFlag">
                <Checkbox value={1}>所有环节结束后才能启动本环节</Checkbox>
            </Form.Item>
            
        </>
    )
}

export default AutomatedActivity