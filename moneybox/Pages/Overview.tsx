import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { GlobalStyles } from './Styles/GlobalStyles';
import { PageTitleText } from './Components/PageTitleText';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from './Containers/NavigationContainer';
import { AppSettings } from './AppSettings';
import React, { useContext, useEffect, useState } from 'react';
import { colors } from './Styles/Colors';
import { ListContainer } from './Containers/ListContainer';
import { useIsFocused } from '@react-navigation/native';

const isTabletWidth = () => {
    const { height, width } = Dimensions.get('window');
    return width >= 600;
};

const isTabletHeight = () => {
    const { height, width } = Dimensions.get('window');
    return height >= 1000;
};

const isTablet = () => {
    const { height, width } = Dimensions.get('window');
    const smallerDimension = Math.min(height, width);
    return smallerDimension >= 600;
};

interface Payer {
    id: string,
    name: string,
    surname: string,
    amount: number,
    count: number
};

interface Fine {
    id: string,
};


export function Overview() {
    const navigation = useNavigation();
    const { appSettings } = useContext(AppSettings);
    const isFocused = useIsFocused();

    const [topPayer, setTopPayer] = useState<Payer>();
    const [bottomPayer, setBottomPayer] = useState<Payer>();

    const currentTeamId = appSettings.userLastTeamId;

    useEffect(() => {
        const fetchStats = async (endpoint: string) => {
            try {
                const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + endpoint + `?team_id=${currentTeamId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (endpoint === '/overview/top-payer') {
                        console.log('top-payer:', data);
                        setTopPayer(data);
                    }
                    else {
                        console.log('bottom-payer:', data);
                        setBottomPayer(data);
                    };
                };

            } catch (e) {
                console.log('e:', e);
            }
        };

        if (isFocused) {
            fetchStats('/overview/top-payer');
            fetchStats('/overview/bottom-payer');
        }
    }, [isFocused]);

    const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
    const primaryTextColor = appSettings.darkMode ? GlobalStyles.primaryTextColorDark : GlobalStyles.primaryTextColor;
    const backgroundColorPrimary = appSettings.darkMode ? GlobalStyles.backgroundColorPrimaryDark : GlobalStyles.backgroundColorPrimary;
    const placeholderTextColor = appSettings.darkMode ? colors.placeholderDark : colors.placeholder;
    const amountCircleColor = appSettings.darkMode ? GlobalStyles.amountCircleColorDark : GlobalStyles.amountCircleColor;
    const finesTextColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;

    const overviewTitle = appSettings.slovakLanguage ? "Prehľad mesiaca" : "Monthly overview";
    const topPayerTitle = appSettings.slovakLanguage ? "Najviac minul na pokuty" : "Most paid for fines";
    const bottomPayerTitle = appSettings.slovakLanguage ? "Najmenej minul na pokuty" : "Least paid for fines";
    const backTitle = appSettings.slovakLanguage ? "Späť" : "Back";
    const finesCountTitle = appSettings.slovakLanguage ? "Počet pokút" : "Fines count";
    const noFinesYet = appSettings.slovakLanguage ? "Ešte neboli zadané žiadne pokuty" : "No fines available";

    const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={containerStyle}>
            <PageTitleText textString={overviewTitle}></PageTitleText>
            {topPayer && bottomPayer ?
                (
                    <>
                        <View style={styles.statisticsContainer}>
                            <Text style={styles.statisticsLabel}>{topPayerTitle}</Text>
                            <View style={styles.statsItem}>
                                <View style={[styles.amountCircle, shadowStyle, amountCircleColor]}>
                                    <Text style={[styles.finesContainerAmount, finesTextColor]}>{topPayer.amount}€</Text>
                                </View>
                                <View style={styles.finesInfo}>
                                    <Text style={[styles.finesContainerName, finesTextColor]}>{topPayer.name} {topPayer.surname}</Text>
                                    <Text style={finesTextColor}>{finesCountTitle}: {topPayer.count}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.statisticsContainer}>
                            <Text style={styles.statisticsLabel}>{bottomPayerTitle}</Text>
                            <View style={styles.statsItem}>
                                <View style={[styles.amountCircle, shadowStyle, amountCircleColor]}>
                                    <Text style={[styles.finesContainerAmount, finesTextColor]}>{bottomPayer.amount}€</Text>
                                </View>
                                <View style={styles.finesInfo}>
                                    <Text style={[styles.finesContainerName, finesTextColor]}>{bottomPayer.name} {bottomPayer.surname}</Text>
                                    <Text style={finesTextColor}>{finesCountTitle}: {bottomPayer.count}</Text>
                                </View>
                            </View>
                        </View>
                    </>
                ) : <Text style={{ color: placeholderTextColor, textAlign: 'center' }}>{noFinesYet}</Text>
            }
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, shadowStyle, backgroundColorPrimary]}
                    onPress={handleBackPress}
                >
                    <Text style={[styles.buttonText, primaryTextColor]}>{backTitle}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statisticsContainer: {
        width: '85%',
        marginBottom: 20
    },
    statisticsLabel: {
        color: 'gray',
        marginBottom: 20,
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: '5%',
        left: isTablet() ? '20%' : '5%',
        right: isTablet() ? '20%' : '5%',
    },
    button: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        width: '55%',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginLeft: 25,
        marginRight: 25,
    },
    amountCircle: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    finesInfo: {
        flex: 1,
        flexDirection: 'column',
    },
    finesContainerName: {
        fontWeight: 'bold',
    },
    finesContainerAmount: {
        fontWeight: 'bold',
    },
});