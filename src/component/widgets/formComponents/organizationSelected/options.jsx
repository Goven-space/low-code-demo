import React, {useState} from 'react';
import { Radio } from 'antd';

const OrganizationOptions = (props) => {
    const [isMultiple, SetIsMultiple] = useState(false)

    const onChange = (e) => {
        SetIsMultiple(e.target.value)
        props.onChange(e.target.value)
    }

    return (
    <Radio.Group onChange={onChange} value={isMultiple } >
        <Radio value={true}>是</Radio>
        <Radio value={false}>否</Radio>
    </Radio.Group>
    );
}

export default OrganizationOptions;