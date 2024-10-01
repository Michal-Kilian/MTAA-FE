import { StyleSheet, TextInput, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { colors } from '../Styles/Colors';
import { GlobalStyles } from '../Styles/GlobalStyles';
import { AppSettings } from '../AppSettings';

interface InputFieldProps {
    placeholderText: string;
}

export function InputField({ placeholderText}: InputFieldProps) {
    const [searchText, setSearchText] = useState('');
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
                value={searchText}
                onChangeText={setSearchText}>
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