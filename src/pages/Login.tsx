// src/pages/Login.tsx

import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogin } from '../store/modules/user';
import { LoginFormValues } from '../types';
import { RootState, AppDispatch } from '../store';


const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.user);
    const [form] = Form.useForm<LoginFormValues>();

    const onFinish = async (values: LoginFormValues) => {
        try {
            const resultAction = await dispatch(fetchLogin(values));
            if (fetchLogin.fulfilled.match(resultAction)) {
                message.success('登录成功');
                navigate('/');
            } else {
                if (resultAction.payload) {
                    message.error(`登录失败: ${resultAction.payload}`);
                } else {
                    message.error('登录失败: 服务器错误');
                }
            }
        } catch (error) {
            message.error('登录失败: 服务器错误');
            console.error('Login failed in component:', error);
        }
    };

    return (
        <Form<LoginFormValues>
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            style={{ maxWidth: 400, margin: '0 auto', padding: '50px 0' }}
        >
            <Form.Item
                label="手机号码"
                name="mobile"
                rules={[
                    { required: true, message: '请输入手机号码' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
                ]}
            >
                <Input placeholder="请输入手机号码" />
            </Form.Item>
            <Form.Item
                label="验证码"
                name="code"
                rules={[{ required: true, message: '请输入验证码' }]}
            >
                <Input placeholder="请输入验证码" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                    登录
                </Button>
            </Form.Item>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </Form>
    );
};

export default Login;
