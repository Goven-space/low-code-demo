import { FC, useEffect, useState } from 'react';
import {
    useXFlowApp,
    XFlowGraphCommands,
    XFlowNodeCommands,
    XFlowGroupCommands,
    NsGraphCmd,
    NsGroupCmd,
    MODELS,
    uuidv4
} from '@antv/xflow';
import type { IPosition } from '@antv/xflow-core';
import { Graph } from '@antv/x6'
import { Button, Divider, Space, Tooltip } from 'antd';
import {
    UndoOutlined,
    RedoOutlined,
    VerticalAlignTopOutlined,
    VerticalAlignBottomOutlined,
    MinusOutlined,
    PlusOutlined,
    OneToOneOutlined,
    CompressOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined
} from '@ant-design/icons';

const GROUP_NODE_RENDER_ID = 'GROUP_NODE_RENDER_ID';

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

export interface FlowToolbarProps {
    position: IPosition;
    setSwitch?: (bol: boolean) => void
}

export const FlowToolbar: FC<FlowToolbarProps> = (props) => {
    const app = useXFlowApp();
    const [full, setFull] = useState(false);

    useEffect(() => {
    }, [app]);

    const onUndo = () => {
        app.executeCommand<NsGraphCmd.GraphHistoryUndo.IArgs>(
            XFlowGraphCommands.GRAPH_HISTORY_UNDO.id,
            {},
        )
    }

    const onRedo = () => {
        app.executeCommand<NsGraphCmd.GraphHistoryRedo.IArgs>(
            XFlowGraphCommands.GRAPH_HISTORY_REDO.id,
            {},
          )
    }

    const onMultiSelect = () => {
        props.setSwitch && props.setSwitch(true)
        app.commandService.executeCommand<NsGraphCmd.GraphToggleMultiSelect.IArgs>(
          TOOLBAR_ITEMS.MULTI_SELECT,
          {},
        );
    }

    const onAddGroup = async () => {
        const cells = await MODELS.SELECTED_CELLS.useValue(app.modelService);
        const groupChildren = cells.map((cell: any) => cell.id);
        app.commandService.executeCommand<NsGroupCmd.AddGroup.IArgs>(TOOLBAR_ITEMS.ADD_GROUP, {
          nodeConfig: {
            id: uuidv4(),
            renderKey: GROUP_NODE_RENDER_ID,
            groupChildren,
            groupCollapsedSize: { width: 200, height: 40 },
            label: '新建群组',
          },
        });
    }

    const onDelGroup = async () => {
        const cell = await MODELS.SELECTED_NODE.useValue(app.modelService);
        const nodeConfig = cell.getData();
        app.commandService.executeCommand<NsGroupCmd.AddGroup.IArgs>(XFlowGroupCommands.DEL_GROUP.id, {
          nodeConfig: nodeConfig,
        });
    }

    const onScale = (type: string) => {
        if (type === 'plus') {
            app.executeCommand(XFlowGraphCommands.GRAPH_ZOOM.id, {
                factor: 0.1,
                zoomOptions: {
                    absolute: false,
                    minScale: 0,
                    maxScale: 1.5,
                },
            } as NsGraphCmd.GraphZoom.IArgs);
        } else if (type === 'minus') {
            app.executeCommand(XFlowGraphCommands.GRAPH_ZOOM.id, {
                factor: -0.1,
                zoomOptions: {
                    absolute: false,
                    minScale: 0,
                    maxScale: 1.5,
                },
            } as NsGraphCmd.GraphZoom.IArgs);
        } else if (type === 'real') {
            app.executeCommand(XFlowGraphCommands.GRAPH_ZOOM.id, {
                factor: 'real',
            } as NsGraphCmd.GraphZoom.IArgs);
        } else if (type === 'fit') {
            app.executeCommand(XFlowGraphCommands.GRAPH_ZOOM.id, {
                factor: 'fit',
            } as NsGraphCmd.GraphZoom.IArgs);
        } else if (type === 'full') {
            app.executeCommand(XFlowGraphCommands.GRAPH_FULLSCREEN.id, {} as NsGraphCmd.GraphFullscreen.IArgs);
            setFull(!full);
        }
    };

    return (
        <div
            className="xflow-toolbar"
            style={{ position: 'absolute', ...props.position, zIndex: 2 }}
        >
            <Space>
                <Tooltip placement="bottom" title="撤销">
                    <Button type="text" icon={<UndoOutlined />} onClick={onUndo}></Button>
                </Tooltip>
                <Tooltip placement="bottom" title="重做">
                    <Button type="text" icon={<RedoOutlined />} onClick={onRedo}></Button>
                </Tooltip>
            </Space>
            <Divider className="xflow-toolbar-divider" type="vertical" />
            {/* <Space>
                <Button
                    type="text"
                    icon={<VerticalAlignTopOutlined className="xflow-highlight-icon" />}
                    onClick={onFront}
                >
                    置前
                </Button>
                <Button
                    type="text"
                    icon={<VerticalAlignBottomOutlined className="xflow-highlight-icon" />}
                >
                    置后
                </Button>
            </Space>
            <Divider className="xflow-toolbar-divider" type="vertical" /> */}
            <Space>
                <Button
                    type="text"
                    icon={<img src={require('./img/multiSelect.png')} alt="框选" />}
                    onClick={onMultiSelect}
                >
                    开启框选
                </Button>
                <Button
                    type="text"
                    icon={<img src={require('./img/addGroup.png')} alt="新建群组" />}
                    onClick={onAddGroup}
                >
                    新建群组
                </Button>
                <Button
                    type="text"
                    icon={<img src={require('./img/delGroup.png')} alt="解散群组" />}
                    onClick={onDelGroup}
                >
                    解散群组
                </Button>
            </Space>
            <Divider className="xflow-toolbar-divider" type="vertical" />
            <Space>
                <Button
                    type="text"
                    icon={<MinusOutlined className="xflow-highlight-icon" />}
                    onClick={() => onScale('minus')}
                >
                    缩小
                </Button>
                <Button
                    type="text"
                    icon={<PlusOutlined className="xflow-highlight-icon" />}
                    onClick={() => onScale('plus')}
                >
                    放大
                </Button>
            </Space>
            <Divider className="xflow-toolbar-divider" type="vertical" />
            <Space>
                <Button
                    type="text"
                    icon={<OneToOneOutlined className="xflow-highlight-icon" />}
                    onClick={() => onScale('real')}
                >
                    缩放至1:1
                </Button>
                <Button
                    type="text"
                    icon={<CompressOutlined className="xflow-highlight-icon" />}
                    onClick={() => onScale('fit')}
                >
                    适应屏幕
                </Button>
                <Button
                    type="text"
                    icon={!full ? <FullscreenOutlined className="xflow-highlight-icon" /> : <FullscreenExitOutlined className="xflow-highlight-icon" />}
                    onClick={() => onScale('full')}
                >
                    {!full ? '全屏展示' : '退出全屏'}
                </Button>
            </Space>
        </div>
    );
};
