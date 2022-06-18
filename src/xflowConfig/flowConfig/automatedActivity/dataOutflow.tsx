import { Form, Select, TreeSelect } from "antd"
import { useEffect, useState } from "react"
import { getJsonData } from '../apiList'

const AutomatedDataOutflow = ({nodeData, subProcessData, processRuleData}: any) => {
    const [options, setOptions] = useState([])

    useEffect(() => {
        getJsonData('wf_num=D_S002_J008').then(res => {
            setOptions(res.data.map((item: any) => ({label: item.DataName, value: item.Dataid})))
        })
    }, [])

    return (
        <>
            <Form.Item label="选择数据流出配置" name="OutDataConfig">
                <Select options={options} />
            </Form.Item>
            <Form.Item label="执行数据转换规则" name="OutDataRuleNum">
                <TreeSelect treeData={processRuleData} />
            </Form.Item>
        </>
    )
}

export default AutomatedDataOutflow