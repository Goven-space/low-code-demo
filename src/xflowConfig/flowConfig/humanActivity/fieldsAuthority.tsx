import { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Select, Space, Table, TreeSelect } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons';
import { getSelectData, getEventData } from '../apiList';

const HumanFieldsAuthority = ({ nodeData, subProcessData, processRuleData }: any) => {
    const [dataSource, setDataSource] = useState([]);
    const [eventList, setEventList] = useState([]);
    const [ruleModalShow, setRuleModalShow] = useState(false);
    const [ruleIndex, setRuleIndex] = useState<number | undefined>(undefined);
    const [ruleValue, setRuleValue] = useState<any>(undefined);

    useEffect(() => {
        // getTableData()
        getEventList();
    }, []);

    const columns = [
        {
            title: '字段名',
            key: 'FieldName',
            dataIndex: 'FieldName',
            render: (text: string, row: any, index: number) => {
                const onChange = (value: any) => {
                    const data: any = [...dataSource];
                    data[index].FieldName = value;
                    setDataSource(data);
                };
                return (
                    <Input value={text} onChange={onChange} />
                );
            },
        },
        {
            title: '备注',
            key: 'remark',
            dataIndex: 'remark',
            render: (text: string, row: any, index: number) => {
                const onChange = (value: any) => {
                    const data: any = [...dataSource];
                    data[index].remark = value;
                    setDataSource(data);
                };
                return (
                    <Input value={text} onChange={onChange} />
                );
            },
        },
        {
            title: '绑定规则',
            key: 'RuleNum',
            dataIndex: 'RuleNum',
            width: 120,
            render: (text: string, row: any, index: number) => {
                const onChange = (value: any) => {
                    const data: any = [...dataSource];
                    data[index].Params = value;
                    setDataSource(data);
                };
                return <Select value={text} onChange={onChange} />;
            },
        },
        {
            title: '权限',
            key: 'Authority',
            dataIndex: 'Authority',
            render: (text: string, row: any, index: number) => {
                const onChange = (value: any) => {
                    const data: any = [...dataSource];
                    data[index].Authority = value;
                    setDataSource(data);
                };
                return <Select value={text} onChange={onChange} />;
            },
        },
    ];

    // const getTableData = () => {
    // }

    const getEventList = () => {
        getSelectData('wf_num=R_S002_B006&NodeType=subProcess').then((res) => {
            if (res.data) {
                setEventList(
                    res.data.map((item: any) => ({ label: item.EventName, value: item.Eventid })),
                );
            }
        });
    };

    const addEvent = () => {
        const data: any = [...dataSource];
        data.push({
            Eventid: '',
        });
        setDataSource(data);
    };

    const selectRule = () => {
        if (ruleIndex != undefined) {
            const data: any = [...dataSource];
            data[ruleIndex].RuleNum = ruleValue;
            setDataSource(data);
            setRuleIndex(undefined);
            setRuleModalShow(false);
        }
    };

    return (
        <div>
            <Space style={{ marginBottom: 15 }}>
                <Button icon={<PlusOutlined />} onClick={addEvent}>
                    新增字段
                </Button>
                <Button icon={<DeleteOutlined />}>批量删除</Button>
            </Space>
            <Table
                style={{ marginBottom: 15 }}
                columns={columns}
                dataSource={dataSource}
                bordered
            />
            <Modal
                title="选择触发规则"
                visible={ruleModalShow}
                onOk={selectRule}
                onCancel={() => {
                    setRuleIndex(undefined);
                    setRuleModalShow(false);
                }}
                okText="确定"
                cancelText="取消"
            >
                <TreeSelect
                    value={ruleValue}
                    onChange={(value: any) => setRuleValue(value)}
                    treeData={processRuleData}
                    style={{ width: '100%' }}
                />
            </Modal>
        </div>
    );
};

export default HumanFieldsAuthority;
