// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import GeekLayout from './components/GeekLayout';
import Home from './pages/Home';
import Article from './pages/Article';
import Publish from './pages/Publish';
import AuthRoute from './components/AuthRoute';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <AuthRoute>
                        <GeekLayout />
                    </AuthRoute>
                }
            >
                <Route index element={<Home />} />
                <Route path="article" element={<Article />} />
                <Route path="publish" element={<Publish />} />
                {/* Add more protected routes here */}
            </Route>
            {/* Add a fallback route for 404 Not Found */}
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
};

export default App;
