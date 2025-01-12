// src/components/GeekLayout.tsx

import { useEffect } from 'react';
import { Layout, Menu, Popconfirm } from 'antd';
import {
    HomeOutlined,
    DiffOutlined,
    EditOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks'; // Updated import
import { clearUserInfo, fetchUserInfo } from '../store/modules/user';

const { Header, Sider } = Layout;

interface MenuItem {
    label: React.ReactNode;
    key: string;
    icon: React.ReactNode;
}

const items: MenuItem[] = [
    {
        label: '首页',
        key: '/',
        icon: <HomeOutlined />,
    },
    {
        label: '文章管理',
        key: '/article',
        icon: <DiffOutlined />,
    },
    {
        label: '创建文章',
        key: '/publish',
        icon: <EditOutlined />,
    },
];

const GeekLayout: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch(); // Use typed dispatch

    const name = useAppSelector((state) => state.user.userInfo?.name); // Use typed selector

    useEffect(() => {
        dispatch(fetchUserInfo());
    }, [dispatch]);

    const onMenuClick = (e: { key: string }) => {
        navigate(e.key);
    };

    const loginOut = () => {
        dispatch(clearUserInfo());
        navigate('/login');
    };

    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
                <div className="user-info">
                    <span className="user-name">{name}</span>
                    <span className="user-logout">
                        <Popconfirm
                            title="是否确认退出？"
                            okText="退出"
                            cancelText="取消"
                            onConfirm={loginOut}
                        >
                            <LogoutOutlined /> 退出
                        </Popconfirm>
                    </span>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        theme="dark"
                        defaultSelectedKeys={['/']}
                        items={items}
                        style={{ height: '100%', borderRight: 0 }}
                        onClick={onMenuClick}
                    />
                </Sider>
                <Layout className="layout-content" style={{ padding: 20 }}>
                    <Outlet />
                </Layout>
            </Layout>
        </Layout>
    );
};

export default GeekLayout;
