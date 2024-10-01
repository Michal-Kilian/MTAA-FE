import React, { useContext, useState, useEffect } from 'react';
import { View } from 'react-native';
import { InputTextField } from './Components/InputTextField';
import { PageTitleText } from './Components/PageTitleText';
import { PrimaryButton } from './Components/PrimaryButton';
import { SecondaryButton } from './Components/SecondaryButton';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from './Styles/GlobalStyles';
import { AppSettings } from './AppSettings';
import { fetchTeams } from '../Api/FetchTeams';
import { fetchFines } from '../Api/FetchFines';
import { fetchTeammates } from '../Api/FetchTeammates';
import { useIsFocused } from '@react-navigation/native';

export function Login() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabledSubmit, setDisabledSubmit] = useState(true);

    useEffect(() => {
        if (isFocused) {
            setDisabledSubmit(true);
        }
    }, [isFocused]);

    const { appSettings, setAppSettings } = useContext(AppSettings);

    const loginTitle = appSettings.slovakLanguage ? "Prihlásenie" : "Login";
    const emailPlaceholder = appSettings.slovakLanguage ? "Emailová adresa" : "Email address";
    const passwordPlaceholder = appSettings.slovakLanguage ? "Heslo" : "Password";
    const loginButtonTitle = appSettings.slovakLanguage ? "Prihlásiť sa" : "Sign in";
    const registerButtonTitle = appSettings.slovakLanguage ? "Registrovať sa" : "Register";

    const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;

    const handleChangeEmail = (value: string) => {
        setDisabledSubmit(value === '' || password === '');
        setEmail(value);
    };

    const handleChangePassword = (value: string) => {
        setDisabledSubmit(email === '' || value === '');
        setPassword(value);
    };

    const handleRegisterPress = () => {
        navigation.navigate('Registration' as never);
        setEmail('');
        setPassword('');
    };

    const handleLoginPress = async () => {
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            if (response.ok) {
                const data = await response.json();

                const userId = data.id;
                const userName = data.name;
                const userSurname = data.surname;
                const userEmail = data.email;
                const userDarkmode: boolean = data.darkmode === 'true';
                const userLanguage: boolean = data.language === 'sk';
                const userLastTeamId = data.last_team_id;
                const userPassword = password;
                const teams = await fetchTeams(userId);
                const fines = await fetchFines(userLastTeamId, userId);
                const teammates = await fetchTeammates(userLastTeamId);
                const ws = new WebSocket(process.env.EXPO_PUBLIC_SOCKET_URL);

                setAppSettings({
                    userId: userId,
                    userName: userName,
                    userSurname: userSurname,
                    userEmail: userEmail,
                    darkMode: userDarkmode,
                    slovakLanguage: userLanguage,
                    userLastTeamId: userLastTeamId,
                    userPassword: userPassword,
                    userTeams: teams,
                    userTeamFines: fines,
                    userTeamTeammates: teammates,
                    selectedInvitation: '',
                    ws: ws,
                    userInvitations: [],
                    userFinesList: [],
                    history: [],
                    offline: false,
                });

                setEmail('');
                setPassword('');
                navigation.navigate('Fines' as never);

                console.log('Login successful');
            } else {
                console.log('Login failed');
            }

        } catch (error) {
            console.error('An error occurred during login:', error);
            if (appSettings.history) {
                setAppSettings((prevSettings) => ({
                    ...prevSettings,
                    userId: appSettings.history[0].userId,
                    userName: appSettings.history[0].userName,
                    userSurname: appSettings.history[0].userSurname,
                    userEmail: appSettings.history[0].userEmail,
                    darkMode: appSettings.history[0].userDarkmode || false,
                    slovakLanguage: appSettings.history[0].userLanguage || false,
                    userLastTeamId: appSettings.history[0].userLastTeamId,
                    userPassword: appSettings.history[0].userPassword,
                    userTeams: appSettings.history[0].userTeams,
                    userTeamFines: appSettings.history[0].userTeamFines,
                    userTeamTeammates: appSettings.history[0].userTeamTeammates,
                    selectedInvitation: appSettings.history[0].selectedInvitation,
                    userInvitations: appSettings.history[0].userInvitations,
                    userFinesList: appSettings.history[0].userFinesList,
                    offline: true,
                }));
            } else {
                console.log('No login history available.');
            }

            if (email === appSettings.history[0].userEmail && password === appSettings.history[0].userPassword) {
                setEmail('');
                setPassword('');
                navigation.navigate('Fines' as never);
                console.log('Offline login successful');
            } else {
                console.log('Offline Login failed');
            }
        }
    };

    return (
        <View style={containerStyle}>
            <PageTitleText textString={loginTitle} />
            <InputTextField stateValue={email} placeholderText={emailPlaceholder} onChangeText={handleChangeEmail} />
            <InputTextField stateValue={password} placeholderText={passwordPlaceholder} onChangeText={handleChangePassword} isPassword={true} />
            <PrimaryButton
                title={loginButtonTitle}
                onPress={handleLoginPress}
                disabled={disabledSubmit}
            />
            <SecondaryButton
                title={registerButtonTitle}
                onPress={handleRegisterPress}
            />
        </View>
    );
}
