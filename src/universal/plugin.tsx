import React from 'react';
import {
  ILowCodePluginContext,
  plugins,
  skeleton,
  project,
  setters,
} from '@alilc/lowcode-engine';
import AliLowCodeEngineExt from '@alilc/lowcode-engine-ext';
import { Button } from '@alifd/next';
import UndoRedoPlugin from '@alilc/lowcode-plugin-undo-redo';
import ComponentsPane from '@alilc/lowcode-plugin-components-pane';
import ZhEnPlugin from '@alilc/lowcode-plugin-zh-en';
import CodeGenPlugin from '@alilc/lowcode-plugin-code-generator';
import DataSourcePanePlugin from '@alilc/lowcode-plugin-datasource-pane';
import SchemaPlugin from '@alilc/lowcode-plugin-schema';
import CodeEditor from "@alilc/lowcode-plugin-code-editor";
import ManualPlugin from "@alilc/lowcode-plugin-manual";
import Inject, { injectAssets } from '@alilc/lowcode-plugin-inject';
import SimulatorResizer from '@alilc/lowcode-plugin-simulator-select';
import { Button, Breadcrumb } from '@alifd/next';
import AxiosDataSource from '../component/AxiosDataSource';
import VersionManager from '../component/VersionManager';
import publishVersion from '../component/publishVersion';
import { getCookie } from '../tool';

// 注册到引擎
import TitleSetter from '@alilc/lowcode-setter-title';
import BehaviorSetter from '../setters/behavior-setter';
import CustomSetter from '../setters/custom-setter';
import Logo from '../sample-plugins/logo';

import {
  loadIncrementalAssets,
  getPageSchema,
  saveSchema,
  resetSchema,
  preview
} from './utils';
import assets from '../../public/assets.json';
import schema from '../scenarios/basic-antd/schema.json';

export default async function registerPlugins() {
  // await plugins.register(ManualPlugin);

  await plugins.register(Inject);

  // plugin API 见 https://lowcode-engine.cn/docV2/ibh9fh
  SchemaPlugin.pluginName = 'SchemaPlugin';
  await plugins.register(SchemaPlugin);

  // SimulatorResizer.pluginName = 'SimulatorResizer';
  // plugins.register(SimulatorResizer);

  const editorInit = (ctx: ILowCodePluginContext) => {
    return {
      name: 'editor-init',
      async init() {
        // 修改面包屑组件的分隔符属性setter
        // const assets = await (
        //   await fetch(
        //     `https://alifd.alicdn.com/npm/@alilc/lowcode-materials/build/lowcode/assets-prod.json`
        //   )
        // ).json();
        // 设置物料描述
        const { material, project } = ctx;

        material.setAssets(await injectAssets(assets));

        const schema = await getPageSchema(0);
        // 加载 schema
        project.openDocument(schema);
      },
    };
  }
  editorInit.pluginName = 'editorInit';
  await plugins.register(editorInit);

  const builtinPluginRegistry = (ctx: ILowCodePluginContext) => {
    return {
      name: 'builtin-plugin-registry',
      async init() {
        const { skeleton } = ctx;
        // 注册 logo 面板
        skeleton.add({
          area: 'topArea',
          type: 'Widget',
          name: 'logo',
          content: Logo,
          contentProps: {
            logo: require('../assets/logo.png'),
            href: 'https://lowcode-engine.cn',
          },
          props: {
            align: 'left',
          },
        });

        // 面包屑
        skeleton.add({
          area: 'topArea',
          type: 'Widget',
          name: 'Breadcrumb',
          content: (
            <>
              {getCookie('categoryName') === 'undefined' ? (
                <Breadcrumb>
                  <Breadcrumb.Item style={{ color: 'black', fontSize: '16px' }}>
                    {unescape(getCookie('appName'))}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item style={{ color: '#86888d', fontSize: '16px' }}>
                    {getCookie('pageName')}
                  </Breadcrumb.Item>
                </Breadcrumb>
              ) : (
                  <Breadcrumb>
                    <Breadcrumb.Item style={{ color: 'black', fontSize: '16px' }}>
                      {unescape(getCookie('appName'))}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item
                      style={{ color: 'black', fontSize: '16px' }}
                      className="categoryName_less"
                    >
                      {getCookie('categoryName') === 'undefined'
                        ? undefined
                        : getCookie('categoryName')}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item style={{ color: '#86888d', fontSize: '16px' }}>
                      {getCookie('pageName')}
                    </Breadcrumb.Item>
                  </Breadcrumb>
                )}
            </>
          ),
          props: {
            align: 'left',
          },
        });

        // 注册组件面板
        const componentsPane = skeleton.add({
          area: 'leftArea',
          type: 'PanelDock',
          name: 'componentsPane',
          content: ComponentsPane,
          contentProps: {},
          props: {
            align: 'top',
            icon: 'zujianku',
            description: '组件库',
          },
        });
        componentsPane?.disable?.();
        project.onSimulatorRendererReady(() => {
          componentsPane?.enable?.();
        })
      },
    };
  }
  builtinPluginRegistry.pluginName = 'builtinPluginRegistry';
  await plugins.register(builtinPluginRegistry);

  // 设置内置 setter 和事件绑定、插件绑定面板
  const setterRegistry = (ctx: ILowCodePluginContext) => {
    const { setterMap, pluginMap } = AliLowCodeEngineExt;
    return {
      name: 'ext-setters-registry',
      async init() {
        const { setters, skeleton } = ctx;
        // 注册setterMap
        setters.registerSetter(setterMap);
        // 注册插件
        // 注册事件绑定面板
        skeleton.add({
          area: 'centerArea',
          type: 'Widget',
          content: pluginMap.EventBindDialog,
          name: 'eventBindDialog',
          props: {},
        });

        // 注册变量绑定面板
        skeleton.add({
          area: 'centerArea',
          type: 'Widget',
          content: pluginMap.VariableBindDialog,
          name: 'variableBindDialog',
          props: {},
        });
      },
    };
  }
  setterRegistry.pluginName = 'setterRegistry';
  await plugins.register(setterRegistry);

  // 注册回退/前进
  // await plugins.register(UndoRedoPlugin);

  // 注册中英文切换
  await plugins.register(ZhEnPlugin);

  const loadAssetsSample = (ctx: ILowCodePluginContext) => {
    return {
      name: 'loadAssetsSample',
      async init() {
        const { skeleton } = ctx;

        // skeleton.add({
        //   name: 'loadAssetsSample',
        //   area: 'topArea',
        //   type: 'Widget',
        //   props: {
        //     align: 'right',
        //     width: 80,
        //   },
        //   content: (
        //     <Button onClick={loadIncrementalAssets}>
        //       异步加载资源
        //     </Button>
        //   ),
        // });
      },
    };
  };
  loadAssetsSample.pluginName = 'loadAssetsSample';
  await plugins.register(loadAssetsSample);

  // 注册保存面板
  const saveSample = (ctx: ILowCodePluginContext) => {
    return {
      name: 'saveSample',
      async init() {
        const { skeleton, hotkey } = ctx;

        skeleton.add({
          name: 'saveSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button onClick={ saveSchema}>
              保存
            </Button>
          ),
        });
        skeleton.add({
          name: 'resetSchema',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button onClick={ resetSchema}>
              重置页面
            </Button>
          ),
        });
        skeleton.add({
          name: 'history',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: publishVersion,
          index: 1,
        });
        hotkey.bind('command+s', (e) => {
          e.preventDefault();
          saveSchema()
        });
      },
    };
  }

  const dataSourceSample = (ctx: ILowCodePluginContext) => {
    return {
      name: 'dataSourceSample',
      dep: [],
      // 插件对外暴露的数据和方法
      exports: function exports() {
        return {};
      },
      async init() {
        const { skeleton, hotkey } = ctx;
        const item = skeleton.add({
          name: 'dataSourceSample',
          area: 'leftArea',
          type: 'PanelDock',
          props: {
            icon: 'shujuyuan',
            description: '数据源',
          },
          panelProps: {
            width: '800px', // title: '源码面板',
          },
          content: AxiosDataSource,
        });
        item?.disable?.();
        ctx.project.onSimulatorRendererReady(function () {
          item.enable();
        });
      },
    };
  };

  const versionManager = (ctx: ILowCodePluginContext) => {
    return {
      name: 'versionManager',
      async init() {
        const { skeleton, hotkey } = ctx;

        const item = skeleton.add({
          name: 'versionManager',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: VersionManager,
        });
        // item?.disable?.();
        // ctx.project.onSimulatorRendererReady(function () {
        //   item.enable();
        // });
      },
    };
  };

  saveSample.pluginName = 'saveSample';
  await plugins.register(saveSample);

  DataSourcePanePlugin.pluginName = 'DataSourcePane';
  await plugins.register(DataSourcePanePlugin);

  dataSourceSample.pluginName = 'dataSourceSample';
  await plugins.register(dataSourceSample);

  versionManager.pluginName = 'versionManager';
  await plugins.register(versionManager);

  CodeEditor.pluginName = 'CodeEditor';
  await plugins.register(CodeEditor);

  // 注册出码插件
  // CodeGenPlugin.pluginName = 'CodeGenPlugin';
  // await plugins.register(CodeGenPlugin);

  const previewSample = (ctx: ILowCodePluginContext) => {
    return {
      name: 'previewSample',
      async init() {
        const { skeleton } = ctx;
        skeleton.add({
          name: 'previewSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button type="primary" onClick={ preview}>
              预览
            </Button>
          ),
        });
      },
    };
  };
  previewSample.pluginName = 'previewSample';
  await plugins.register(previewSample);

  const customSetter = (ctx: ILowCodePluginContext) => {
    return {
      name: '___registerCustomSetter___',
      async init() {
        const { setters } = ctx;

        setters.registerSetter('TitleSetter', TitleSetter);
        setters.registerSetter('BehaviorSetter', BehaviorSetter);
        setters.registerSetter('CustomSetter', CustomSetter);
      },
    };
  }
  customSetter.pluginName = 'customSetter';
  await plugins.register(customSetter);
};
