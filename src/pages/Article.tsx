// src/pages/Article.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    DatePicker,
    Select,
    Table,
    Tag,
    Space,
} from 'antd';
import img404 from '../assets/react.svg';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getArticleListAPI, getChannelAPI } from '../apis/article';
import type {Article, ChannelType} from '../types';
import moment from 'moment'; // Ensure moment is installed and imported

import type { ColumnsType } from 'antd/es/table'; // Import ColumnsType for better type safety

const { Option } = Select;
const { RangePicker } = DatePicker;

const Article: React.FC = () => {
    const [channels, setChannels] = useState<ChannelType[]>([]);
    const [list, setList] = useState<Article[]>([]);
    const [count, setCount] = useState<number>(0);
    const [reqData, setReqData] = useState<{
        page: number;
        per_page: number;
        begin_pubdate: string;
        end_pubdate: string;
        status?: number;
        channel_id?: number;
    }>({
        page: 1,
        per_page: 10,
        begin_pubdate: '',
        end_pubdate: '',
        // status and channel_id are optional and initially undefined
    });

    useEffect(() => {
        async function fetchChannels() {
            try {
                const res = await getChannelAPI();

                console.log(res)
                setChannels(res);
            } catch (error) {
                console.error('Failed to fetch channels:', error);
            }
        }

        fetchChannels();
    }, []);

    const statusMap: Record<number, React.ReactNode> = {
        1: <Tag color="warning">待审核</Tag>,
        2: <Tag color="success">审核通过</Tag>,
    };

    const columns: ColumnsType<Article> = [
        {
            title: '封面',
            dataIndex: 'cover',
            width: 120,
            render: (cover: Article['cover']) => (
                <img src={cover.images[0] || img404} width={80} height={60} alt="封面" />
            ),
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220,
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (data: number) => statusMap[data] || '未知',
        },
        {
            title: '发布时间',
            dataIndex: 'pubdate',
        },
        {
            title: '阅读数',
            dataIndex: 'read_count',
        },
        {
            title: '评论数',
            dataIndex: 'comment_count',
        },
        {
            title: '点赞数',
            dataIndex: 'like_count',
        },
        {
            title: '操作',
            render: (_: unknown, _record: Article) => ( // Prefixed with '_'
                <Space size="middle">
                    <Button type="primary" shape="circle" icon={<EditOutlined />} />
                    <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    useEffect(() => {
        async function fetchList() {
            try {
                const res = await getArticleListAPI(reqData);
                setList(res.results);
                setCount(res.total_count);
            } catch (error) {
                console.error('Failed to fetch articles:', error);
            }
        }
        fetchList();
    }, [reqData]);

    /**
     * Handles form submission for filtering articles.
     * @param formValue - The values from the form.
     */
    const onFinish = (formValue: {
        status: number | '';
        channel_id: number | '';
        date: [moment.Moment, moment.Moment];
    }) => {
        const [begin_pubdate, end_pubdate] = formValue.date || [moment(), moment()];
        setReqData({
            ...reqData,
            channel_id: formValue.channel_id || undefined,
            status: formValue.status || undefined,
            begin_pubdate: begin_pubdate.format('YYYY-MM-DD'),
            end_pubdate: end_pubdate.format('YYYY-MM-DD'),
        });
    };

    /**
     * Handles pagination changes.
     * @param page - The new page number.
     */
    const onPageChange = (page: number) => {
        setReqData({
            ...reqData,
            page,
        });
    };

    return (
        <div>
            <Card
                title={
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">首页</Link> },
                            { title: '文章列表' },
                        ]}
                    />
                }
                style={{ marginBottom: 20 }}
            >
                <Form
                    initialValues={{ status: '' }}
                    onFinish={onFinish}
                    onFinishFailed={(errorInfo) => {
                        console.error('Failed:', errorInfo);
                    }}
                    layout="inline"
                >
                    <Form.Item label="状态" name="status">
                        <Radio.Group>
                            <Radio value="">全部</Radio>
                            <Radio value={1}>待审核</Radio>
                            <Radio value={2}>审核通过</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="频道" name="channel_id">
                        <Select placeholder="请选择文章频道" style={{ width: 200 }}>
                            {channels && channels.length > 0 ? (
                                channels.map((channel) => (
                                    <Option key={channel.id} value={channel.id}>
                                        {channel.name}
                                    </Option>
                                ))
                            ) : (
                                <Option disabled>暂无频道</Option>
                            )}
                        </Select>
                    </Form.Item>

                    <Form.Item label="日期" name="date">
                        <RangePicker />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={list}
                    pagination={{
                        total: count,
                        pageSize: reqData.per_page,
                        onChange: onPageChange,
                    }}
                />
            </Card>
        </div>
    );
};

export default Article;
