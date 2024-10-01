import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { colors } from '../Styles/Colors';
import { GlobalStyles } from '../Styles/GlobalStyles';
import { AppSettings } from '../AppSettings';

interface SearchContainerProps {
    onPress: () => void
}

export function SearchContainer({onPress}: SearchContainerProps) {
    const [searchText, setSearchText] = useState('');
    const { appSettings } = useContext(AppSettings);

    const searchButtonTitle = appSettings.slovakLanguage ? "Hladať" : "Search";
    const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
    const backgroundInputColor = appSettings.darkMode ? GlobalStyles.amountCircleColorDark : GlobalStyles.amountCircleColor;

    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={[styles.searchBar, shadowStyle, backgroundInputColor]}
                placeholder={searchButtonTitle}
                placeholderTextColor={colors.placeholder}
                value={searchText}
                onChangeText={setSearchText}
            />
            <TouchableOpacity style={[styles.circleButton, shadowStyle, backgroundInputColor]} onPress={onPress}>
                <Text style={styles.circleButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
        searchContainer: {
           flexDirection: 'row',
           alignItems: 'center',
        },
        searchBar: {
            width: '80%',
            height: 40,
            paddingLeft: 10,
            borderRadius: 20,
            marginRight: 10,
            marginLeft: 25,
        },
        circleButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 25,
        },
        circleButtonText : {
            color: colors.placeholder,
        },
  });