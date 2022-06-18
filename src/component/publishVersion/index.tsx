import { FunctionComponent, useState } from 'react';
import { Modal, Form, Input,Alert } from 'antd';
import { Button, Message } from '@alifd/next';
import { publishVersion as publishVersionApi } from '../../api/version';
import { getUrlSearch } from '../../tool';
import { project } from '@alilc/lowcode-engine';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
interface publishProps {}

const publishVersion: FunctionComponent = (props: publishProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values: any) => {
    let pageConfigJson=JSON.stringify(project.exportSchema())
    let postParam = { pageId: getUrlSearch('id'), message: values.message,pageConfigJson };
    publishVersionApi(postParam).then((res) => {
      if (res.data.state) {
        Message.success(res.data.msg);
      } else {
        Message.error(res.data.msg);
      }
      handleCancel()
    });
  };

  return (
    <span>
      <>
        <Button type="primary" onClick={showModal}>
          发布
        </Button>
        <Modal title="发布版本" visible={isModalVisible} footer={false} onCancel={handleCancel}>
        <Alert style={{marginBottom:10}} message="请确认当前页面设计是否正确，再发布版本哟！" type="info" showIcon   />
          <Form name="nest-messages" onFinish={onFinish}>
            <Form.Item
              name="message"
              label="版本说明|描述"
              rules={[{ required: true }]}
              help="请描述该版本发布的相关内容，例如上线描述或更新功能点、修复问题点等"
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
              <Button size="medium" type="primary" htmlType="submit">
                发布
              </Button>{' '}
              <Button size="medium" htmlType="button" onClick={handleCancel}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    </span>
  );
};

export default publishVersion;
