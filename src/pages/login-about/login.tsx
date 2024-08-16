// import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox } from 'antd'
import { useNavigate } from 'react-router-dom'
// import JSEncrypt from "jsencrypt";
import login from './login.module.css'
import VerificationCodeInput from '@/components/base/verification-code-input'
import { handleLogin } from '@/api/system-api'
// import { useCustomRoutes } from "@/routes";
// import { dynamicRoutes } from "@/routes/dynamic-routes";

const LoginForm = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  // const { routes, addRoutes } = useCustomRoutes();

  // useEffect(() => {
  //   // 登录成功后的处理逻辑
  //   if (/* 假设登录成功 */) {
  //     navigate('/dashboard'); // 跳转到主页
  //   }
  // }, []);

  const handleSubmit = async (values: LoginFormValues) => {
    // e.preventDefault();
    // 对密码进行非对称加密
    // const encryptedPassword = await encryptPassword(values.password);
    // 这里可以添加登录逻辑，例如发送请求到后端
    // console.log("Encrypted Password:", encryptedPassword);
    // addRoutes(dynamicRoutes);

    await handleLogin(values)

    navigate('/dashboard')
  }

  // const encryptPassword = async (password: string) => {};

  return (
    <section className="w-screen h-screen overflow-hidden">
      <video id="video-background" autoPlay loop muted>
        <source src="/demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <section className={login.formWp}>
        <h2 className={`${login.loginTitle} login-view-transitoin`}>登 录</h2>
        <Form
          form={form}
          name="loginForm"
          onFinish={handleSubmit}
          initialValues={{
            remember: true,
            username: 'zhangsan',
            password: 2,
            verificationCode: 1,
          }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入您的用户名！' }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入您的密码！' }]}
          >
            <Input.Password placeholder="请输入8-24位字母、数字组合密码" />
          </Form.Item>

          <VerificationCodeInput />

          <Form.Item name="remember" valuePropName="checked">
            <div className="flex justify-between">
              <Checkbox>记住我</Checkbox>
              <p>
                还没账号？
                <Button type="link" onClick={() => navigate('/register')}>
                  立即注册
                </Button>
              </p>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" block htmlType="submit">
              登 录
            </Button>
          </Form.Item>

          <section>
            <Button type="link">忘记密码？</Button>
          </section>
        </Form>
      </section>
    </section>
  )
}

export default LoginForm
