import { Input, InputNumber, Switch, Table } from "antd"
import { useEffect, useState } from "react"
import { getSelectData } from '../apiList'

const HumanActionBtns = ({}: any) => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        getSelectData('wf_num=R_S002_B008&wf_gridnum=V_S002_E002&WF_Action=edit&WF_DocUnid=&Processid=922b4204009bb04dcb0b4040559f4bb6840e&Nodeid=T10012&NodeType=userTask').then(res => {
            setDataSource(res.data.rows)
        })
    }, [])

    const columns = [
        {
            title: "按扭名称",
            key: "ToolbarName",
            dataIndex: "ToolbarName",
        },
        {
            title: "按扭id",
            key: "Toolbarid",
            dataIndex: "BU1006"
        },
        {
            title: "自定义名称",
            key: "customName",
            dataIndex: "customName",
            render: (text: string | number, row: any, index: number) => {
                const onChange = () => {
                    const data: any = [...dataSource];
                    data[index].customName = text;
                    setDataSource(data);
                }
                return (
                    <Input value={text} onChange={onChange} />
                )
            }
        },
        {
            title: "排序号",
            key: "SortNum",
            dataIndex: "SortNum",
            render: (text: string | number, row: any, index: number) => {
                const onChange = () => {
                    const data: any = [...dataSource];
                    data[index].SortNum = text;
                    setDataSource(data);
                }
                return (
                    <InputNumber value={text} onChange={onChange} />
                )
            }
        },
        {
            title: "启用",
            key: "start",
            dataIndex: "start",
            render: (text: boolean, row: any, index: number) => {
                const onChange = () => {
                    const data: any = [...dataSource];
                    data[index].start = text;
                    setDataSource(data);
                }
                return (
                    <Switch checked={text} onChange={onChange} />
                )
            }
        }
    ]

    return (
        <Table columns={columns} dataSource={dataSource} bordered />
    )
}

export default HumanActionBtns