import { View, Text } from 'react-native';
import { GlobalStyles } from './Styles/GlobalStyles';
import { PageTitleText } from './Components/PageTitleText';
import { useNavigation } from '@react-navigation/native';
import { SubmitContainer } from './Containers/SubmitContainer';
import { TeamCard } from './Containers/TeamCard';
import { AppSettings } from './AppSettings';
import React, { useContext, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { fetchInvitations } from '../Api/FetchInvitations';
import { fetchTeammates } from '../Api/FetchTeammates';

export function Invitations() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { appSettings, setAppSettings } = useContext(AppSettings);
    const [selectedInvitation, setSelectedInvitation] = useState(null);

    const userId = appSettings.userId;
    const invitations = appSettings.userInvitations;

    const invitationsTitle = appSettings.slovakLanguage ? "Pozvánky" : "Invitations";
    const noInvitationsTitle = appSettings.slovakLanguage ? "Nie sú k dispozícii žiadne pozvánky" : "No invitations available";

    const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;
    const textColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;

    useEffect(() => {
        if (isFocused) {
            initInvitations();
        }
    }, [isFocused]);

    const initInvitations = async () => {
        const userId = appSettings.userId;
        const invitations = await fetchInvitations(userId);
        if (invitations) {
            setAppSettings((prevSettings) => ({
                ...prevSettings,
                selectedInvitation: "",
                userInvitations: invitations,
            }));
        }
    };

    const handleSubmit = async () => {
        const id = appSettings.userId;
        const selected = appSettings.selectedInvitation;
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/join-team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: id,
                    team_id: selected,
                })
            });
            if (response.ok) {
                console.log('Team was joined successfuly');

                setAppSettings((prevSettings) => ({
                    ...prevSettings,
                    userLastTeamId: selected,
                }));
                try {
                    const ws = appSettings.ws;
                    const teammates = await fetchTeammates(selected);

                    teammates.forEach(async (teammate: { id: string, name: string, description: string }) => {
                        if (teammate.id !== id) {
                            const newJoinTeamObject = {
                                type: "joinTeam",
                                user_id: teammate.id,
                            };
                            if (ws) {
                                ws.send(JSON.stringify(newJoinTeamObject));
                            }
                            console.log("Sending join team notification to:", teammate.id);
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
                navigation.navigate('Fines' as never);
            } else {
                console.log('Team join failed');
            }
        } catch (error) {
            console.error('An error occurred during joining teams:', error);
        }
    };

    const invitationsList = () => {
        return (
            <View>
                {invitations.length > 0 ? <TeamCard teams={invitations} invitation={true} /> :
                    <Text style={[textColor]}>
                        {noInvitationsTitle}
                    </Text>}
            </View>
        );
    };

    return (
        <View style={containerStyle}>
            <PageTitleText textString={invitationsTitle} />
            {invitationsList()}
            <SubmitContainer
                disabledSubmit={appSettings.selectedInvitation === ""}
                onSubmit={handleSubmit}
                onCancel={() => navigation.goBack()}
            />
        </View>
    );
}
