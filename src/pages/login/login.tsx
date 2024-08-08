// import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
// import JSEncrypt from "jsencrypt";

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

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
    console.log(values);
    navigate('/dashboard');
  };

  // const encryptPassword = async (password: string) => {};

  return (
    <section>
      <Form form={form} name="loginForm" onFinish={handleSubmit}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "请输入您的用户名！" }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入您的密码！" }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          )}
        </Form.Item>
      </Form>
    </section>
  );
};

export default LoginForm;
