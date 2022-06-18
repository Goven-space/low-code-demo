import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import difference from 'lodash/difference';
import { getPersonnelList } from '../../../../api/bpm';

const TableColumns = [
    {
        dataIndex: 'CnName',
        title: '中文名',
        width: '25%'
    },
    {
        dataIndex: 'Userid',
        title: '用户id',
        width: '25%',
    },
    {
        dataIndex: 'JobTitle',
        title: '职务',
        width: '25%'
    },
    {
        dataIndex: 'FolderName',
        title: '所属部门',
        width: '25%'
    }
];

const PersonnelListTable = (props) => {

    const [personnelTable, setPersonnelTable] = useState([]);
    const [total, setTotal] = useState(0);
    const [rows, setRows] = useState(25);
    const [page, setPage] = useState(1);

    const { targetKeys, listSelectedKeys, onItemSelectAll, onItemSelect, loadParams, onTransferDataChange } = props;

    useEffect(() => {
        loadTableData({ page: 1, rows: 25 })
    },[])

    useEffect(() => {
        if (loadParams && Object.keys(loadParams).length) {
            loadTableData({ page: 1, rows: 25 }, loadParams)
            setPage(1)
            setRows(25)
        }
    }, [loadParams])
  
    const rowSelection = {
        getCheckboxProps: item => ({ disabled: targetKeys.includes(item.key) }),
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
        selectedRowKeys: listSelectedKeys
    };

    const loadTableData = (pagination, params = { wf_num: 'D_S007_J001', wf_gridnum: 'V_S006_G001' }) => {
        getPersonnelList(pagination, params).then(res => {
            const { data, status } = res;
            if (status === 200) {
                const newData = data.rows.map(item => {
                    item.key = item.Userid
                    return item
                })
                setTotal(data.total)
                onTransferDataChange(newData)
                setPersonnelTable(newData)
            }
        })
    }

    const onPageChange = (pagination) => {
        const { current, pageSize } = pagination
        setPage(current)
        setRows(pageSize)
        const params = Object.keys(loadParams).length ? loadParams : undefined;
        loadTableData({ page:current, rows:pageSize }, params)
    }

    return (
        <Table
            rowSelection={rowSelection}
            columns={TableColumns}
            dataSource={personnelTable}
            rowKey={record => record.key}
            size="small"
            onRow={({ key }) => ({
                onClick: () => {
                    if (targetKeys.includes(key)) return;
                    onItemSelect(key, !listSelectedKeys.includes(key));
                },
            })}
            onChange={onPageChange}
            pagination={{
                size:'small',
                total,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
                pageSize:rows,
                current: page,
                pageSizeOptions:[25,30,45,60,100,200]
            }}
            scroll={{y:400}}
        />
    );
}

export default PersonnelListTable;