import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GlobalStyles } from './Styles/GlobalStyles';
import { PageTitleText } from './Components/PageTitleText';
import { Picker } from '@react-native-picker/picker';
import { colors } from './Styles/Colors';
import { SubmitContainer } from './Containers/SubmitContainer';
import { AppSettings } from './AppSettings';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { fetchTeammates } from '../Api/FetchTeammates';
import { fetchFinesList } from '../Api/FetchFinesList';

interface Teammate {
    id: string;
    name: string;
    amount: number;
    description: string;
}

interface Fine {
    id: string;
    name: string;
    amount: number;
    description: string;
}

export function AssignFine() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { appSettings, setAppSettings } = useContext(AppSettings);

    const assignFineTitle = appSettings.slovakLanguage ? "Prideliť pokutu" : "Assign fine";
    const chooseTeammate = appSettings.slovakLanguage ? "Zvoliť spoluhráča" : "Choose a teammate";
    const chooseFine = appSettings.slovakLanguage ? "Zvoliť pokutu" : "Choose a fine";
    const priceLabel = appSettings.slovakLanguage ? "Cena" : "Price";

    const [teamFines, setTeamFines] = useState<Fine | undefined>();
    const [selectedTeammate, setSelectedTeammate] = useState<Teammate | undefined>();
    const [selectedFine, setSelectedFine] = useState<Fine | undefined>();
    const [price, setPrice] = useState<number>(0);
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);

    const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;
    const backgroundInputColor = appSettings.darkMode ? GlobalStyles.amountCircleColorDark : GlobalStyles.amountCircleColor;
    const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;

    useEffect(() => {
        if (isFocused) {
            if (appSettings.offline === false) {
                initTeammates();
                initFines();
            }
        }
    }, [isFocused]);

    const initTeammates = async () => {
        const teammates: Teammate[] = await fetchTeammates(appSettings.userLastTeamId);
        if (teammates) {
            setAppSettings((prevSettings) => ({
                ...prevSettings,
                userTeamTeammates: teammates,
            }));
        }
        setSelectedTeammate(teammates[0]);
    };

    const initFines = async () => {
        const fines: Fine[] = await fetchFinesList(appSettings.userLastTeamId);
        if (fines) {
            setAppSettings((prevSettings) => ({
                ...prevSettings,
                userFinesList: fines,
            }));

            setTeamFines(fines);
        }
        setSelectedFine(fines[0]);
    };

    const handleTeammateChange = (teammate: Teammate | undefined) => {
        setSelectedTeammate(teammate);
        if (teammate && selectedFine) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    };

    const handleFineChange = (fine: Fine | undefined) => {
        setSelectedFine(fine);
        if (fine && selectedTeammate) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    };

    const handleSubmit = async () => {
        const lastTeam = appSettings.userLastTeamId;
        const user = appSettings.userId;
        const fineId = selectedFine.id;
        const teammateId = selectedTeammate.id;
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/fines', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: teammateId,
                    team_id: lastTeam,
                    fine_id: fineId,
                    created_by_id: user,
                }),
            });

            console.log({ teammateId, lastTeam, fineId, user });

            if (response.ok) {
                setSelectedTeammate(undefined);
                setSelectedFine(undefined);

                try {
                    const ws = appSettings.ws;

                    const newFineObject = {
                        type: "fine",
                        user_id: teammateId,
                    };
                    if (ws) {
                        ws.send(JSON.stringify(newFineObject));
                    }
                    console.log("Sending fine to:", teammateId);

                } catch (error) {
                    console.log(error);
                }

                navigation.goBack();

                console.log('Assigning fine successful');
            } else {
                console.log('Assigning fine failed');
            }
        } catch (error) {
            console.error('An error occurred during assigning fine:', error);
        }
    };

    const handleCancel = () => {
        setSelectedTeammate(undefined);
        setSelectedFine(undefined);
        setPrice(0);
        setSubmitDisabled(true);

        navigation.goBack();
    };

    const showTeammatesNames = () => {
        return appSettings.userTeamTeammates?.map((teammate: Teammate, index: number) => (
            <Picker.Item key={index} label={teammate.name} value={teammate} />
        ));
    };

    const showTeamFines = () => {
        return teamFines?.map((fine: Fine, index: number) => (
            <Picker.Item key={index} label={fine.name} value={fine} />
        ));
    };

    return (
        <View style={containerStyle}>
            <PageTitleText textString={assignFineTitle} />
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.pickerLabel}>{chooseTeammate}</Text>
                    <Picker
                        style={[styles.inputField, shadowStyle, backgroundInputColor]}
                        selectedValue={selectedTeammate}
                        onValueChange={(itemValue, itemIndex) => handleTeammateChange(itemValue)}
                        prompt={chooseTeammate}
                    >
                        {showTeammatesNames()}
                    </Picker>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.pickerLabel}>{chooseFine}</Text>
                    <Picker
                        style={[styles.inputField, shadowStyle, backgroundInputColor]}
                        selectedValue={selectedFine}
                        onValueChange={(itemValue, itemIndex) => handleFineChange(itemValue)}
                        prompt={chooseFine}
                    >
                        {showTeamFines()}
                    </Picker>
                </View>
            </View>
            {price !== 0 && <Text style={styles.pickerLabel}>{priceLabel}: {price}</Text>}
            <SubmitContainer
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                disabledSubmit={submitDisabled}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    pickerLabel: {
        color: 'gray',
        marginBottom: 10,
        textAlign: 'left'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    inputWrapper: {
        width: '85%'
    },
    inputField: {
        width: '100%',
        height: 40,
        paddingLeft: 10,
        borderRadius: 10,
        color: colors.placeholder,
        marginBottom: 25
    }
});
