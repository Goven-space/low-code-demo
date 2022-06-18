import { Checkbox, Form, Input, TreeSelect } from 'antd'



const InnerSubProcess = ({nodeData, subProcessData, processRuleData}: any) => {
    return (
        <>
            <Form.Item label="节点名称" name="NodeName">
                <Input />
            </Form.Item>
            <Form.Item label="节点ID">
                <div>{nodeData ? nodeData.id : ""}</div>
            </Form.Item>
            <Form.Item label="选择要启动的子流程" name="SubProcessid">
                <TreeSelect treeData={subProcessData} />
            </Form.Item>
            <Form.Item label="使用规则动态启动子流程" name="StartProcessRuleNum">
                <TreeSelect treeData={processRuleData} />
            </Form.Item>
            <Form.Item label="使用自定义规则拷贝数据" name="SubRuleNum">
                <TreeSelect treeData={processRuleData} />
            </Form.Item>
        </>
    )
}

export default InnerSubProcess