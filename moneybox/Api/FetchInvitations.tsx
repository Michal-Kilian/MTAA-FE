import React, { useContext } from 'react';

export const fetchInvitations = async (userId: string) => {
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/invitation?user_id=' + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            const invitations = data.map((item: { id: string, name: string, teammatescount: number, image: string }) => ({
                id: item.id,
                name: item.name,
                teammatesCount: item.teammatescount,
                logo: item.image,
            }));

            console.log('Invitations fetch was successful');
            return invitations;
        } else {
            console.log('Invitations fetch failed');
            return [];
        }
    } catch (error) {
        console.error('An error occurred during invitations fetch:', error);
    }
};
