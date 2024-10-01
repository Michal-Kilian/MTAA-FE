import React, { useContext } from 'react';

export const fetchTeammates = async (currentTeamId: string) => {
    try {
        const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/teammates?team_id=${currentTeamId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data) {
                const teammates = data.map((item: { id: string, name: string, surname: string, number: number }) => ({
                    id: item.id,
                    name: item.name + " " + item.surname,
                    description: item.number,
                }));
                console.log('Teammates fetch successful');
                return teammates;
            } else {
                console.log('No teammates available');
                return [];
            }
        } else {
            console.log('Teammates fetch failed');
            return [];
        }
    } catch (error) {
        console.error("Error fetching teammates:", error);
    }
};