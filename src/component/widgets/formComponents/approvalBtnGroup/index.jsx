import React, { useState, useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { approvavlSubmit, saveDoc } from '../../../../api/bpm';

const buttonConfig = {
    "BU1001": {
        type: "primary",
        title: "办理完成",
        key: "submit"
    },
    "BU1002": {
        type: "",
        title: "转他人处理"
    },
    "BU1003": {
        type: "",
        title: "回退上一用户"
    },
    "BU1004": {
        type: "",
        title: "回退上一环节"
    },
    "BU1005": {
        type: "",
        title: "回退首环节"
    },
    "BU1006": {
        type: "",
        title: "返回给转交者"
    },
    "BU1007": {
        type: "",
        title: "返回给回退者"
    },
    "BU1008": {
        type: "",
        title: "回退任意环节"
    },
    "BU1009": {
        type: "",
        title: "提交下一审批用户"
    },
    "BU1010": {
        type: "",
        title: "完成会签"
    },
    "BU1011": {
        type: "",
        title: "完成会签(不同意)"
    },
    "BU1012": {
        type: "",
        title: "完成会签(同意)"
    },
    "BU1022": {
        type: "",
        title: "暂存文档",
        key: "save"
    },
    "BU1024": {
        type: "",
        title: "拷贝到草稿箱"
    },
    "BU1025": {
        type: "",
        title: "自定义按扭"
    },
    "BU1026": {
        type: "",
        title: "直接归档"
    }
}

const ApprovalBtnGroup = (props) => {
    const [btnGroup, setBtnGroup] = useState([])
    
    const { getApprovalFormData } = props;

    useEffect(() => {
        props.btnList && setBtnGroup(getButtonGroup(props.btnList))
    }, [props.btnList])

    const getButtonGroup = (data) => {
        data = data.split(",")
        const list = data.map(item => {
            item = item.split("|")
            const key = item[0]
            const config = buttonConfig[key]
            return {
                title: item[1] || config.title || false,
                type: config.type,
                key: config.key || ""
            }
        })
        return list
    }

    const handleClick = (key) => {
        if (key === "submit") {
            const { userList, ...data } = getApprovalFormData()
            const formData = new URLSearchParams()
            for ( key in data) {
                formData.append(key,data[key])
            }
            userList.forEach(item => {
                formData.append(data.WF_NextNodeid, item)
            })
            approvavlSubmit(formData).then(res => {
                const {status,data} = res
                if (status === 200) {
                    message.success(data.msg)
                } else {
                    message.error(data.msg)
                }
            })
        }
    }

    return (
        <Space>
            {
                btnGroup.map(item => (
                    <Button type={item.type} onClick={() => handleClick(item.key)} >{item.title}</Button>
                ))
            }
        </Space>
    );
}

export default ApprovalBtnGroup;