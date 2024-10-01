import React, { useContext } from 'react';

export const fetchUsers = async () => {
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/all-users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            if (data) {
                const users = data.map((item: { id: string}) => ({
                    id: item.id,
                }));
                console.log('Users fetch successful');
                return users;
            } else {
                console.log('No users available');
                return [];
            }
        } else {
            console.log('Fetching users failed');
            return [];
        }
    } catch (error) {
        console.error('An error occurred during fetching all users:', error);
    }
};