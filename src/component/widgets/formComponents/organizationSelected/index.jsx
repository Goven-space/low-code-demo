import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import { getPersonnelRule } from '../../../../api/bpm';
import {  FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';

const OrganizationSelected = (props) => {
    const [organizationList, setOrganizationList] = useState([])

    useEffect(() => {
        loadTreeData()
    }, [])

    const treeDataTransform = (data) => {
        const arr = data.map((item, index) => {
            return {
                value: item.id,
                title: item.text,
                OrgClass: item.OrgClass,
                id: item.id,
                isLeaf: item.state === 'open' && !item.children,
                icon: ({ isLeaf, expanded }) => !isLeaf && (expanded ? <FolderOpenOutlined /> : <FolderOutlined />),
                children: item.children && treeDataTransform(item.children)
            }
        })
        return arr
    }
    
    const updateTreeData = (list,key, children) => {
        return list.map((node) => {
            if (node.value === key) {
                return { ...node, children: treeDataTransform(children) };
            }
            if (node.children) {
                return { ...node, children: updateTreeData(node.children, key, children) };
            }
            return node;
        });
    }

    const loadTreeData = (params, key, resolve) => {
        getPersonnelRule({ wf_num: 'R_S007_B007', ...params }).then(res => {
            const { data, status } = res;
            if (status === 200) {
                key ? setOrganizationList(origin => {
                    return updateTreeData(origin, key, data)
                }) :
                    setOrganizationList(treeDataTransform(data))
            }
            resolve && resolve()
        })
    }

    const onLoadData = (node) => {
        const {  isLeaf, children, id } = node
        return new Promise(resolve => {
            if (!isLeaf && !children) {
                loadTreeData({ id }, id, resolve)
            } else {
                resolve()
            }
        })
    }

    const handleChange = (value, node) => {
        props.onChange(value)
    }

    return (
        <TreeSelect
            multiple={props.schema.isMultiple}
            treeLine
            showIcon
            style={{ width: '100%' }}
            treeData={organizationList}
            onChange={handleChange}
            loadData={(node) => onLoadData(node)}
        />
    );
}

export default OrganizationSelected;