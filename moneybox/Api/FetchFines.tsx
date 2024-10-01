import React, { useContext } from 'react';

export const fetchFines = async (currentTeamId: string, currentUserId: string) => {
    try {
        const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/user-fines?team_id=${currentTeamId}&user_id=${currentUserId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data) {
                const fines = data.map((item: { id: string, name: string, amount: number, description: string }) => ({
                    id: item.id,
                    name: item.name,
                    amount: item.amount,
                    description: item.description,
                }));
                console.log('Fines fetch successful');
                return fines;
            } else {
                console.log('No fines available');
                return [];
            }
        } else {
            console.log('Fines fetch failed');
            return [];
        }
    } catch (error) {
        console.error("Error fetching fines:", error);
    }
};