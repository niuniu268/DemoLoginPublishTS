// src/pages/Publish.tsx

import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Input,
    Space,
    Select,
    message, // Imported message from antd
} from 'antd';
import { Link } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {PublishFormValues,  ChannelType } from '../types';
import { getChannelAPI, publishArticleAPI } from '../apis/article';
import { useEffect, useState } from 'react';

const { Option } = Select;

const Publish: React.FC = () => {
    // State to hold channels
    const [channels, setChannels] = useState<ChannelType[]>([]);
    // State to manage loading state
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm(); // Initialize form instance

    // Initialize the TipTap editor
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>请输入文章内容</p>',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            form.setFieldsValue({ content: html });
        },
    });

    // Fetch channels when the component mounts
    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const res = await getChannelAPI();
                setChannels(res);
            } catch (error) {
                console.error('Failed to fetch channels:', error);
                message.error('获取频道列表失败');
            }
        };

        fetchChannels();
    }, []);

    /**
     * Handles form submission for publishing an article.
     * @param formValue - The values from the publish form.
     */
    const onFinish = async (formValue: PublishFormValues) => {
        const { title, channel_id, content } = formValue;

        if (!editor) {
            message.error('编辑器未初始化');
            return;
        }

        setLoading(true); // Start loading

        try {
            await publishArticleAPI({
                title,
                channel_id,
                content,
            });
            message.success('文章发布成功');
            form.resetFields();
            editor.commands.clearContent();
        } catch (error) {
            message.error('文章发布失败');
            console.error('Publish failed:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">首页</Link> },
                            { title: '发布文章' },
                        ]}
                    />
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 1 }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder="请输入文章标题" style={{ width: 400 }} />
                    </Form.Item>
                    <Form.Item
                        label="频道"
                        name="channel_id"
                        rules={[{ required: true, message: '请选择文章频道' }]}
                    >
                        <Select placeholder="请选择文章频道" style={{ width: 400 }}>
                            {channels && channels.length > 0 ? (
                                channels.map((channel) => (
                                    <Option key={channel.id ?? 'default-id'} value={channel.id ?? 'default-id'}>
                                        {channel.name}
                                    </Option>
                                ))
                            ) : (
                                <Option disabled value="no-channels">暂无频道</Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{ required: true, message: '请输入文章内容' }]}
                    >
                        {/* Render the TipTap editor */}
                        <EditorContent editor={editor} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit" loading={loading}>
                                发布文章
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Publish;
