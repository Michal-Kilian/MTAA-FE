import { StyleSheet, View, Switch, ActivityIndicator } from "react-native";
import { GlobalStyles } from "../Styles/GlobalStyles";
import React, { useState, useContext } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from "../Styles/Colors";
import { AppSettings } from '../AppSettings';

export const ModeSwitch = () => {
    const { appSettings, setAppSettings } = useContext(AppSettings);
    const [loading, setLoading] = useState(false);

    const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
    const switchColor = appSettings.darkMode ? colors.primaryDark : colors.primary;
    const icon = appSettings.darkMode ? GlobalStyles.iconDark : GlobalStyles.icon;

    const toggleSwitch = async () => {
        try {
            setLoading(true);
            const currentStatus: boolean = appSettings.darkMode;
            const userId: string = appSettings.userId;
            const toChangeStatus: string = (!currentStatus).toString();

            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/darkmode', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    darkmode: toChangeStatus,
                    user_id: userId,
                }),
            });

            if (response.ok) {
                console.log('Darkmode change successful');
                setAppSettings(prevSettings => ({ ...prevSettings, darkMode: !prevSettings.darkMode }));
            } else {
                console.log('Darkmode change failed');
            }
        } catch (error) {
            console.error("Error updating Dark mode:", error);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <MaterialIcons name={appSettings.darkMode ? 'dark-mode' : 'light-mode'} size={32} color={'black'} style={[styles.icon, shadowStyle, icon]} />
            <Switch
                trackColor={{ false: 'white', true: 'white' }}
                thumbColor={switchColor}
                onValueChange={toggleSwitch}
                value={appSettings.darkMode}
                style={[styles.switch, shadowStyle]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switch: {
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    },
    icon: {
        marginRight: 15,
    },
});