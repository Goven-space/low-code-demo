import React, { useRef, useState, useEffect } from 'react';
import Content from '../../../pages/content';
import './index.less'

const ChartModule = (props) => {
    const [chartId, setChartId] = useState('');

    const wrapper = useRef();
    const ctrlWrapper = useRef();
    const mainWrapper = useRef();
    const schema = useRef()
    const mainWrapperwidth = useRef();
    const $id = useRef()

    const { parentRef, options } = props;

    useEffect(() => {

    }, [])

    useEffect(() => {
        options && (wrapper.current.style.height = options.schema.height || '')
    }, [options?.schema.height])

    useEffect(() => {
        let newId = ''
        if (options) {
            newId = options.schema.chartId
            setChartId(newId)
        }

        //展示
        options.addons && (ctrlWrapper.current.style.display = 'none')

        // 设计
        if (parentRef) {
            if (newId === 'none') {
                const schemaValue = parentRef.current.getValue()
                const { [$id.current]: _, ...properties } = schemaValue.properties
                schemaValue.properties = properties
                parentRef.current.setValue(schemaValue)
            }
            mainWrapper.current = document.querySelector('.field-wrapper')
            mainWrapperwidth.current = mainWrapper.current?.querySelector('.fr-content').clientWidth - 2
            $id.current = options.schema.$id.replace('#/', '')
        }

    }, [options.schema.chartId])



    // 鼠标按下时开启尺寸修改
    const down = (event) => {
        const xDiff = event.nativeEvent.clientX;
        const yDiff = event.nativeEvent.clientY;
        const width = wrapper.current.clientWidth;
        const height = wrapper.current.clientHeight;
        let newWidth;
        mainWrapper.current.onmousemove = (event) => {
            schema.current = parentRef.current.getValue()
            //拖拉改变宽度
            newWidth = event.clientX - xDiff + width;
            newWidth = newWidth < 300 ? '300' : newWidth > mainWrapperwidth.current ? mainWrapperwidth.current : newWidth;
            let widthPre = Number(newWidth / mainWrapperwidth.current * 100).toFixed(0) + '%'
            schema.current.properties[$id.current].width = widthPre
            // 拖拉改变高度
            let newHeight = event.clientY - yDiff + height;
            newHeight = newHeight < 550 ? '550px' : newHeight + 'px';
            wrapper.current.style.height = newHeight;
            schema.current.properties[$id.current].height = newHeight
            parentRef.current.setValue(schema.current)
        }
        // 鼠标松开时结束尺寸修改
        const up = () => {
            document.onmouseup = null
            if (mainWrapper.current) {
                mainWrapper.current.onmousemove = null
                mainWrapper.current.onmouseleave = null
            }
        }
        mainWrapper.current.onmouseleave = up
        document.onmouseup = up
    }

    return (
        <div className="chart-wrapper" ref={wrapper} >
            <div className="container">
                {
                    chartId && chartId !== 'none' &&
                    <Content pageId={chartId} mode="chart" />
                }
                <div className="chart-wrapper-ctrl" ref={ctrlWrapper} onMouseDown={down} onClick={(e) => { e.preventDefault() }}>
                    <div></div>
                </div>
            </div>
        </div>
    );
}

export default ChartModule;