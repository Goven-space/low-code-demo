import MonacoEditor from '@alilc/lowcode-plugin-base-monaco-editor';

const GatewayXmlCode = ({value}: any) => {

    return (
        <MonacoEditor height={400} style={{marginBottom: 15}} value={value} language="xml"/*  onChange={handleChange} */ />
    )
}

export default GatewayXmlCode