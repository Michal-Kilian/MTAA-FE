import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../Styles/Colors';
import { GlobalStyles } from '../Styles/GlobalStyles';
import React, { useContext } from 'react';
import { AppSettings } from '../AppSettings';

interface ListContainerProps {
    listArray: Array<ListItem>,
    showEuro: boolean
};

interface ListItem {
    name: string,
    description: string,
    amount: number
};

export function ListContainer({ listArray, showEuro }: ListContainerProps) {
    const { appSettings } = useContext(AppSettings);
    const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
    const amountCircleColor = appSettings.darkMode ? GlobalStyles.amountCircleColorDark : GlobalStyles.amountCircleColor;
    const finesTextColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;

    const teammateNumberTitle = appSettings.slovakLanguage ? "Číslo hráča: " : "Teammate number: ";

    return (
        <>
            {listArray.map((item, index: number) => (
                <View key={index} style={styles.finesItem}>
                    <View style={[styles.amountCircle, shadowStyle, amountCircleColor]}>
                        {showEuro ? (
                            <Text style={[styles.finesContainerAmount, finesTextColor]}>{item.amount}€</Text>
                        ) : (
                            <Text style={[styles.finesContainerAmount, finesTextColor]}>{item.name.charAt(0)}</Text>
                        )}
                    </View>
                    <View style={styles.finesInfo}>
                        <Text style={[styles.finesContainerName, finesTextColor]}>{item.name}</Text>
                        {showEuro ? (
                            <Text style={finesTextColor}>{item.description}</Text>
                        ) : (
                            <Text style={finesTextColor}>{teammateNumberTitle} {item.description}</Text>
                        )}
                    </View>
                </View>
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    finesItem: {
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