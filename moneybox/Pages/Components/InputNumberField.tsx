import { StyleSheet, TextInput, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { colors } from '../Styles/Colors';
import { GlobalStyles } from '../Styles/GlobalStyles';
import { AppSettings } from '../AppSettings';

interface InputNumberFieldProps {
    placeholderText: string,
    onChangeNumber: (value: string) => void,
    stateValue: string
}

export function InputNumberField({ placeholderText, onChangeNumber, stateValue }: InputNumberFieldProps) {
   const [searchText, setSearchText] = useState('');
   const { appSettings } = useContext(AppSettings);

   const inputFieldStyle = appSettings.darkMode ? GlobalStyles.inputFieldDark : GlobalStyles.inputField;
   const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
   const placeholderColor = appSettings.darkMode ? colors.placeholderDark : colors.placeholder;

    return (
        <View style={styles.inputContainer}>
            <TextInput
                keyboardType='numeric'
                style={[[inputFieldStyle, shadowStyle]]}
                placeholder={placeholderText}
                placeholderTextColor={colors.placeholder}
                onChangeText={onChangeNumber}
                value={stateValue}
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