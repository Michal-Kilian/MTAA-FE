import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { GlobalStyles } from './Styles/GlobalStyles';
import { PageTitleText } from './Components/PageTitleText';
import { SubmitContainer } from './Containers/SubmitContainer';
import { useNavigation } from '@react-navigation/native';
import { AppSettings } from './AppSettings';
import { InputTextField } from './Components/InputTextField';
import React, { useContext, useState } from 'react';
import { colors } from './Styles/Colors';
import { fetchUsers } from '../Api/FetchUsers';

export function Profile() {
    const { appSettings, setAppSettings } = useContext(AppSettings);

    const initialName = appSettings.userName;
    const initialSurname = appSettings.userSurname;
    const initialEmail = appSettings.userEmail;
    const initialPassword = appSettings.userPassword;
    const userId = appSettings.userId;

    const [name, setName] = useState(initialName);
    const [surname, setSurname] = useState(initialSurname);
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState(initialPassword);
    const [confirmPassword, setConfirmPassword] = useState(initialPassword);
    const [disabled, setDisabled] = useState(true);
    const [visible, setVisible] = useState(false);

    const navigation = useNavigation();
    const profileTitle = appSettings.slovakLanguage ? "Profil" : "Profile";
    const nameTitle = appSettings.slovakLanguage ? "Meno" : "Name";
    const surnameTitle = appSettings.slovakLanguage ? "Priezvisko" : "Surname";
    const emailTitle = appSettings.slovakLanguage ? "Emailová adresa" : "Email address";
    const passwordTitle = appSettings.slovakLanguage ? "Heslo" : "Password";
    const confirmPasswordTitle = appSettings.slovakLanguage ? "Potvrdiť heslo" : "Confirm password";
    const saveChangesTitle = appSettings.slovakLanguage ? "Uložiť zmeny" : "Save changes";
    const cancelTitle = appSettings.slovakLanguage ? "Zrušiť" : "Cancel";

    const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
    const primaryTextColor = appSettings.darkMode ? GlobalStyles.primaryTextColorDark : GlobalStyles.primaryTextColor;
    const backgroundColorPrimary = appSettings.darkMode ? GlobalStyles.backgroundColorPrimaryDark : GlobalStyles.backgroundColorPrimary;
    const textColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;

    const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;

    const handleNameChange = (value: string) => {
        setDisabled(value === initialName);
        setName(value);
    };

    const handleSurnameChange = (value: string) => {
        setDisabled(value === initialSurname);
        setSurname(value);
    };

    const handleEmailChange = (value: string) => {
        setDisabled(value === initialEmail);
        setEmail(value);
    };

    const handlePasswordChange = (value: string) => {
        setDisabled(value === initialPassword);
        setVisible(value !== initialPassword);
        setPassword(value);
    };

    const onSaveChanges = async () => {
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    surname: surname,
                    email: email,
                    password: password,
                    user_id: userId,
                }),
            });
            if (response.ok) {
                setAppSettings((prevSettings) => ({
                    ...prevSettings,
                    userName: name,
                    userSurname: surname,
                    userEmail: email,
                    userPassword: password,
                }));

                try {
                    const ws = appSettings.ws;

                    const fetchedUsers = await fetchUsers();

                    fetchedUsers.forEach(async (user: { id: string }) => {
                        if (user.id !== userId) {
                            const newProfileObject = {
                                type: "profile",
                                user_id: user.id,
                            };
                            if (ws) {
                                ws.send(JSON.stringify(newProfileObject));
                            }
                            console.log("Sending profile update to:", user.id);
                        }
                    });

                } catch (error) {
                    console.log(error);
                }

                navigation.goBack();

                console.log('Update successful');
            } else {
                console.log('Update failed',);
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    };

    const onCancel = () => {
        navigation.goBack();
    }

    return (
        <View style={containerStyle}>
            <PageTitleText textString={profileTitle}></PageTitleText>
            <View style={styles.editContainer}>
                <Text style={[styles.editLabel, textColor]}>{nameTitle}:</Text>
                <View style={styles.inputContainer}>
                    <InputTextField stateValue={name} placeholderText={name} onChangeText={handleNameChange}></InputTextField>
                </View>
            </View>
            <View style={styles.editContainer}>
                <Text style={[styles.editLabel, textColor]}>{surnameTitle}:</Text>
                <View style={styles.inputContainer}>
                    <InputTextField stateValue={surname} placeholderText={surname} onChangeText={handleSurnameChange}></InputTextField>
                </View>
            </View>
            <View style={styles.editContainer}>
                <Text style={[styles.editLabel, textColor]}>{emailTitle}:</Text>
                <View style={styles.inputContainer}>
                    <InputTextField stateValue={email} placeholderText={email} onChangeText={handleEmailChange}></InputTextField>
                </View>
            </View>
            <View style={styles.editContainer}>
                <Text style={[styles.editLabel, textColor]}>{passwordTitle}:</Text>
                <View style={styles.inputContainer}>
                    <InputTextField stateValue={password} placeholderText={password} onChangeText={handlePasswordChange} isPassword={true}></InputTextField>
                </View>
            </View>
            {visible && (
                <View style={styles.editContainer}>
                    <Text style={[styles.editLabel, textColor]}>{confirmPasswordTitle}:</Text>
                    <View style={styles.inputContainer}>
                        <InputTextField stateValue={confirmPassword} placeholderText={password} onChangeText={setConfirmPassword} isPassword={true}></InputTextField>
                    </View>
                </View>
            )}
            <SubmitContainer
                onSubmit={onSaveChanges}
                onCancel={onCancel}
                disabledSubmit={disabled}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    editContainer: {
        width: '85%',
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    editLabel: {
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
    },
    button: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftButton: {
        width: '43%',
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        marginRight: 5,
        marginLeft: 20,
    },
    rightButton: {
        width: '43%',
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        marginRight: 20,
        marginLeft: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.2
    },
    inputContainer: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
    },
});