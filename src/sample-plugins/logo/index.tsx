import React from 'react';
import './index.scss';
import { PluginProps } from '@alilc/lowcode-types';

export interface IProps {
  logo?: string;
  href?: string;
}

const Logo: React.FC<IProps & PluginProps> = (props): React.ReactElement => {
  return (
    <div className="lowcode-plugin-logo">
      <div className="logo" />
    </div>
  );
};

export default Logo;
