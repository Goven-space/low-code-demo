import { FunctionComponent, useEffect } from 'react';
import MonacoEditor from '@alilc/lowcode-plugin-base-monaco-editor';

const Editor: FunctionComponent = (props: any) => {
    
    const handleChange = (value: string) => {
        const val: any = props.value || {
            type: "JSFunction"
        };
        val.value = value
        props.onChange(val)
    }

    return (
        <MonacoEditor value={props.value?.value} language="javascript" onChange={handleChange} />
    )
}

export default Editor