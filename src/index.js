import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import { Provider} from 'jotai'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Inspector, InspectParams } from 'react-dev-inspector'

const root = ReactDOM.createRoot(document.getElementById('root'));
const isDev = process.env.NODE_ENV === 'development'
root.render(
  <React.StrictMode>
    {isDev && <Inspector
     keys={['control', 'shift', 'z']}
     disableLaunchEditor={false}
    //  onClickElement={({ codeInfo }) => {
    //    if (!codeInfo?.absolutePath) return
    //    const { absolutePath, lineNumber, columnNumber } = codeInfo
    //    // you can change the url protocol if you are using in Web IDE
    //    window.open(`vscode://file/${absolutePath}:${lineNumber}:${columnNumber}`)
    //  }}
    />}
      <Provider>
          <BrowserRouter>
    <App />

          </BrowserRouter>
      </Provider>

  </React.StrictMode>
);

