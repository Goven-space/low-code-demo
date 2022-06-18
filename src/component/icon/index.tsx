import * as allIcons from '@ant-design/icons';
import { createElement } from 'react';

const Icon = (props: any) => {
    const NewIcon = allIcons[props.type]
    if (NewIcon) {
        return createElement(NewIcon);
    }
    return <span></span>
}

export default Icon