import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GlobalStyles } from './Styles/GlobalStyles';
import { PageTitleText } from './Components/PageTitleText';
import { InputTextField } from './Components/InputTextField';
import { InputNumberField } from './Components/InputNumberField'
import { AppSettings } from './AppSettings';
import { colors } from './Styles/Colors';
import { SubmitContainer } from './Containers/SubmitContainer';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { PrimaryButton } from './Components/PrimaryButton';
import { fetchTeammates } from '../Api/FetchTeammates';
import { fetchFinesList } from '../Api/FetchFinesList';


interface Fine {
    id: string;
    name: string;
    amount: number;
    description: string;
};

export const CreatePriceList = () => {
    const [priceList, setPriceList] = useState<Array<Fine>>([]);
    const [initialPriceList, setInitialPriceList] = useState<Array<Fine>>([]);

    const [fineTitle, setFineTitle] = useState<string>('');
    const [fineDescription, setFineDescription] = useState<string>('');
    const [finePrice, setFinePrice] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(true);
    const [addDisabled, setAddDisabled] = useState<boolean>(true);

    const navigation = useNavigation();

    const { appSettings, setAppSettings } = useContext(AppSettings);
    const isFocused = useIsFocused();

    const createPriceListTitle = appSettings.slovakLanguage ? "Vytvoriť cenník tímu" : "Create a price list";
    const priceListTitle = appSettings.slovakLanguage ? "Cenník" : "Price list";
    const fineTitlePlaceholder = appSettings.slovakLanguage ? "Názov pokuty" : "Fine title";
    const fineDescriptionPlaceholder = appSettings.slovakLanguage ? "Popis pokuty" : "Fine description";
    const finePricePlaceholder = appSettings.slovakLanguage ? "Cena pokuty" : "Fine price";
    const addFineButtonTitle = appSettings.slovakLanguage ? "Pridať do cenníka" : "Add to your price list"
    const yourPriceListTitle = appSettings.slovakLanguage ? "Tvoj cenník" : "Your price list";
    const deleteFineTitle = appSettings.slovakLanguage ? "Zmazať" : "Delete";
    const noFinesYetAdminTitle = appSettings.slovakLanguage ? "Zatiaľ žiadne položky" : "No items yet available";
    const noFinesYetUserTitle = appSettings.slovakLanguage ? "Admin tvojho tímu ešte nevytvoril cenník" : "Admin of your team has not created a price list yet";
    const optional = appSettings.slovakLanguage ? " (nepovinné)" : " (optional)";
    const backTitle = appSettings.slovakLanguage ? "Späť" : "Back";

    const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;
    const textColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;
    const buttonStyle = appSettings.darkMode ? GlobalStyles.primaryButtonDark : GlobalStyles.primaryButton;
    const buttonTextStyle = appSettings.darkMode ? GlobalStyles.primaryButtonTextDark : GlobalStyles.primaryButtonText;
    const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
    const inputFieldStyle = appSettings.darkMode ? GlobalStyles.inputFieldDark : GlobalStyles.inputField;
    const placeholderColor = appSettings.darkMode ? colors.placeholderDark : colors.placeholder;
    const amountCircleColor = appSettings.darkMode ? GlobalStyles.amountCircleColorDark : GlobalStyles.amountCircleColor;
    const finesTextColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;
    const backgroundColorPrimary = appSettings.darkMode ? GlobalStyles.backgroundColorPrimaryDark : GlobalStyles.backgroundColorPrimary;
    const primaryTextColor = appSettings.darkMode ? GlobalStyles.primaryTextColorDark : GlobalStyles.primaryTextColor;

    const currentTeamId = appSettings.userLastTeamId;
    const userId = appSettings.userId;

    useEffect(() => {
        if (isFocused) {
            isAdminFetch();
            initFines();
        }
    }, [isFocused]);

    const initFines = async () => {
        const fines: Fine[] = await fetchFinesList(currentTeamId);
        if (fines) {
            setAppSettings((prevSettings) => ({
                ...prevSettings,
                userFinesList: fines,
            }));

            setInitialPriceList(fines);
            setPriceList(fines);
        };
    };

    const isAdminFetch = async () => {
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/user/status/?team_id=' + currentTeamId + '&user_id=' + userId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (data) {
                console.log('User status fetch successful');
                setIsAdmin(data[0].user_role === "admin");
            } else {
                console.log('No status available');
                setIsAdmin(false);
            }
        } catch {
            console.log("Error fetching status");
            setIsAdmin(false);
        };
    };

    const handleTitleChange = (value: string) => {
        setAddDisabled(value === '' || finePrice === '');
        setFineTitle(value);
    };

    const handlePriceChange = (value: string) => {
        setAddDisabled(fineTitle === '' || value === '');
        setFinePrice(value);
    };

    const addFine = () => {
        setPriceList([...priceList, { id: 'tempId', name: fineTitle, description: fineDescription, amount: parseInt(finePrice) }]);

        setAddDisabled(true);
        setFineTitle('');
        setFineDescription('');
        setFinePrice('');
    };

    const deleteFine = (index: number) => {
        let fineToDelete = priceList[index];

        let filteredPriceList = priceList.filter(fine => fine.name !== fineToDelete.name
            && fine.amount !== fineToDelete.amount);

        setPriceList(filteredPriceList);
    };

    const handleSubmit = async () => {
        const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/fines?team_id=${currentTeamId}`;

        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                team_id: currentTeamId
            }),
        });

        priceList.map(async fine => {
            console.log('sending data:', currentTeamId, fine.name, fine.description, fine.amount);

            await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/fines/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    team_id: currentTeamId,
                    name: fine.name,
                    description: fine.description,
                    amount: fine.amount
                }),
            });
        });

        try {
            const ws = appSettings.ws;
            const teammates = await fetchTeammates(currentTeamId);

            teammates.forEach(async (teammate: { id: string, name: string }) => {
                if (teammate.id !== userId) {
                    const newPriceListObject = {
                        type: "priceList",
                        user_id: teammate.id,
                    };
                    if (ws) {
                        ws.send(JSON.stringify(newPriceListObject));
                    }
                    console.log("Sending price list to:", teammate.id);
                }
            });
        } catch (error) {
            console.log(error);
        };

        setAppSettings((prevSettings) => ({
            ...prevSettings,
            userFinesList: priceList,
        }));

        console.log('Fine creation successful');

        setFineTitle('');
        setFineDescription('');
        setFinePrice('');

        navigation.navigate('Fines' as never);
    };

    const handleCancel = () => {
        navigation.goBack();
        setFineTitle('');
        setFineDescription('');
        setFinePrice('');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={containerStyle}>
            <PageTitleText textString={isAdmin ? createPriceListTitle : priceListTitle} />
            {isAdmin && (
                <>
                    <InputTextField stateValue={fineTitle} placeholderText={fineTitlePlaceholder} onChangeText={handleTitleChange} />
                    <InputTextField stateValue={fineDescription} placeholderText={fineDescriptionPlaceholder + optional} onChangeText={setFineDescription} />
                    <InputNumberField stateValue={finePrice} placeholderText={finePricePlaceholder} onChangeNumber={handlePriceChange} />
                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            disabled={addDisabled}
                            onPress={addFine}
                            title={addFineButtonTitle}
                        >
                        </PrimaryButton>
                    </View>
                    <Text style={[styles.yourPriceList, textColor]}>{yourPriceListTitle}</Text>
                </>
            )}
            <ScrollView style={styles.finesContainer}>
                {priceList && priceList.length > 0 ? (
                    priceList.map((fine: { name: string, description: string, amount: number }, index: number) => (
                        <View key={index} style={styles.finesItem}>
                            <View style={[[styles.amountCircle, shadowStyle, amountCircleColor]]}>
                                <Text style={[styles.finesContainerAmount, finesTextColor]}>{fine.amount}€</Text>
                            </View>
                            <View style={styles.finesInfo}>
                                <Text style={[styles.finesContainerName, finesTextColor]}>{fine.name}</Text>
                                <Text style={[finesTextColor]}>{fine.description}</Text>
                            </View>
                            {isAdmin && <View>
                                <TouchableOpacity onPress={() => deleteFine(index)}>
                                    <Text style={textColor}>{deleteFineTitle}</Text>
                                </TouchableOpacity>
                            </View>}
                        </View>
                    ))
                ) : (
                    <Text style={[styles.noFinesYet, textColor]}>{isAdmin ? noFinesYetAdminTitle : noFinesYetUserTitle}</Text>
                )}
            </ScrollView>
            {isAdmin ?
                <SubmitContainer onSubmit={handleSubmit} onCancel={handleCancel} disabledSubmit={priceList === initialPriceList} />
                : <View style={styles.backButtonContainer}>
                    <TouchableOpacity
                        style={[styles.button, shadowStyle, backgroundColorPrimary]}
                        onPress={handleBackPress}
                    >
                        <Text style={[styles.buttonText, primaryTextColor]}>{backTitle}</Text>
                    </TouchableOpacity>
                </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    disabledButton: {
        opacity: 0.2
    },
    buttonText: {
        color: colors.primaryText,
        fontSize: 16,
        fontWeight: 'bold',
    },
    finesContainer: {
        marginTop: 20,
        width: '85%',
        height: 100,
        //borderWidth: 2,
        marginBottom: 100
    },
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
    yourPriceList: {
        fontWeight: '500',
        marginTop: 50,
    },
    noFinesYet: {
        textAlign: 'center',
    },
    button: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        borderRadius: 50
    },
    backButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
    },
});