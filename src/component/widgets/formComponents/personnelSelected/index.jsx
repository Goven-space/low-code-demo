import React, { useState, useEffect, useRef } from 'react';
import { Tree, Modal, Button, Layout, Transfer, Table, Tabs, Row, Col, message } from 'antd';
import { TeamOutlined, FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';
import difference from 'lodash/difference';
import differenceBy from 'lodash/differenceBy';
import { getPersonnelRule } from '../../../../api/bpm';
import PersonnelListTable from './personnelListTable';
import DepartmentListTree from './departmentListTree';
import RoleListTable from './roleListTable';
import PositionListTable from './positionListTable';

const { TabPane } = Tabs;

const rightTableColumns = [
    {
        dataIndex: 'CnName',
        title: '中文名',
    }
];

const PersonnelSelected = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [targetKeys, setTargetKeys] = useState([]);
    const [personnelRule, setPersonnelRule] = useState([]);
    const [showSelected, setShowSelected] = useState([]);
    const [loadParams, setLoadParams] = useState({});
    const [transferList, setTransferList] = useState([]);

    let checkData = [];

    const { save, min, max, type } = props

    const transferData = useRef([])
    const activeTabKey = useRef('personnelList')

    const treeDataTransform = (data, key, type) => {
        if (typeof data === 'string') {
            return
        }
        const arr = data.map((item, index) => {
            const newkey = key ? `${key}_${index}` : `orgclass_${index}`

            return {
                key: newkey,
                title: item.text,
                OrgClass: item.OrgClass,
                id: item.id,
                selectable:  type === 'orgclass' || (item.state === 'open' && !item.children),
                dtype: item.dtype,
                parentDtype: type,
                isLeaf: item.state === 'open' && !item.children,
                icon: ({ isLeaf, expanded }) => !isLeaf && (expanded ? <FolderOpenOutlined /> : <FolderOutlined />),
                children: item.children && treeDataTransform(item.children, newkey, item.dtype ||type)
            }
        })
        return arr
    }

    const updateTreeData = (list, key, children, type) => {
        return list.map((node) => {
            if (node.key === key) {
                return { ...node, children: treeDataTransform(children, key, type) };
            }
            if (node.children) {
                return { ...node, children: updateTreeData(node.children, key, children, type) };
            }
            return node;
        });
    }

    const loadTreeData = (params, key, resolve, type) => {
        getPersonnelRule({ ...params }).then(res => {
            const { data, status } = res;
            if (status === 200) {
                key ? setPersonnelRule(origin => {
                    return updateTreeData(origin, key, data, type)
                }) :
                    setPersonnelRule(treeDataTransform(data))
            }
            resolve && resolve()
        })
    }

    const handleClick = () => {
        loadTreeData({ wf_num: 'R_S007_B001' })
        setShowModal(true);
    }

    const handleCancel = () => {
        setShowModal(false);
    }

    const onChange = (nextTargetKeys, direction, moveKeys) => {   
        setTargetKeys(nextTargetKeys);
    }

    const onLoadData = (node) => {
        const { key, isLeaf, children, OrgClass, dtype, id, parentDtype } = node
        const wf_num = 'R_S007_B001';
        return new Promise(resolve => {
            if (!isLeaf && !children) {
                loadTreeData({ wf_num, id, OrgClass, dtype }, key, resolve, dtype || parentDtype)
            } else {
                resolve()
            }
        })
    }

    const onSelect = (selectedKeys, { selectedNodes }) => {
        let params 
        if (selectedNodes[0].dtype === 'orgclass' || selectedNodes[0].parentDtype === 'orgclass') {
            params = {
                wf_num: 'D_S007_J002',
                wf_gridnum: 'V_S007_G002',
                OrgClass: selectedNodes[0].OrgClass,
                Folderid: selectedNodes[0].id
            }
        } else if (selectedNodes[0].dtype === 'Role' || selectedNodes[0].parentDtype === 'Role') {
            params = {
                wf_num: 'D_S007_J007',
                wf_gridnum: 'V_S007_G007',
                RoleNumber: selectedNodes[0].id
            }
        }
        setLoadParams(params)
    }

    const onTransferDataChange = (list) => {
        const newList = differenceBy(list,transferData.current,'key')
        transferData.current = [...transferData.current,...newList]
        setTransferList(transferData.current)
    }

    const handleOK = () => {
        if (min && checkData.length < min) {
            message.info(`选择人员数量不能少于${min}人`)
            return 
        } else if (max && max !== "0" && checkData.length > max) {
            message.info(`选择人员数量不能大于${max}人`)
            return 
        }
        setShowSelected(checkData)
        save && save(checkData)
        handleCancel()
    }

    const onTabChange = (key) => {
        activeTabKey.current = key
    }

    return (
        <>
            <Modal visible={showModal} footer={null} destroyOnClose={true} maskClosable={false} onCancel={handleCancel} width={1500} bodyStyle={{ height: '720px', paddingTop: '50px' }}>
                <Layout style={{ width: '100%', minHeight: '100%' }}>
                    <Layout>
                        <Layout.Sider style={{ Height: '100%', paddingTop: '40px', backgroundColor: '#fff' }}>
                            <Tree
                                showLine
                                showIcon
                                onSelect={onSelect}
                                treeData={personnelRule}
                                loadData={(node) => onLoadData(node)}
                                height={550}
                            />
                        </Layout.Sider>
                        <Layout.Content style={{ backgroundColor: '#fff' }}>
                            <Transfer
                                titles={['', '已选择用户']}
                                listStyle={
                                    ({ direction }) => {
                                        return direction === 'left' ? { width: 1000, height: 600 } : { width: 200, height: 600, flex: 'none' }
                                    }
                                }
                                targetKeys={targetKeys}
                                onChange={onChange}
                                showSelectAll={false}
                                dataSource={transferList}
                            >
                                {({
                                    direction,
                                    filteredItems,
                                    onItemSelectAll,
                                    onItemSelect,
                                    selectedKeys: listSelectedKeys,
                                }) => {
                                    const isLeft = direction === 'left'
                                    !isLeft && (checkData = filteredItems)

                                    const rowSelection = {
                                        onSelectAll(selected, selectedRows) {
                                            const treeSelectedKeys = selectedRows
                                                .map(({ key }) => key);
                                            const diffKeys = selected
                                                ? difference(treeSelectedKeys, listSelectedKeys)
                                                : difference(listSelectedKeys, treeSelectedKeys);
                                            onItemSelectAll(diffKeys, selected);
                                        },
                                        onSelect({ key }, selected) {
                                            onItemSelect(key, selected);
                                        },
                                        selectedRowKeys: listSelectedKeys,
                                    };
                                    return (
                                        isLeft ?
                                            <Tabs type="card" defaultActiveKey="personnelList" onChange={onTabChange}>
                                                <TabPane tab="用户列表" key="personnelList">
                                                    <PersonnelListTable  onTransferDataChange={onTransferDataChange} loadParams={loadParams} targetKeys={targetKeys} listSelectedKeys={listSelectedKeys} onItemSelectAll={onItemSelectAll} onItemSelect={onItemSelect}  />
                                                </TabPane>
                                                {
                                                    type !== "participator" &&
                                                    <TabPane tab="部门列表" key="departmentList">
                                                        <DepartmentListTree onTransferDataChange={onTransferDataChange} targetKeys={targetKeys} onItemSelect={onItemSelect} />
                                                    </TabPane>
                                                }
                                                {
                                                    type !== "participator" && type !== "copyToSelected"&&
                                                    <TabPane tab="角色列表" key="roleList">
                                                        <RoleListTable onTransferDataChange={onTransferDataChange} targetKeys={targetKeys} listSelectedKeys={listSelectedKeys} onItemSelectAll={onItemSelectAll} onItemSelect={onItemSelect} />
                                                    </TabPane>
                                                }
                                                {
                                                    type !== "participator" && type !== "copyToSelected" &&
                                                    <TabPane tab="岗位列表" key="positionList">
                                                        <PositionListTable onTransferDataChange={onTransferDataChange} targetKeys={targetKeys} listSelectedKeys={listSelectedKeys} onItemSelectAll={onItemSelectAll} onItemSelect={onItemSelect} />
                                                    </TabPane>
                                                }
                                                
                                            </Tabs>
                                            :
                                            <Table
                                                rowSelection={rowSelection}
                                                columns={rightTableColumns}
                                                dataSource={filteredItems}
                                                rowKey={record => record.key}
                                                size="small"
                                                onRow={({ key }) => ({
                                                    onClick: () => {
                                                        onItemSelect(key, !listSelectedKeys.includes(key));
                                                    },
                                                })}
                                            />
                                    )
                                }}
                            </Transfer>
                        </Layout.Content>
                    </Layout>
                    <Row gutter={[24,0]} style={{backgroundColor:'#fff'}} justify="center">
                            <Col>
                                <Button type='primary' onClick={handleOK}>确定</Button>
                            </Col>
                            <Col>
                            <Button onClick={handleCancel}>关闭</Button>
                            </Col>
                        </Row>
                </Layout>
            </Modal>
            <div>
                {/* {showSelected.map(item => <span>{item.CnName}{'    '}</span>)} */}
                <Button style={{ borderRadius: '5px' }} icon={< TeamOutlined />} onClick={handleClick}></Button>
            </div>
        </>

    );
}

export default PersonnelSelected;