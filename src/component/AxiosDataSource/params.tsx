import { AutoComplete, Button, Input, Select } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { project } from '@alilc/lowcode-engine';
import _ from 'lodash';

interface DataType {
    name: string;
    value: string;
    type: string;
}
interface OptsType {
    label: string;
    value: string;
}[]

const Params: FunctionComponent = (props: any) => {
    const [data, setData] = useState<any>([])
    
    const [options, setOptions] = useState<any>([]);

    useEffect(() => {
        console.log(props.value);
        if(props.value){
            props.value.forEach((item:any) => {
                if(_.isObject(item.value)){
                    item.value = item.value.value
                    item.type = 'variables'
                }
            })
        }
        console.log(props.value);
        setData(props.value || [])
    }, [props.value])

    const handleValueFocus = () => {
        const schema = project.exportSchema();
        const { componentsTree } = schema;
        const state = componentsTree[0].state;
        const methods = componentsTree[0].methods;
        const opts: OptsType[] = [];
        for(let k in state){
            opts.push({label: k, value: `this.state.${k}`})
        }
        for(let k in methods){
            opts.push({label: k, value: `this.${k}()`})
        }
        setOptions(opts)
    }

    const handleInputChange = (e: any, field: string, index: number) => {
        const dd = [...data];
        dd[index][field] = e.target.value;
        props.onChange(dd)
        setData(dd)
    }
    
    const handleSelectChange = (value: any, field: string, index: number) => {
        const dd = [...data]
        dd[index][field] = value;
        props.onChange(dd)
        setData(dd)
    }

    const handleAdd = () => {
        const dd = [...data];
        dd.push({
            name: "",
            value: "",
            type: 'value'
        })
        setData(dd)
    }

    const handleSearch = (input: string, option: any) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;

    const haneldDel = (index: number) => {
        const dd = data.filter((o: any, i: number) => i !== index)
        props.onChange(dd)
        setData(dd)

    }

    return (
        <div className="params-list">
            {
                data.map((item: any, index: number) => {
                    return (
                        <div className="params-item">
                            <Input 
                                className="params-name" 
                                value={item.name} 
                                placeholder="参数名" 
                                onChange={(e) => handleInputChange(e, 'name', index)} 
                            />
                            <span className="params-split">:</span>
                            {
                                item.type === 'variables' ? 
                                <AutoComplete 
                                    className="params-value" 
                                    value={item.value}
                                    options={options}
                                    placeholder="参数值"
                                    showSearch
                                    filterOption={handleSearch}
                                    onFocus={handleValueFocus}
                                    onChange={value => handleSelectChange(value, 'value', index)} 
                                /> :
                                <Input 
                                    className="params-value" 
                                    value={item.value} 
                                    placeholder="参数值" 
                                    onChange={(e) => handleInputChange(e, 'value', index)}
                                />
                            }
                            <Select 
                                className="params-type"
                                defaultValue="value" 
                                value={item.type}
                                onChange={value => handleSelectChange(value, 'type', index)} 
                            >
                                <Select.Option value="value">值</Select.Option>
                                <Select.Option value="variables">变量</Select.Option>
                            </Select>
                            <Button className="params-delete" icon={<DeleteOutlined />} onClick={() => haneldDel(index)}></Button>
                        </div>
                    )
                })
            }
            <Button icon={<PlusOutlined />} onClick={handleAdd}>添加</Button>
        </div>
    )
}

export default Params