import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SearchContainer } from './Containers/SearchContainer';
import { ListContainer } from './Containers/ListContainer';
import { PageTitleText } from './Components/PageTitleText';
import { NavigationContainer } from './Containers/NavigationContainer';
import { GlobalStyles } from './Styles/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { AppSettings } from './AppSettings';
import React, { useContext, useEffect } from 'react';
import { fetchTeammates } from '../Api/FetchTeammates';
import { useIsFocused } from '@react-navigation/native';

export function Teammates() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { appSettings, setAppSettings } = useContext(AppSettings);

    const userId = appSettings.userId;
    const currentTeamId = appSettings.userLastTeamId;

    useEffect(() => {
        if (isFocused) {
            if (appSettings.offline === false) {
                if (currentTeamId)
                    initTeammates();
                else {
                    setAppSettings((prevSettings) => ({
                        ...prevSettings,
                        userTeamTeammates: [],
                    }));
                }
            }
        }
    }, [isFocused]);

    const initTeammates = async () => {
        const teammates = await fetchTeammates(currentTeamId);
        if (teammates) {
            setAppSettings((prevSettings) => ({
                ...prevSettings,
                userTeamTeammates: teammates,
            }));
        }
    };

    const teammatesTitle = appSettings.slovakLanguage ? "Spoluhráči" : "Teammates";
    const noTeammatesTitle = appSettings.slovakLanguage ? "Nie sú k dispozícii žiadni spoluhráči" : "No teammates available";

    const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;
    const textColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;

    const handleAddTeammatePress = () => {
        navigation.navigate('AddTeammate' as never);
    }

    const teammatesArray = appSettings.userTeamTeammates;

    return (
        <NavigationContainer>
            <ScrollView>
                <View style={containerStyle}>
                    <PageTitleText textString={teammatesTitle} />
                    <SearchContainer onPress={handleAddTeammatePress} />
                    {teammatesArray.length > 0 ?
                        <View style={styles.finesContainer}>
                            <ListContainer listArray={teammatesArray} showEuro={false} />
                        </View>
                        :
                        <Text style={[textColor, styles.noTeammates]}>
                            {noTeammatesTitle}
                        </Text>
                    }
                </View>
            </ScrollView>
        </NavigationContainer >
    )
}

const styles = StyleSheet.create({
    noTeammates: {
        marginTop: 30,
    },

    finesContainer: {
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
});