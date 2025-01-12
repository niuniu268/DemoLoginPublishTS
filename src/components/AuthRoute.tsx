// src/components/AuthRoute.tsx

import React, { ReactNode } from 'react';
import { getToken } from '../utils';
import { Navigate } from 'react-router-dom';

/**
 * Props for AuthRoute component.
 */
interface AuthRouteProps {
    children: ReactNode;
}

/**
 * AuthRoute component to protect routes that require authentication.
 */
const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
    const isToken = getToken();
    if (isToken) {
        return <>{children}</>;
    } else {
        return <Navigate to="/login" replace />;
    }
};

export default AuthRoute;
