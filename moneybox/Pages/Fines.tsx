import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SearchContainer } from './Containers/SearchContainer';
import { ListContainer } from './Containers/ListContainer';
import { PageTitleText } from './Components/PageTitleText';
import { NavigationContainer } from './Containers/NavigationContainer';
import { GlobalStyles } from './Styles/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { AppSettings } from './AppSettings';
import { fetchFines } from '../Api/FetchFines';
import { useIsFocused } from '@react-navigation/native';

export function Fines() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { appSettings, setAppSettings } = useContext(AppSettings);

    const finesTitle = appSettings.slovakLanguage ? "Pokuty" : "Fines";
    const noFinesTitle = appSettings.slovakLanguage ? "Nie sú k dispozícii žiadne pokuty" : "No fines available";

    const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;
    const textColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;

    useEffect(() => {
        if (isFocused) {
            initFines();
        }
    }, [isFocused]);

    const initFines = async () => {
        const currentTeamId = appSettings.userLastTeamId;
        const userId = appSettings.userId;
        const fines = await fetchFines(currentTeamId, userId);
        if (fines) {
            setAppSettings((prevSettings) => ({
                ...prevSettings,
                userTeamFines: fines,
            }));
        }
    };
    const finesArray = appSettings.userTeamFines;

    const handleAssignFinePress = () => {
        navigation.navigate('AssignFine' as never);
    };

    return (
        <NavigationContainer>
            <ScrollView>
                <View style={containerStyle}>
                    <PageTitleText textString={finesTitle} />
                    <SearchContainer onPress={handleAssignFinePress} />
                    {finesArray.length > 0 ?
                        <View style={styles.finesContainer}>
                            <ListContainer listArray={finesArray} showEuro={true} />
                        </View>
                        :
                        <Text style={[textColor, styles.noFines]}>
                            {noFinesTitle}
                        </Text>
                    }
                </View>
            </ScrollView>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    noFines: {
        marginTop: 30,
    },
    finesContainer: {
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
});
