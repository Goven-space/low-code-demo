import { Button, Space, Table } from "antd"

const HumanEmailSetting = (props: any) => {

    const columns = [
        {
            title: "对应操作",
            key: 'action',
            dataIndex: 'action'
        },
        {
            title: "邮件标题",
            key: "title",
            dataIndex: "title"
        },
        {
            title: "主送",
            key: "send",
            dataIndex: 'send'
        },
        {
            title: "抄送",
            key: "sendCopy",
            dataIndex: 'sendCopy'
        },
    ]

    return (
        <div>
            <Space>
                <Button>新增设置</Button>
                <Button>删除设置</Button>
            </Space>
            <Table columns={columns} />
        </div>
    )
}

export default HumanEmailSetting