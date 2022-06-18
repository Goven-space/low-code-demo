const json = {
  "input | textarea | number | checkbox | switch | slider": { //控件类型,不在实际数据里,只是表单类型,下面的才是实际数据, checkbox: 单个复选框 slider: 滑动条
    "type": "schema类型",
    "properties": { //表单项数据, 下面的每一个属性等于一个表单项,属性名默认是随机生成的,也可以在页面上配置表单项ID修改属性名
      "input_3NJ_3h": { //表单项ID,等同于name
        "title": "表单label",
        "type": "表单值类型",
        "props": {// 表单项的特定属性
          "allowClear": "是否带清除按钮",
          "addonBefore": "前置标签",
          "addonAfter": "后置标签",
          "prefix": "前缀",
          "suffix": "后缀"
        },
        "description": "表单label后面的说明文字",
        "default": "默认值",
        "required": "是否必填  Boolean类型",
        "placeholder": "占位符",
        "bind": "绑定字段",
        "min": "最小值",
        "max": "最大值",
        "disabled": "是否禁用  Boolean类型",
        "readOnly": "是否只读  Boolean类型",
        "hidden": "是否隐藏表单项  Boolean类型",
        "readOnlyWidget": "只读组件",
        "labelWidth": "表单label的宽度",
        "minLength": "值的最小长度",
        "maxLength": "值的最大长度",
        "pattern": "正则校验"
      }
    },
    "labelWidth": "全局label宽度, 表单项没有设置label时,以这个为准",
    "displayType": "全局标签展示模式"
  },
  "date | dateRange": {//日期选择 和 日期范围
    //其他属性与input相同,
    "type": "string | range", // 日期范围: range
    "format": "日期的格式 dateTime: 日期时间; date: 日期; time: 时间;"
  },
  "select | multiSelect | radio | checkboxes": {//multiSelect: 多选下拉菜单,checkboxes: 多个复选框
    //其他属性与input相同
    "enum" : "下拉菜单的value  Array类型",
    "enumNames": "下拉菜单的label  Array类型"
  },
}
