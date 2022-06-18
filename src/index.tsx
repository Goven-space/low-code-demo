import React, { } from 'react';
import ReactDOM from "react-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from './App';
import './universal/global.scss';

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/" element={<Navigate to="/design" />}></Route>
      </Routes>
    </BrowserRouter>
  </ConfigProvider>,
  document.getElementById("root")
);
