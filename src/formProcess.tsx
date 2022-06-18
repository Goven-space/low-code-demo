import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import "../src/pages/content.less"
import Content from './pages/formContent';
import { getUrlSearch  } from './tool'

let id = getUrlSearch("id")

const SamplePreview = () => {
    return (
      <>
      <Content pageId={id}/>
      </>
        
    );
};

ReactDOM.render(<SamplePreview />, document.getElementById('formProcess'));
