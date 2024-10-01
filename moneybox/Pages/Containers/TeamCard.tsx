import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, ImageSourcePropType, ScrollView } from 'react-native';
import { AppSettings } from '../AppSettings';
import { GlobalStyles } from '../Styles/GlobalStyles';
import { fetchFines } from '../../Api/FetchFines';
import { fetchTeammates } from '../../Api/FetchTeammates';

interface Team {
    id: string;
    name: string;
    teammatesCount: number;
    logo: string;
};

interface TeamCardProps {
    teams: Team[];
    invitation?: boolean;
};

export const TeamCard: React.FC<TeamCardProps> = ({ teams, invitation }) => {
    const { appSettings, setAppSettings } = useContext(AppSettings);

    const membersCountTitle = appSettings.slovakLanguage ? "Počet členov: " : "Members count: ";
    const [selectedId, setSelectedId] = useState(appSettings.userLastTeamId);
    const userId = appSettings.userId;

    const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
    const textColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;
    const cardBackground = appSettings.darkMode ? GlobalStyles.cardBackgroundDark : GlobalStyles.cardBackground;
    const selectedTeamCardBorder = appSettings.darkMode ? GlobalStyles.selectedTeamCardBorderDark : GlobalStyles.selectedTeamCardBorder;
    const notSelectedTeamCardBorder = appSettings.darkMode ? GlobalStyles.notSelectedTeamCardBorderDark : GlobalStyles.notSelectedTeamCardBorder;

    const handleTeamPress = async (id: string) => {
        setSelectedId(id);
        if (invitation) {
            setAppSettings((prevSettings) => ({
                ...prevSettings,
                selectedInvitation: id,
            }));

        } else {
            try {
                const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/last-team', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        last_team_id: id,
                        user_id: userId,
                    }),
                });

                if (response.ok) {
                    console.log('Last team change successful');

                    const fines = await fetchFines(id, userId);
                    const teammates = await fetchTeammates(id);

                    setAppSettings((prevSettings) => ({
                        ...prevSettings,
                        userLastTeamId: id,
                        userTeamFines: fines,
                        userTeamTeammates: teammates,
                    }));

                } else {
                    console.log('Last team change failed');
                }
            } catch (error) {
                console.error("Error updating last team id:", error);
            }
        }
    };

    return (
        <ScrollView
            style={styles.scrollStyle}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            {teams.map((team, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.card,
                        selectedId === team.id ? selectedTeamCardBorder : notSelectedTeamCardBorder,
                        shadowStyle,
                        cardBackground
                    ]}
                    onPress={() => handleTeamPress(team.id)}
                >
                    <Image
                        style={styles.teamLogo}
                        source={{ uri: `data:image/jpeg;base64,${team.logo}` }}
                        resizeMode="center"
                    />
                    <View style={styles.teamInfo}>
                        <Text style={[styles.teamName, textColor]}>{team.name}</Text>
                        <Text style={[styles.teammatesCount, textColor]}>{membersCountTitle} {team.teammatesCount}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollStyle: {
        maxHeight: '100%',
        paddingRight: 0,
        marginLeft: 20,
    },
    card: {
        width: '90%',
        height: 100,
        borderWidth: 2,
        borderRadius: 50,
        marginBottom: 25,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    teamLogo: {
        height: '100%',
        width: '40%',
        position: 'relative',
        left: 5,
        borderRadius: 50,
    },
    teamInfo: {
        width: '50%',
        justifyContent: 'center',
        marginLeft: 10
    },
    teamName: {
        fontWeight: '500',
        textAlign: 'left'
    },
    teammatesCount: {
        textAlign: 'left',
        fontSize: 12,
    },
});
