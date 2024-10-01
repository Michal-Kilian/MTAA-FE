import { View, Text, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import { GlobalStyles } from './Styles/GlobalStyles';
import { PageTitleText } from './Components/PageTitleText';
import { useNavigation } from '@react-navigation/native';
import { SubmitContainer } from './Containers/SubmitContainer';
import { AppSettings } from './AppSettings';
import { InputTextField } from './Components/InputTextField';
import { InputNumberField } from './Components/InputNumberField';

export function AddTeammate() {
    const navigation = useNavigation();
    const { appSettings } = useContext(AppSettings);

    const addTeammateTitle = appSettings.slovakLanguage ? "Pridať spoluhráča" : "Add teammate";
    const emailPlaceholder = appSettings.slovakLanguage ? "Emailová adresa" : "Email address";
    const dressNumberPlaceholder = appSettings.slovakLanguage ? "Číslo dresu" : "Dress number";
    const explanation = appSettings.slovakLanguage ? "Na túto emailovú adresu sa odošle pozvánka do Vášho tímu"
        : "An invitation to join your team will be sent to this email address"

    const [email, setEmail] = useState<string>('');
    const [dressNumber, setDressNumber] = useState<string>('');
    const [disabledSubmit, setDisabledSubmit] = useState(true);

    const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;
    const textColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;

    const handleSubmit = async () => {
        const userEmail = appSettings.userEmail;
        const lastTeamId = appSettings.userLastTeamId;
        const userId = appSettings.userId;
        const ws = appSettings.ws;

        if (email !== userEmail) {
            try {
                const current_team_id = appSettings.userLastTeamId;
                const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/invitation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        invited_user_id: email,
                        team_id: current_team_id,
                        dress_number: dressNumber,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();

                    try {
                        const ws = appSettings.ws;
                        const invitedId = data[0].user_id;
                        const newInvitationObject = {
                            type: "invitation",
                            user_id: invitedId,
                        };
                        if (ws) {
                            ws.send(JSON.stringify(newInvitationObject));
                        }
                        console.log("Sending invitation to:", invitedId);

                        navigation.navigate('Teammates' as never);
                    } catch (error) {
                        console.log(error);
                    }
                    console.log('Invitation successful');
                } else {
                    console.log('Invitation failed');
                }
            } catch (error) {
                console.error("Error during invitation:", error);
            }
        } else {
            console.log('You cannot invite yourself');
        }
    }

    const handleChangeEmail = (value: string) => {
        setDisabledSubmit(value === '' || dressNumber === '');
        setEmail(value);

    };

    const handleChangeDressNumber = (value: string) => {
        setDisabledSubmit(value === '' || email === '');
        setDressNumber(value);
    };

    return (
        <View style={containerStyle}>
            <PageTitleText textString={addTeammateTitle}></PageTitleText>
            <InputTextField
                stateValue={email}
                placeholderText={emailPlaceholder}
                onChangeText={handleChangeEmail}
            />
            <InputNumberField
                stateValue={dressNumber}
                placeholderText={dressNumberPlaceholder}
                onChangeNumber={handleChangeDressNumber}
            />
            <Text style={[{ textAlign: 'center', marginTop: 15, width: '85%' }, textColor]}>{explanation}</Text>
            <SubmitContainer
                disabledSubmit={disabledSubmit}
                onSubmit={handleSubmit}
                onCancel={() => { navigation.goBack() }}
            />
        </View>
    )
}