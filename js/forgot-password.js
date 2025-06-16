import{F as o,u as n,j as e,I as l,R as m,d as t,m as c,h as d,B as x,N as g}from"./index.js";const h=t(c.h2)`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
`,p=t.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.5;
`,u=t(o.Item)`
  margin-bottom: 24px;

  .ant-input-affix-wrapper {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;

    &:hover,
    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }

    input {
      font-size: 1rem;
    }

    .anticon {
      color: #9ca3af;
    }
  }
`,f=t(x)`
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  }
`,b=t(g)`
  color: #4f46e5;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #4338ca;
  }
`,y=()=>{const[r]=o.useForm(),s=n(),a=async i=>{await d(i),s("/login")};return e.jsxs(e.Fragment,{children:[e.jsx(h,{initial:{y:-20,opacity:0},animate:{y:0,opacity:1},transition:{duration:.5},children:"找回密码"}),e.jsx(p,{children:"请输入您的注册邮箱，我们将向您发送重置密码的链接。"}),e.jsxs(o,{form:r,name:"forgotPasswordForm",onFinish:a,layout:"vertical",size:"large",children:[e.jsx(u,{name:"email",rules:[{required:!0,message:"请输入您的邮箱！"},{type:"email",message:"请输入有效的邮箱地址！"}],children:e.jsx(l,{prefix:e.jsx(m,{}),placeholder:"请输入邮箱"})}),e.jsx(o.Item,{children:e.jsx(f,{type:"primary",htmlType:"submit",block:!0,className:"bg-indigo-600 hover:bg-indigo-700",children:"发送重置链接"})}),e.jsxs("div",{className:"text-center text-gray-600",children:["记起密码了？",e.jsx(b,{to:"/login",className:"ml-1",children:"返回登录"})]})]})]})};export{y as default};
