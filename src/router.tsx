// src/router.tsx

import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import GeekLayout from './components/GeekLayout';
import Home from './pages/Home';
import Article from './pages/Article';
import Publish from './pages/Publish';
import AuthRoute from './components/AuthRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <AuthRoute>
                <GeekLayout />
            </AuthRoute>
        ),
        children: [
            { index: true, element: <Home /> },
            { path: 'article', element: <Article /> },
            { path: 'publish', element: <Publish /> },
            // Add more protected routes here
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '*',
        element: <div>404 Not Found</div>,
    },
]);

export default router;
