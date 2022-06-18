import React, { useState, useEffect, useRef } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Modal, Input, Button, Row, Col, Transfer, Divider } from 'antd';
import './index.less';

const baseURL = window.location.origin + '/home.html?rc_appId=bpm_todo'

const CommonApp = (props) => {
    const [appList, setAppList] = useState([])
    const [list, setList] = useState([])
    const [label, setLabel] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])
    const [targetKeys, setTargetKeys] = useState([])

    const inputRef = useRef()
    const $id = useRef()
    const currentSchema = useRef()
    const firstRender = useRef(true)

    const flag = props.options.addons ? false : true;

    useEffect(() => {
        if (props.options) {
            $id.current = props.options.schema.$id.replace('#/', '')
            let list = []
            let label = '常用应用'
            if (props.parentRef) {
                currentSchema.current = props.parentRef.current.getValue()
                list = currentSchema.current.properties[$id.current].list || []
                label = currentSchema.current.properties[$id.current].label || ''
                if (firstRender.current) {
                    setAppList(props.appList)
                    const selectedList = list.map(item => item.key)
                    setSelectedKeys(selectedList)
                    setTargetKeys(selectedList)
                    firstRender.current = false
                    if (list.length === 0) {
                        setShowModal(true)
                    }
                }
            } else {
                list = props.options.schema.list || [];
                label = props.options.schema.label || '';
            }
            setList(list)
            setLabel(label)
        }
    }, [props.options?.schema?.list])

    const changeLabel = (e) => {
        const value = e.target.value
        setLabel(e.target.value)
        currentSchema.current.properties[$id.current].label = value
        props.parentRef.current.setValue(currentSchema.current)
    }

    const handleClick = () => {
        setShowModal(true)
    }

    const handleCancel = () => {
        setShowModal(false)
    }

    const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
        setTargetKeys([...sourceSelectedKeys, ...targetSelectedKeys])
    }

    const onChange = (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
        const newKeys = selectedKeys.filter(item => item !== moveKeys[0])
        setSelectedKeys(newKeys)
    }

    const filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

    const submit = () => {
        setList(targetKeys)
        const list = []
        for (let i = 0; i < targetKeys.length; i++) {
            appList.forEach(item => {
                if (item.key === targetKeys[i]) {
                    list.push(item)
                }
            })
        }
        currentSchema.current.properties[$id.current].list = list
        props.parentRef.current.setValue(currentSchema.current)
        setShowModal(false)
    }

    const appClick = (key) => {
        !flag && (window.open(`${baseURL}&bpm_appId=${key}`))
    }

    return (
        <div className="myApp-wrapper">
            <div className="container">
                <Modal title="添加应用" visible={showModal} footer={null} onCancel={handleCancel} maskClosable={false} width={650} >
                    <Transfer
                        titles={['未添加', '已添加']}
                        dataSource={appList}
                        targetKeys={targetKeys}
                        selectedKeys={selectedKeys}
                        filterOption={filterOption}
                        operationStyle={{ display: 'none' }}
                        onChange={onChange}
                        listStyle={{
                            width: 650,
                            height: 400,
                        }}
                        showSelectAll={false}
                        render={
                            item => (
                                <div>
                                    <div className='appList-icon'><img src="assets/workbench/application_1.png" /></div>
                                    {' '}
                                    <span className='appList-title'>{item.title}</span>
                                </div>
                            )
                        }
                        onSelectChange={handleSelectChange}
                        oneWay
                        showSearch
                    />
                    <Row gutter={[8, 6]} justify="center" style={{ marginTop: "10px" }}>
                        <Col span={4}>
                            <Button type="primary" onClick={submit}>确定</Button>
                        </Col>
                        <Col span={4}>
                            <Button onClick={handleCancel}>关闭</Button>
                        </Col>
                    </Row>
                </Modal>
                <div class="myApp-tool-bar">
                    {flag ?
                        <>
                            <Input ref={inputRef} maxLength={25} value={label} onChange={changeLabel} ></Input>{' '}
                            <Button type="text" onClick={handleClick}><SettingOutlined /></Button>
                        </>
                        : <span className="myApp-title">{label}</span>
                    }
                </div>
                <Divider></Divider>
                <ul className="myApp-list">
                    {list?.map((item) => {
                        return (
                            <li key={item?.key}>
                                <button className='myApp-item' onClick={() => { appClick(item.key) }} >
                                    <div className='myApp-icon'><img src="assets/workbench/application_1.png" alt={item?.title || '未命名应用'} /></div>
                                    <p>{item?.title || '未命名应用'}</p>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
}

export default CommonApp;