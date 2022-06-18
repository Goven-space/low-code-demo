import { useEffect, useState } from 'react';
import { Button, Input, InputNumber, Modal, Select, Space, Table, TreeSelect } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons';
import { getSelectData, getEventData } from '../apiList';

const InnerEventSetting = ({ nodeData, subProcessData, processRuleData }: any) => {
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
            title: '对应事件ID',
            key: 'Eventid',
            dataIndex: 'Eventid',
            render: (text: string, row: any, index: number) => {
                const onChange = (value: any) => {
                    const data: any = [...dataSource];
                    data[index].Eventid = value;
                    setDataSource(data);
                };
                return (
                    <Select
                        className="event-select"
                        value={text}
                        options={eventList}
                        onChange={onChange}
                    />
                );
            },
        },
        {
            title: '触发规则',
            key: 'RuleNum',
            dataIndex: 'RuleNum',
            render: (text: string, row: any, index: number) => {
                const onClick = () => {
                    setRuleValue(text);
                    setRuleIndex(index);
                    setRuleModalShow(true);
                };
                return (
                    <div className="event-rule-setting" onClick={onClick}>
                        <TreeSelect
                            className="event-rul-select"
                            value={text}
                            disabled
                            treeData={processRuleData}
                            suffixIcon={<SettingOutlined />}
                        />
                    </div>
                );
            },
        },
        {
            title: '规则参数',
            key: 'Params',
            dataIndex: 'Params',
            width: 120,
            render: (text: string, row: any, index: number) => {
                const onChange = (value: any) => {
                    const data: any = [...dataSource];
                    data[index].Params = value;
                    setDataSource(data);
                };
                return <Input value={text} onChange={onChange} />;
            },
        },
        {
            title: '排序号',
            key: 'SortNum',
            dataIndex: 'SortNum',
            render: (text: string, row: any, index: number) => {
                const onChange = (value: any) => {
                    const data: any = [...dataSource];
                    data[index].SortNum = value;
                    setDataSource(data);
                };
                return <InputNumber value={text} onChange={onChange} />;
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
                <Button type="primary" icon={<SaveOutlined />}>
                    保存事件
                </Button>
                <Button icon={<PlusOutlined />} onClick={addEvent}>
                    新增事件
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

export default InnerEventSetting;
