import { FC, useEffect } from 'react';
import { init } from '@alilc/lowcode-engine';
import registerPlugins from '../universal/plugin';

const Design: FC = () => {
    useEffect(() => {
        const preference = new Map();
        preference.set('DataSourcePane', {
          importPlugins: [],
          dataSourceTypes: [
            {
              type: 'axios'
            }
          ]
        });
    
        (async function main() {
          await registerPlugins();
    
          init(
            document.getElementById('lce-container')!,
            {
              // designMode: 'live',
              // locale: 'zh-CN',
              enableCondition: true,
              enableCanvasLock: true,
              // 默认绑定变量
              supportVariableGlobally: true,
              // simulatorUrl 在当 engine-core.js 同一个父路径下时是不需要配置的！！！
              // 这里因为用的是 alifd cdn，在不同 npm 包，engine-core.js 和 react-simulator-renderer.js 是不同路径
              simulatorUrl: [
                'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@beta/dist/css/react-simulator-renderer.css',
                'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@beta/dist/js/react-simulator-renderer.js',
              ],
            },
            preference,
          );
        })();
      }, []);
    
      return <div className="lce-container"></div>;
}

export default Design