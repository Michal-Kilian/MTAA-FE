import React, { useContext } from 'react';

export const fetchFinesList = async (currentTeamId: string) => {
   try {
       const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/fines?team_id=${currentTeamId}`;
       const response = await fetch(url, {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json',
           },
       });

       if (response.ok) {
           const data = await response.json();
           if (data) {
              const fines = data.map(item => ({
                  id: item.id,
                  name: item.name,
                  amount: item.amount,
                  description: item.description,
              }));
              console.log('Fines list fetch successful');
              console.log(fines);
              return fines;
          } else {
              console.log('No fines list available');
              return [];
          }
       } else {
           console.log('Fines list fetch failed');
           return [];
       }
   } catch (error) {
       console.error("Error fetching fines list:", error);
   }
};