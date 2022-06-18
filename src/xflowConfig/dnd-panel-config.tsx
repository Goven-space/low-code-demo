import type { NsNodeCollapsePanel } from '@antv/xflow';
import { XFlowConstants } from '@antv/xflow';
import React from 'react';
import * as commandUtils from './comannd-utils';

export const DND_RENDER_ID = 'DND_RENDER_ID';

export const onNodeDrop: NsNodeCollapsePanel.IOnNodeDrop = async (nodeConfig, commandService) => {
  commandUtils.addNode(commandService, nodeConfig);
};

export const nodeDataService: NsNodeCollapsePanel.INodeDataService = async (meta, modelService) => {
  console.log(meta, modelService);
  return [
    {
      id: 'basic',
      header: '流程基本组件',
      children: [
        {
          id: '0',
          label: "内部子流程",
          renderKey: XFlowConstants.XFLOW_DEFAULT_NODE,
          icon: <img src={require('./img/flow.png')} alt="icon" />
        },
        {
            id: '1',
            label: "外部子流程",
            renderKey: XFlowConstants.XFLOW_DEFAULT_NODE,
            icon: <img src={require('./img/flow.png')} alt="icon" />
        },
        {
            id: '2',
            label: "自动活动",
            renderKey: XFlowConstants.XFLOW_DEFAULT_NODE,
            icon: <img src={require('./img/automated.png')} alt="icon" />
        },
        {
            id: '3',
            label: "人工活动",
            renderKey: XFlowConstants.XFLOW_DEFAULT_NODE,
            icon: <img src={require('./img/artificial.png')} alt="icon" />
        },
        {
            id: '4',
            label: "网关",
            renderKey: XFlowConstants.XFLOW_DEFAULT_NODE,
            icon: <img src={require('./img/gateway.png')} alt="icon" />
        },
        {
            id: '5',
            label: "流程开始",
            renderKey: XFlowConstants.XFLOW_DEFAULT_NODE,
            icon: <img src={require('./img/start.png')} alt="icon" />
        },
        {
            id: '6',
            label: "流程结束",
            renderKey: XFlowConstants.XFLOW_DEFAULT_NODE,
            icon: <img src={require('./img/end.png')} alt="icon" />
        },
        {
            id: '7',
            label: "事件",
            renderKey: XFlowConstants.XFLOW_DEFAULT_NODE,
            icon: <img src={require('./img/event.png')} alt="icon" />
        },
      ],
    },
  ];
};

export const searchService: NsNodeCollapsePanel.ISearchService = async (
  nodes: NsNodeCollapsePanel.IPanelNode[] = [],
  keyword: string,
) => {
  console.log(nodes);
  const list = nodes.filter((node) => node.label.includes(keyword));
  console.log(list, keyword, nodes);
  return list;
};
