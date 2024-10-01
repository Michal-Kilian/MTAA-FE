import { Text, View } from 'react-native';
import { colors } from '../Styles/Colors';
import React, { useContext } from 'react';
import { AppSettings } from '../AppSettings';
import { GlobalStyles } from '../Styles/GlobalStyles';

interface PageTitleTextProps {
    textString: string;
}

export function PageTitleText({ textString }: PageTitleTextProps) {
    const { appSettings } = useContext(AppSettings);
    const mainTextStyle = appSettings.darkMode ? GlobalStyles.mainTextDark : GlobalStyles.mainText;

    return (
        <View>
            <Text style={mainTextStyle}>{ textString }</Text>
        </View>
    )
}