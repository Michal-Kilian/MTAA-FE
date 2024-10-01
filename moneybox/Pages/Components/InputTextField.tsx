import { StyleSheet, TextInput, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { colors } from '../Styles/Colors';
import { GlobalStyles } from '../Styles/GlobalStyles';
import { AppSettings } from '../AppSettings';

interface InputTextFieldProps {
    placeholderText: string,
    onChangeText: (value: string) => void,
    stateValue: string,
    isPassword?: boolean
}

export function InputTextField({ placeholderText, onChangeText, stateValue, isPassword }: InputTextFieldProps) {
    const { appSettings } = useContext(AppSettings);

    const inputFieldStyle = appSettings.darkMode ? GlobalStyles.inputFieldDark : GlobalStyles.inputField;
    const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
    const placeholderColor = appSettings.darkMode ? colors.placeholderDark : colors.placeholder;

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[inputFieldStyle, shadowStyle]}
                placeholder={placeholderText}
                placeholderTextColor={placeholderColor}
                onChangeText={onChangeText}
                value={stateValue}
                secureTextEntry={isPassword}
            >
            </TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});