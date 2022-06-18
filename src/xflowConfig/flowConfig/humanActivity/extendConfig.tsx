import { Collapse, Form, Input, InputNumber, Select, Switch, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';
import { getSelectData } from '../apiList';

const treeDataFormat = (data: any) => {
    return data.map((item: any) => {
        let obj: any = {
            title: item.text,
            value: item.id,
        };
        if (item.children) {
            obj.children = treeDataFormat(item.children);
        }
        return obj;
    });
};

const HumanExtendConfig = ({}: any) => {
    const [formList, setFormList] = useState([]);
    const [childFormList, setChildFormList] = useState([])
    
    useEffect(() => {
        getFormList()
    }, [])

    const getFormList = () => {
        getSelectData('wf_num=R_S009_B001').then(res => {
            setFormList(treeDataFormat(res.data))
        })
        getSelectData('?wf_num=R_S009_B002').then(res => {
            setChildFormList(treeDataFormat(res.data))
        })
    }

    return (
        <>
            <Collapse defaultActiveKey={['1', '2', '3', '4', '5']}>
                <Collapse.Panel header="扩展属性" key="1">
                    <Form.Item label="主表单字段默认为可编辑" name="MainFormReadOnly" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="主表单所有字段强制只读" name="MainFormAllReadOnly" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="本环节禁止锁定文档" name="NotLockFlag" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="允许上一活动指定完成时间" name="OwnerLimitTimeFlag" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="会签时显示同意和不同意按扭" name="AgreeButtonFlag" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="自定义人员选择提示信息" name="OwnerSelectInfo">
                        <Input />
                    </Form.Item>
                    <Form.Item label="默认选中发送短信选项" name="SendSmsDefaultChecked" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="允许发送手机短信提醒" name="CanSendSmsFlag" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="自定义节点参数" name="NodeProperty" valuePropName='checked'>
                        <Input />
                    </Form.Item>
                    <Form.Item label="显示满意度评价选项" name="Satisfaction" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="绑定组织架构" name="OrgClass" valuePropName='checked'>
                        <TreeSelect treeData={formList} />
                    </Form.Item>
                </Collapse.Panel>
                <Collapse.Panel header="Word正文" key="2">
                    <Form.Item label="禁止拷贝屏幕" name="CanNotCopyScreen" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="修改时不保留痕迹" name="CanNotWordTrace" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="禁止拷贝正文" name="CanNotCopyWord" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="允许保存到本地" name="CanSaveToLocal" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="允许电子盖章" name="CanSignFlag" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="禁止编辑正文" name="CanNotEditWord" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="允许打印" name="CanPrintWordDoc" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="允许保存副本" name="CanSaveCopyDoc" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="允许打开本地Word文件" name="CanOpenLocalWord" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                    <Form.Item label="允许套红头" name="CanHongTou" valuePropName='checked'>
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                </Collapse.Panel>
                <Collapse.Panel header="管控点属性" key="3">
                    <Form.Item label="质量控制点" name="QualityControlPoint">
                        <TreeSelect treeData={childFormList} />
                    </Form.Item>
                    <Form.Item label="成本控制点" name="CostControlPoint">
                        <TreeSelect treeData={childFormList} />
                    </Form.Item>
                    <Form.Item label="风险控制点" name="RiskControlPoint">
                        <TreeSelect treeData={childFormList} />
                    </Form.Item>
                    <Form.Item label="绩效控制点" name="PPIControlPoint">
                        <TreeSelect treeData={childFormList} />
                    </Form.Item>
                </Collapse.Panel>
                <Collapse.Panel header="流程绩效" key="4">
                    <Form.Item label="优季指标(小时)" name="PPI_Optimal">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="良好指标(小时)" name="PPI_Good">
                        <InputNumber />
                    </Form.Item>
                </Collapse.Panel>
                <Collapse.Panel header="成本控制" key="5">
                    <Form.Item label="标准工时(小时)" name="CostStdManHour">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="标准工资率(数字)" name="CostStdWageRate">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="作业类型" name="CostJobType">
                        <Select>
                            <Select.Option value="1">作业</Select.Option>
                            <Select.Option value="2">检查</Select.Option>
                            <Select.Option value="3">审批</Select.Option>
                        </Select>
                    </Form.Item>
                </Collapse.Panel>
            </Collapse>
        </>
    )
}

export default HumanExtendConfig