import { FunctionComponent, useEffect, useState,useRef } from 'react';
import { Loading } from '@alifd/next';
import { Button, Spin } from 'antd'
import { buildComponents, assetBundle, AssetLevel, AssetLoader } from '@alilc/lowcode-utils';

import ReactRenderer from '@alilc/lowcode-react-renderer';
import { injectComponents } from '@alilc/lowcode-plugin-inject';
import { getPageSchema } from '../universal/utils';
import { createAxiosFetchHandler } from '../plugins/requestAxios';
import { filterPackages } from '@alilc/lowcode-plugin-inject';
import './content.less';
import assets from "../../public/assets-form.json"

const Content: FunctionComponent = (props: any) => {
  const [data, setData] = useState({
    schema: undefined,
    components: undefined,
  });

  async function init() {
    const data = await getPageSchema(1, props.pageId, props.mode,"form");
    const packages = await filterPackages(assets.packages);
    const projectSchema = data || {};
    const { componentsMap: componentsMapArray, componentsTree } = projectSchema;
    const componentsMap: any = {};
    if(componentsMapArray && componentsMapArray.length){
      componentsMapArray.forEach((component: any) => {
        componentsMap[component.componentName] = component;
      });
    } else {
      assets.packages.forEach((component: any) => {
        componentsMap[component.componentName] = component;
      })
    }
    let schema = {};
    if(componentsTree && componentsTree[0]){
      schema = componentsTree[0];
    } else {
      schema = window.schemaJson
    }
    // 

    const libraryMap:any = {};
    const libraryAsset: any = [];
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });

    const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];
    // TODO asset may cause pollution
    const assetLoader = new AssetLoader();
    await assetLoader.load(libraryAsset);
    const components = await injectComponents(buildComponents(libraryMap, componentsMap));
    if(window.antd){
      setData({
        schema,
        components,
      });
    }else{
      init()
    }
  }

  useEffect(() => {
      init();
  }, [props.pageId]);

  const onCompGetRef = (schema: any, ref: any) => {
    // console.log('=====111');
    // console.log(schema);
    // console.dir(ref);
  }

  const onCompGetCtx = (schema: any, ctx: any) => {
  }

  return (
    <div className="lowcode-plugin-sample-preview">
      {
        !data.schema || !data.components ? 
        <div className="lowcode-loading">
          <Loading color="#0fb3b4" />
        </div> : 
        <ReactRenderer
          className="lowcode-plugin-sample-preview-content"
          key={props.pageId}
          schema={data?.schema}
          components={data?.components}
          onCompGetRef={onCompGetRef}
          onCompGetCtx={onCompGetCtx}
          appHelper={{
            requestHandlersMap: {
              axios: createAxiosFetchHandler(),
            },
          }}
        />
      }
    </div>
  );
};

export default Content;
