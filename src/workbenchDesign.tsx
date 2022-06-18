import ReactDOM from 'react-dom';
import React, { useEffect, useState, FunctionComponent, useRef } from 'react';
import Generator, { defaultSettings, defaultCommonSettings, defaultGlobalSettings } from "fr-generator";
import { Input, Button, Tabs, message } from "antd";
import { saveForm, getAppList, getChartTree } from './api/workbench';
import './workbenchDesign.less'
import TodoButton from './component/widgets/todoButton';
import CommonApp from './component/widgets/commonApp';
import ChartModule from './component/widgets/chartModule';
import ChartModuleOptions from './component/widgets/chartModule/options';
import 'antd/dist/antd.less';


const defaultValue = {
    type: "object",
    properties: {},
};



const WorkbenchDesign: FunctionComponent = (props) => {
    const [appList, setAppList] = useState([]);
    const ref = useRef();

    useEffect(() => {
        loadAppList()
    },[])

    const { closeDrawer, values, id, refresh } = props;
   
    let modules = [{
        title: "工作台组件",
        widgets: [
            {
                text: "我的代办",
                name: "todoButton",
                schema: {
                    title: "",
                    type: "array",
                    widget: "todoButton"
                }
            },
            {
                text: "常用应用",
                name: "commonApp",
                schema: {
                    title: "",
                    type: "object",
                    widget: "commonApp",
                    label: "常用应用",
                },
                
            },
            {
                text: "图表看板",
                name: "chart ",
                schema: {
                    title: "",
                    type: "array",
                    widget: "chartModule",
                },
                setting: {
                    title: {},
                    width: {},
                    chartId: {
                        title: "添加图表",
                        type: 'string',
                        widget: 'chartModuleOptions'
                    }
                }
            }
        ]
    }]

    const loadAppList = () => {
        getAppList({wf_num:'D_S001_J020',wf_gridnum:'V_S001_G024'}).then(res => {
            const { data,status } = res
            if (status === 200) {
                const newList = data.rows.map(item => {
                    return { key: item.WF_Appid, title: item.AppName }
                })
                setAppList(newList)
            }
        })
    }

    const handleSave = () => {
        const dyForm = ref.current.getValue();
        saveForm({
            id,
            appId: 'bpm',
            workbenchConfigJson: JSON.stringify(dyForm),
        }).then(res => {
            const { data} = res;
            if (data.state) {
                message.success("保存成功!");
            }
            refresh()
            closeDrawer()
        });
    };

    const handleClose = () => {
        props.closeDrawer()
    }

    return (
        <div className="dynamic-wrapper" >           
            <Generator 
                ref={ref}
                defaultValue={values}
                widgets={{
                    todoButton:TodoButton ,
                    commonApp: (options) => <CommonApp parentRef={ref} options={options} appList={appList} />,
                    chartModule: (options) => <ChartModule parentRef={ref} options={options} />,
                    chartModuleOptions: ChartModuleOptions
                }}
                settings={modules}
                // commonSettings={defaultCommonSettings}
                globalSettings={{}}
                extraButtons={[]}
                hideId
            /> 
            <div className="dynamic-form-footer">
                <Button className="btn-save" type="primary" onClick={handleSave}>保存</Button>
                <Button className="btn-close" onClick={handleClose}>关闭自定义工作台</Button>
            </div>
        </div>
    )
};

export default WorkbenchDesign;

// ReactDOM.render(<WorkbenchDesign />, document.getElementById('workbenchDesign'));
