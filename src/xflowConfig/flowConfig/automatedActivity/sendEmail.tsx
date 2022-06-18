import { Switch, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getEventData } from '../apiList';

const AutomatedSendEmail = ({}: any) => {
    const [sendData, setSendData] = useState([]);

    useEffect(() => {
        getEventData('wf_num=S_S002_001').then((res) => {
            setSendData(
                res.data.map((item: any) => ({ label: item.FieldText, value: item.FieldValue })),
            );
        });
    }, []);

    return (
        <>
            <Form.Item label="本环节启动后发送邮件" name="SendMailFlag">
                <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
            <Form.Item label="标题" name="MailTitle">
                <Input />
            </Form.Item>
            <Form.Item label="主送" name="SendTo">
                <Select
                    showSearch
                    options={sendData}
                    filterOption={(input, option: any) =>
                        (option!.children as unknown as string)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                />
            </Form.Item>
            <Form.Item label="抄送" name="CopyTo">
                <Select
                    showSearch
                    options={sendData}
                    filterOption={(input, option: any) =>
                        (option!.children as unknown as string)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                />
            </Form.Item>
            <Form.Item label="内容" name="MailBody">
                <Input.TextArea />
            </Form.Item>
        </>
    );
};

export default AutomatedSendEmail;
