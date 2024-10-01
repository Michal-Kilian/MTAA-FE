import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { InputTextField } from './Components/InputTextField';
import { PageTitleText } from './Components/PageTitleText';
import { PrimaryButton } from './Components/PrimaryButton';
import { SecondaryButton } from './Components/SecondaryButton';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from './Styles/GlobalStyles';
import { AppSettings } from './AppSettings';

export function Registration() {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [disabledSubmit, setDisabledSubmit] = useState(true);

    const { appSettings } = useContext(AppSettings);

    const registrationTitle = appSettings.slovakLanguage ? "Registrácia" : "Registration";
    const namePlaceholder = appSettings.slovakLanguage ? "Meno" : "Name";
    const surnamePlaceholder = appSettings.slovakLanguage ? "Priezvisko" : "Surname";
    const emailPlaceholder = appSettings.slovakLanguage ? "Emailová adresa" : "Email address";
    const passwordPlaceholder = appSettings.slovakLanguage ? "Heslo" : "Password";
    const confirmPasswordPlaceholder = appSettings.slovakLanguage ? "Potvrdiť heslo" : "Confirm password";
    const registerButtonTitle = appSettings.slovakLanguage ? "Registrovať sa" : "Register";
    const loginButtonTitle = appSettings.slovakLanguage ? "Prihlásiť sa" : "Sign in";

    const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;

    const handleLoginPress = () => {
        navigation.navigate('Login' as never);
    };

    const handleRegisterPress = async () => {
        if (password !== confirmPassword) {
            console.log('Passwords do not match');
            return;
        };

        await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    name,
                    surname,
                    email,
                    password,
                    confirmPassword
                }),
        }).then((response) => {
            if (response.ok) {
                navigation.navigate('Login' as never);
                setName('');
                setSurname('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else if (response.status === 409) {
                console.log('Email already exists');
            } else {
                console.log('Registration failed');
            }
        });
    };

    const handleNameChange = (value: string) => {
        setDisabledSubmit(value === '' || surname === '' || email === '' || password === '' || confirmPassword === '');
        setName(value);
    };

    const handleSurnameChange = (value: string) => {
        setDisabledSubmit(name === '' || value === '' || email === '' || password === '' || confirmPassword === '');
        setSurname(value);
    };

    const handleEmailChange = (value: string) => {
        setDisabledSubmit(name === '' || surname === '' || value === '' || password === '' || confirmPassword === '');
        setEmail(value);
    };

    const handlePasswordChange = (value: string) => {
        setDisabledSubmit(name === '' || surname === '' || email === '' || value === '' || confirmPassword === '');
        setPassword(value);
    };

    const handleConfirmPasswordChange = (value: string) => {
        setDisabledSubmit(name === '' || surname === '' || email === '' || password === '' || value === '');
        setConfirmPassword(value);
    };

    return (
        <View style={containerStyle}>
            <PageTitleText textString={registrationTitle} />
            <InputTextField stateValue={name} placeholderText={namePlaceholder} onChangeText={handleNameChange} />
            <InputTextField stateValue={surname} placeholderText={surnamePlaceholder} onChangeText={handleSurnameChange} />
            <InputTextField stateValue={email} placeholderText={emailPlaceholder} onChangeText={handleEmailChange} />
            <InputTextField stateValue={password} placeholderText={passwordPlaceholder} onChangeText={handlePasswordChange} isPassword={true} />
            <InputTextField stateValue={confirmPassword} placeholderText={confirmPasswordPlaceholder} onChangeText={handleConfirmPasswordChange} isPassword={true} />
            <PrimaryButton
                title={registerButtonTitle}
                onPress={handleRegisterPress}
                disabled={disabledSubmit}
            />
            <SecondaryButton
                title={loginButtonTitle}
                onPress={handleLoginPress}
            />
        </View>
    );
}