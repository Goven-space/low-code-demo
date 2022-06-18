import ReactDOM from 'react-dom';
import React, { useEffect, useState, FunctionComponent, useRef } from 'react';
import Generator, { defaultSettings, defaultCommonSettings, defaultGlobalSettings } from "fr-generator";
import { Tabs, message } from "antd";
import PersonnelSelected from './component/widgets/formComponents/personnelSelected';
import OrganizationSelected from './component/widgets/formComponents/organizationSelected'
import FormProperties from './component/widgets/formComponents/formProperties';
import OrganizationOptions from './component/widgets/formComponents/organizationSelected/options';
import FormApporval from './component/widgets/formComponents/formApproval'
import { saveFromRender, getFromRender, getFormConfig } from './api/bpm';
import { getUrlSearch } from './tool';
import './formRenderDesign.less'

const defaultValue = {
    type: "object",
    properties: {},
};

const modules: any = defaultSettings.filter(o => o.title === "基础组件");

modules[0].widgets = modules[0].widgets.filter((o: any) => o.name !== "html");
modules.push({
    title: "高级组件",
    widgets: [
        {
            text: "人员选择",
            name: "personnelSelected",
            schema: {
                title: "人员选择",
                type: "array",
                widget: "personnelSelected",
            },
            setting: {
                bind: {},min: {}, max: {},placeholder:{},readOnlyWidget:{}
            }
        },
        {
            text: "组织选择",
            name: "organizationSelected",
            schema: {
                title: "组织选择",
                type: "array",
                widget: "organizationSelected"
            },
            setting: {
                bind: {},min: {},max:{},readOnlyWidget:{},
                isMultiple: {
                    title: '是否多选',
                    type: 'boolean',
                    widget: 'organizationOptions'
                }
            }
        },
        {
            text: "审批组件",
            name: "formApporval",
            schema: {
                title: "",
                type: "array",
                widget: "formApporval"
            },
            setting:{}
        }
    ]
});

const FormRenderDesign: FunctionComponent = (props: any) => {
    const [id, setId] = useState('')
    const [formValues, setFormValues] = useState(defaultValue);
    const [formConfig, setFormConfig] = useState({})

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const formId = getUrlSearch('id');
        setId(formId);
        loadFormRender(formId)      
    },[])

    const loadFormRender = (formId) => {
        getFromRender(formId).then((res) => {
            const { status, data } = res;
            if (status === 200) {
                data?.data?.formConfigJson &&
                    setFormValues(JSON.parse(data.data.formConfigJson));
                data.data?.formNumber && loadFormConfig(data.data.formNumber)
            }
        });
    };

    const loadFormConfig = (formNumber) => {
        getFormConfig({ formNumber }).then(res => {
            const { data, meta } = res.data;
            if (meta.success) {
                setFormConfig(data)
            }
        })
    }

    const handleSave = () => {
        const dyForm = ref.current.getValue();
        saveFromRender({ orUnId: id, formConfigJson: JSON.stringify(dyForm) }).then(res => {
            const { status, data } = res;
            if (status === 200) {
                message.success(data.msg)
            }
        })
    }

    return (
        <div className="form-render-wrap">
            <div></div>
            <Tabs defaultActiveKey="formRenderDesign" centered>
                <Tabs.TabPane tab="基本属性" key="basicProperty">
                    <FormProperties id={id} formConfig={formConfig}  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="表单设计" key="formRenderDesign" style={{minHeight:'90vh'}}>
                    <Generator
                        ref={ref}
                        defaultValue={formValues}
                        settings={modules}
                        widgets={{
                            personnelSelected: PersonnelSelected,
                            organizationSelected: OrganizationSelected,
                            organizationOptions: OrganizationOptions,
                            formApporval: FormApporval
                        }}
                        // settings={modules}
                        // commonSettings={defaultCommonSettings}
                        extraButtons={[{text:'保存',onClick:handleSave}]} 
                    />
                </Tabs.TabPane>
                
            </Tabs>
            
        </div>
    )
};


ReactDOM.render(<FormRenderDesign />, document.getElementById('formRenderDesign'));
