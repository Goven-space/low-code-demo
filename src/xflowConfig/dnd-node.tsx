import React from 'react'
import './dnd-node.less'

export const DndNode = (props: any) => {
  const { size = { width: 150, height: 40 }, data } = props
  const { width, height } = size
  const { label, stroke, fill, fontFill, fontSize } = data

  return (
    <div
      className="container"
      style={{
        width,
        height,
        borderColor: stroke,
        backgroundColor: fill,
        color: fontFill,
        fontSize,
      }}
    >
      {label}
    </div>
  )
}