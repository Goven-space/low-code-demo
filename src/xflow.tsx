import type { IAppLoad } from '@antv/xflow';
import ReactDOM from 'react-dom';
import React, { useRef, useEffect, useState } from 'react';
import '@antv/xflow/dist/index.css';
import 'antd/dist/antd.less';
/** 交互组件 */
import {
  /** XFlow核心组件 */
  XFlow,
  /** 流程图画布组件 */
  FlowchartCanvas,
  /** 流程图配置扩展 */
  FlowchartExtension,
  /** 流程图节点组件 */
  FlowchartNodePanel,
  /** 流程图表单组件 */
  FlowchartFormPanel,
  /** 通用组件：快捷键 */
  KeyBindings,
  /** 通用组件：右键菜单 */
  CanvasContextMenu,
  /** 通用组件：对齐线 */
  CanvasSnapline,
  /** 通用组件：节点连接桩 */
  CanvasNodePortTooltip,
  NsJsonSchemaForm,
  createGraphConfig,
  IEvent
} from '@antv/xflow';
import type { Graph } from '@antv/x6';
/** 配置Command*/
import { useCmdConfig } from './xflowConfig/config-cmd';
/** 配置Menu */
import { useMenuConfig } from './xflowConfig/config-menu';
/** 配置Toolbar */
import { useToolbarConfig } from './xflowConfig/config-toolbar';
/** 配置快捷键 */
import { useKeybindingConfig } from './xflowConfig/config-keybinding';
/** 配置Dnd组件面板 */
import { DndNode } from './xflowConfig/dnd-node';

import { nodes } from './xflowConfig/custom-nodes';

import { FlowHeader } from './xflowConfig/flow-header';

import { FlowToolbar } from './xflowConfig/flow-toolbar';

import './xflowConfig/index.less';

import NodeConfig from './xflowConfig/flowConfig'
// import NodeForm from './xflowConfig/nodeForm';

export interface IProps {
  meta?: { flowId: string };
}


const Demo: React.FC<IProps> = (props) => {
  const { meta } = props;
  const toolbarConfig = useToolbarConfig();
  const menuConfig = useMenuConfig();
  const keybindingConfig = useKeybindingConfig();
  const graphRef = useRef<Graph>();
  const commandConfig = useCmdConfig();
  const [nodeData, setNodeData] = useState<any | undefined>(undefined)
  const [ flowConfigShow, setFlowConfigShow ] = useState(false);
  const formSchemaService = async (args: any) => {
    var _a;
    const { targetType } = args;
    const isGroup = (_a = args.targetData) === null || _a === void 0 ? void 0 : _a.isGroup;
    const groupSchema = {
        tabs: [
            {
                name: '设置',
                groups: [
                    {
                        name: 'groupName',
                        controls: [
                            {
                                label: '分组名',
                                name: 'group-service',
                                shape: 'group-service',
                                placeholder: '分组名称',
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const nodeSchema = {
        tabs: [
            {
                name: '设置',
                groups: [
                    {
                        name: 'groupName',
                        controls: [
                            {
                                label: '节点名',
                                name: 'node-service',
                                shape: 'node-service',
                                placeholder: '节点名称',
                            },
                        ],
                    },
                ],
            },
        ],
    };
    const edgeSchema = {
        tabs: [
            {
                name: '设置',
                groups: [
                    {
                        name: 'groupName',
                        controls: [
                            {
                                label: '边',
                                name: 'edge-service',
                                shape: 'edge-service',
                                placeholder: '边名称',
                                strokeDasharray: false
                            },
                        ],
                    },
                ],
            },
        ],
    };
    if (isGroup) {
        return groupSchema;
    }
    if (targetType === 'node') {
        return nodeSchema;
    }
    if (targetType === 'edge') {
        return edgeSchema;
    }
    return {
        tabs: [
            {
                name: '设置',
                groups: [
                    {
                        name: 'groupName',
                        controls: [
                            {
                                label: '',
                                name: 'canvas-service',
                                shape: 'canvas-service',
                            },
                        ],
                    },
                ],
            },
        ],
    };
  }


  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.on('node:click', (...arg) => {
        console.log(arg);
      });
    }
  }, [graphRef]);

  /**
   * @param app 当前XFlow工作空间
   * @param extensionRegistry 当前XFlow配置项
   */
  const onLoad: IAppLoad = async (app) => {
    graphRef.current = await app.getGraphInstance();
  };

  const useConfig = ((config: any) => {
    const nodeEvent: IEvent<'node:click'> = {
      eventName: 'node:click',
      callback: (e) => {
        const data = e.node.data;
        if(data.name){
          setNodeData(e.node.data);
          setFlowConfigShow(true)
        }
      },
    }
    config.setEvents([...config.events, nodeEvent])
  })

  return (
    <XFlow
      className="flow-user-custom-clz"
      commandConfig={commandConfig}
      onLoad={onLoad}
      meta={meta}
    >
      <FlowHeader position={{ top: 0, left: 0, right: 0}} />
      <FlowchartExtension />
      <FlowchartNodePanel
        showOfficial={false}
        registerNode={{
          title: '流程基本组件',
          key: "basic",
          nodes,
        }}
        
        defaultActiveKey={['basic']}
        position={{ width: 190, top: 70, bottom: 0, left: 0 }}
        
      />
      <FlowToolbar position={{top: 80, left: 220, right: 30}} />
      <FlowchartCanvas position={{ top: 70, left: 0, right: 0, bottom: 0 }} useConfig={useConfig}>
        <CanvasContextMenu config={menuConfig} />
        <CanvasSnapline color="#faad14" />
        <CanvasNodePortTooltip />
      </FlowchartCanvas>
      <NodeConfig show={flowConfigShow} setShow={setFlowConfigShow} data={nodeData} />
      <KeyBindings config={keybindingConfig} />
    </XFlow>
  );
};

ReactDOM.render(<Demo />, document.getElementById('xflow'));
// export default Demo
