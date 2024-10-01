import React, { useContext } from 'react';

export const fetchTeams = async (userId: string) => {
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/teams?user_id=' + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json() as { id: string, name: string, teammatescount: number, image: string }[];

            const teams = data.map(item => ({
                id: item.id,
                name: item.name,
                teammatesCount: item.teammatescount,
                logo: item.image,
            }));

            console.log('Teams fetch successful');
            return teams;
        } else {
            console.log('Teams fetch failed');
            return [];
        }
    } catch (error) {
        console.error('An error occurred during teams fetch:', error);
    }
};