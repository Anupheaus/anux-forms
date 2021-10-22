import ReactGlobal from 'react';
import ReactDOMGlobal from 'react-dom';

declare global {
  export const React: typeof ReactGlobal;
  export const ReactDOM: typeof ReactDOMGlobal;
}