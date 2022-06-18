import React, {useEffect, useState} from 'react';
import { Tree } from 'antd';
import { getPersonnelRule } from '../../../../api/bpm';
import { FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';

const DepartmentListTree = (props) => {
    const [departmentList, setDepartmentList] = useState([])

    const { targetKeys, onItemSelect, onTransferDataChange} = props

    useEffect(() => {
        loadTreeData({ wf_num: 'R_S007_B002' })
    }, [])

    const isChecked = (selectedKeys, eventKey) => selectedKeys.indexOf(eventKey) !== -1;

    
    const updateTreeData = (list, key, children) => {
        return list.map((node) => {
            if (node.key === key) {
                return { ...node, children: treeDataTransform(children, key) };
            }
            if (node.children) {
                return { ...node, children: updateTreeData(node.children, key, children ) };
            }
            return node;
        });
    }

    const treeDataTransform = (data, key) => {
        if (typeof data === 'string') {
            return
        }
        const treeListData = []
        const arr = data.map((item, index) => {
            const newkey = key ? `${key}_${index}` : `orgclass_${index}`
            treeListData.push({ key: newkey, CnName: item.text, Deptid: item.Deptid })
            return {
                key: newkey,
                title: item.text,
                OrgClass: item.OrgClass,
                id: item.id,
                selectable: false,
                checkable: !!item.Deptid,
                dtype: item.dtype,
                isLeaf: item.state === 'open' && !item.children,
                icon: ({ isLeaf, expanded }) => !isLeaf && (expanded ? <FolderOpenOutlined /> : <FolderOutlined />),
                children: item.children && treeDataTransform(item.children, newkey)
            }
        })
        onTransferDataChange(treeListData)
        return arr
    }

    const generateTree = (treeNodes = [], checkedKeys = []) =>
        treeNodes.map(({ children, ...props }) => ({
            ...props,
            disabled: checkedKeys.includes(props.key),
            children: children &&generateTree(children, checkedKeys),
        }));
    
    const loadTreeData = (params, key, resolve) => {
        getPersonnelRule({ ...params }).then(res => {
            const { data, status } = res;
            if (status === 200) {
                key ? setDepartmentList(origin => (
                    updateTreeData(origin, key, data)
                )) :            
                    setDepartmentList(treeDataTransform(data))
            }
            resolve && resolve()
        })
    }
    
    const onLoadData = (node) => {
        const { key, isLeaf, children, OrgClass, dtype, id } = node
        const wf_num = 'R_S007_B002';
        return new Promise(resolve => {
            if (!isLeaf && !children) {
                loadTreeData({ wf_num, id, OrgClass, dtype }, key, resolve)
            } else {
                resolve()
            }
        })
    }

    return (
        <Tree
            showLine
            showIcon
            checkable
            // onSelect={onSelect}
            checkStrictly
            treeData={generateTree(departmentList, targetKeys)}
            loadData={(node) => onLoadData(node)}
            height={500}
            onCheck={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(targetKeys, key));
            }}
            onSelect={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(targetKeys, key));
            }}
        />
    );
}

export default DepartmentListTree;