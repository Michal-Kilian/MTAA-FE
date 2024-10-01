import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { fetchInvitations } from '../Api/FetchInvitations';
import { fetchFines } from '../Api/FetchFines';
import { fetchFinesList } from '../Api/FetchFinesList';
import { fetchTeammates } from '../Api/FetchTeammates';
import { fetchTeams } from '../Api/FetchTeams';

interface AppSettingsType {
  darkMode: boolean;
  slovakLanguage: boolean;
  userId: string;
  userName: string,
  userSurname: string,
  userEmail: string,
  userLastTeamId: string,
  userTeams: any,
  userTeamFines: any,
  userTeamTeammates: any,
  selectedInvitation: string,
  userPassword: string,
  ws: WebSocket | null,
  userInvitations: any,
  userFinesList: any,
  history: any,
  offline: boolean
}

export const AppSettings = createContext<{
  appSettings: AppSettingsType;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettingsType>>;
}>({
  appSettings: {
    darkMode: false,
    slovakLanguage: false,
    userId: "",
    userName: "",
    userSurname: "",
    userEmail: "",
    userLastTeamId: "",
    userPassword: "",
    userTeams: [],
    userTeamFines: [],
    userTeamTeammates: [],
    selectedInvitation: "",
    ws: null,
    userInvitations: [],
    userFinesList: [],
    history: [],
    offline: false
  },
  setAppSettings: () => { },
});

export const AppSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [appSettings, setAppSettings] = useState<AppSettingsType>({
    darkMode: false,
    slovakLanguage: true,
    userId: "",
    userName: "",
    userSurname: "",
    userEmail: "",
    userLastTeamId: "",
    userPassword: "",
    userTeams: [],
    userTeamFines: [],
    userTeamTeammates: [],
    selectedInvitation: "",
    ws: null,
    userInvitations: [],
    userFinesList: [],
    history: [],
    offline: false
  });

  useEffect(() => {
    fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/status').then((res) => {
      console.log('Status:', res.status);
    }).catch((e) => console.log(e.message));

    const ws = new WebSocket(process.env.EXPO_PUBLIC_SOCKET_URL as string);

    setAppSettings(prevSettings => ({
      ...prevSettings,
      ws: ws,
    }));

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onmessage = async (event) => {
      const messageFromServer = JSON.parse(event.data);
      const userId = appSettings.userId;
      const currentTeamId = appSettings.userLastTeamId;

      const messageType: string = messageFromServer.data.type;
      const messageUserId: string = messageFromServer.data.user_id;

      if (userId === messageUserId) {

        if (messageType === "invitation") {
          const invitations = await fetchInvitations(userId);
          setAppSettings((prevSettings) => ({
            ...prevSettings,
            userInvitations: invitations,
          }));
          console.log("New invitation");

        } else if (messageType === "fine") {
          const fines = await fetchFines(currentTeamId, userId);
          setAppSettings((prevSettings) => ({
            ...prevSettings,
            userTeamFines: fines,
          }));
          console.log("New fine");

        } else if (messageType === "profile") {
          const teammates = await fetchTeammates(currentTeamId);
          setAppSettings((prevSettings) => ({
            ...prevSettings,
            userTeamTeammates: teammates,
          }));
          console.log("New profile change");

        } else if (messageType === "priceList") {
          const finesList = await fetchFinesList(currentTeamId);
          setAppSettings((prevSettings) => ({
            ...prevSettings,
            userFinesList: finesList,
          }));
          console.log("New price list");

        } else if (messageType === "joinTeam") {
          const teammates = await fetchTeammates(currentTeamId);
          setAppSettings((prevSettings) => ({
            ...prevSettings,
            userTeamTeammates: teammates,
          }));
          console.log("New member to your team");
        }
      }
    };


    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <AppSettings.Provider value={{ appSettings, setAppSettings }}>
      {children}
    </AppSettings.Provider>
  );
};
