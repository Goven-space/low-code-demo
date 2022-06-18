import React, {useState, useEffect} from 'react';
import { Table } from 'antd';
import difference from 'lodash/difference';
import { getRoleList } from '../../../../api/bpm';

const tableColumns = [
    {
        dataIndex: 'CnName',
        title: '岗位名称',
        width: '50%'
    },
    {
        dataIndex: 'RoleNumber',
        title: '岗位编号',
        width: '50%',
    }
];

const PositionListTable = (props) => {
    const [positionList, setPositionList] = useState([])
    const [total, setTotal] = useState(0);
    const [rows, setRows] = useState(25);
    const [page, setPage] = useState(1);

    const { targetKeys, listSelectedKeys, onItemSelectAll, onItemSelect, onTransferDataChange } = props;

    useEffect(() => {
        loadPositionList({rows,page})
    },[])

    const rowSelection = {
        getCheckboxProps: item => ({ disabled: targetKeys.includes(item.key) }),
        onSelectAll(selected, selectedRows) {
            console.log(selectedRows)
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

    const loadPositionList = (pagination) => {
        getRoleList({ wf_num: 'D_S007_J003', wf_gridnum: 'V_S007_G003', RoleType: 1 }, pagination).then(res => {
            const { data, status } = res
            if (status === 200) {
                const newData = data.rows.map(item => {
                    item.CnName = item.RoleName
                    item.key = item.RoleNumber
                    return item
                })
                setTotal(data.total)
                onTransferDataChange(newData)
                setPositionList(newData)
            }
        })
    }

    const onPageChange = (pagination) => {
        const { current, pageSize } = pagination
        setPage(current)
        setRows(pageSize)
        loadPositionList({ page: current, rows: pageSize })
    }

    return (
        <Table
            rowSelection={rowSelection}
            columns={tableColumns}
            dataSource={positionList}
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
                size: 'small',
                total,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                showSizeChanger: true,
                pageSize: rows,
                current: page,
                pageSizeOptions: [25, 30, 45, 60, 100, 200]
            }}
            scroll={{ y: 400 }}
        />
    );
}

export default PositionListTable;