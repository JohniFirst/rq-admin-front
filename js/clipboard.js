import{r as l,j as r,d as t}from"./index.js";const i={clipboard:{prefix:"clipboard prefix",suffix:"clipboard suffix"}};Object.freeze(i);function a(o={prefix:i.clipboard.prefix,suffix:i.clipboard.suffix}){const[e,p]=l.useState(!1);return{copyToClipboard:s=>{const c=`${o.prefix||""}${s}${o.suffix||""}`;navigator.clipboard.writeText(c).then(()=>{p(!0),setTimeout(()=>p(!1),3e3)}).catch(d=>{console.error("Failed to copy: ",d)})},isCopied:e}}const n=t.div`
  width: 100%;
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`,x=t.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;function b(){const{copyToClipboard:o,isCopied:e}=a();return r.jsxs(n,{children:[r.jsx("p",{children:"Click the button below to copy the following text to your clipboard:"}),r.jsx("p",{className:"mx-[24px]",style:{color:"red"},children:'"This is the text you will copy!"'}),r.jsx(x,{onClick:()=>o("This is the text you will copy!"),children:e?"Copied!":"Copy"})]})}export{b as default};
