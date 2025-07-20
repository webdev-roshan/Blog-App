import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, CreateUserData, LoginData } from '@/lib/types';
import { useState, useEffect } from 'react';

import { API_BASE_URL } from '@/lib/config';

const loginUser = async (data: LoginData): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users?email=${data.email}`);
    if (!response.ok) {
        throw new Error('Failed to login');
    }

    const users = await response.json();
    const user = users[0];

    if (!user || user.password !== data.password) {
        throw new Error('Invalid email or password');
    }

    return user;
};

const signupUser = async (data: CreateUserData): Promise<User> => {
    const checkResponse = await fetch(`${API_BASE_URL}/users?email=${data.email}`);
    const existingUsers = await checkResponse.json();

    if (existingUsers.length > 0) {
        throw new Error('Email already exists');
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...data,
            createdAt: new Date().toISOString(),
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to signup');
    }

    return response.json();
};

export const useAuth = () => {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (loggedInUser) => {
            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
        },
    });

    const signupMutation = useMutation({
        mutationFn: signupUser,
        onSuccess: (newUser) => {
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        },
    });

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        queryClient.clear();
    };

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginMutation.mutate,
        signup: signupMutation.mutate,
        logout,
        loginError: loginMutation.error,
        signupError: signupMutation.error,
        isLoginPending: loginMutation.isPending,
        isSignupPending: signupMutation.isPending,
    };
}; 