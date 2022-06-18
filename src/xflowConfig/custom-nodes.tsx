import { XFlowConstants } from '@antv/xflow';
import { DndNode } from './dnd-node';

export const nodes = [
  {
    component: DndNode,
    name: 'inner-sub-process',
    width: 150,
    height: 40,
    label: (
      <>
        <img src={require('./img/flow.png')} alt="icon" />
        内部子流程
      </>
    ),
  },
  {
    component: DndNode,
    name: 'external-sub-process',
    width: 150,
    height: 40,
    label: (
      <>
        <img src={require('./img/flow.png')} alt="icon" />
        外部子流程
      </>
    ),
  },
  {
    component: DndNode,
    name: 'automated-activity',
    width: 150,
    height: 40,
    label: (
      <>
        <img src={require('./img/automated.png')} alt="icon" />
        自动活动
      </>
    ),
  },
  {
    component: DndNode,
    name: 'human-activity',
    width: 150,
    height: 40,
    label: (
      <>
        <img src={require('./img/artificial.png')} alt="icon" />
        人工活动
      </>
    ),
  },
  {
    component: DndNode,
    name: 'gateway',
    width: 150,
    height: 40,
    label: (
      <>
        <img src={require('./img/gateway.png')} alt="icon" />
        网关
      </>
    ),
  },
  {
    component: DndNode,
    name: 'flow-start',
    width: 150,
    height: 40,
    label: (
      <>
        <img src={require('./img/start.png')} alt="icon" />
        流程开始
      </>
    ),
  },
  {
    component: DndNode,
    name: 'flow-end',
    width: 150,
    height: 40,
    label: (
      <>
        <img src={require('./img/end.png')} alt="icon" />
        流程结束
      </>
    ),
  },
  {
    component: DndNode,
    name: 'flow-event',
    width: 150,
    height: 40,
    label: (
      <>
        <img src={require('./img/event.png')} alt="icon" />
        事件
      </>
    ),
  },
];
