import { FC } from 'react';
import {
  useXFlowApp,
  XFlowGraphCommands,
  XFlowNodeCommands,
  XFlowGroupCommands,
  NsGraphCmd,
} from '@antv/xflow';
import type { IPosition } from '@antv/xflow-core';
import { Button, Space } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

export namespace TOOLBAR_ITEMS {
  export const BACK_NODE = XFlowNodeCommands.BACK_NODE.id;
  export const FRONT_NODE = XFlowNodeCommands.FRONT_NODE.id;
  export const SAVE_GRAPH_DATA = XFlowGraphCommands.SAVE_GRAPH_DATA.id;
  export const REDO_CMD = `${XFlowGraphCommands.REDO_CMD.id}`;
  export const UNDO_CMD = `${XFlowGraphCommands.UNDO_CMD.id}`;
  export const MULTI_SELECT = `${XFlowGraphCommands.GRAPH_TOGGLE_MULTI_SELECT.id}`;
  export const ADD_GROUP = `${XFlowGroupCommands.ADD_GROUP.id}`;
  export const DEL_GROUP = `${XFlowGroupCommands.DEL_GROUP.id}`;
  export const COPY = `${XFlowGraphCommands.GRAPH_COPY.id}`;
  export const PASTE = `${XFlowGraphCommands.GRAPH_PASTE.id}`;
}

export interface FlowHeaderProps {
  position: IPosition;
}

export const FlowHeader: FC<FlowHeaderProps> = (props) => {
  const app = useXFlowApp();

  const onSave = () => {
    app.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(TOOLBAR_ITEMS.SAVE_GRAPH_DATA, {
      saveGraphDataService: (meta, graphData) => {
        console.log(graphData);
        return null;
      },
    });
  };

  return (
    <div className="xflow-header" style={{ position: 'absolute', ...props.position, zIndex: 2 }}>
      <div className="xflow-header-left">
        <Button type="text" icon={<LeftOutlined />}>
          返回流程设计管理
        </Button>
      </div>
      <Space className="xflow-header-right">
        <Button className="xflow-save-btn" onClick={onSave}>
          保存
        </Button>
        <Button className="xflow-start-btn" type="primary">
          启用流程
        </Button>
      </Space>
    </div>
  );
};
