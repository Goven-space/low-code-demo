import './index.less';
import { copyRight } from '../api/login';
import { Space } from 'antd';
import { useEffect, useState } from 'react';

const Footer = () => {
  let timestamp = Date.parse(new Date());
  let date = new Date(timestamp);
  //获取年份
  let thieYear = date.getFullYear();
  const [footer, setFooter] = useState('');
  const [footUrl, setFooterUrl] = useState('');

  useEffect(() => {
    getCopyright();
  }, []);

  const getCopyright = () => {
    copyRight().then((res) => {
      setFooter(res.data.footer);
      setFooterUrl(res.data.footUrl);
    });
  };

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          minHeight: 40,
          marginLeft: 0,
          overflow: 'hidden',
          fontSize: '14px',
          fontWeight: 500,
          color:'#999',
        }}
      >
        <Space>
          <div>Copyright © {thieYear}</div>
          <div>{footer}</div>
          <div>{footUrl}</div>
        </Space>
      </div>
    </div>
  );
};

export default Footer;
