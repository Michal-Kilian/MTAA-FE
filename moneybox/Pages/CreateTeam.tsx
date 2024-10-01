import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, PermissionsAndroid, ImageSourcePropType } from 'react-native';
import { GlobalStyles } from './Styles/GlobalStyles';
import { PageTitleText } from './Components/PageTitleText';
import { InputTextField } from './Components/InputTextField';
import * as ImagePicker from 'expo-image-picker';
import { SubmitContainer } from './Containers/SubmitContainer';
import { useNavigation } from '@react-navigation/native';
import { AppSettings } from './AppSettings';
import { colors } from './Styles/Colors';
import { fetchTeams } from '../Api/FetchTeams';
import * as Location from 'expo-location';

export const CreateTeam = () => {
    const [name, setName] = useState<string>('');
    const [logo, setLogo] = useState<string>('');
    const [logoBase64, setLogoBase64] = useState<ImagePicker.ImagePickerAsset>();
    const [disabledSubmit, setDisabledSubmit] = useState(true);

    const navigation = useNavigation();
    const { appSettings, setAppSettings } = useContext(AppSettings);
    const userId = appSettings.userId;

    const createTeamTitle = appSettings.slovakLanguage ? "Vytvoriť tím" : "Create a team";
    const teamNameTitle = appSettings.slovakLanguage ? "Názov tímu" : "Team name";
    const chooseLogoTitle = appSettings.slovakLanguage ? "Vybrať logo tímu" : "Choose team logo";
    const membersCountTitle = appSettings.slovakLanguage ? "Počet členov: " : "Members count: ";
    const teamPreviewTitle = appSettings.slovakLanguage ? "Náhľad tímu" : "Team preview";
    const locationPermissionDeniedTitle = appSettings.slovakLanguage ? "Prístup k lokalite bol odmietnutý" : "Permission to access location was denied";
    const errorFetchingCityNameTitle = appSettings.slovakLanguage ? "Názov mesta nebol zistený" : "Error fetching city name";
    const galleryPermissionTitle = appSettings.slovakLanguage ? "Prístup do galérie" : "Gallery permission";
    const galleryPermissionMessage = appSettings.slovakLanguage ? "Táto aplikácia si žiada prístup do galérie." : "This app needs access to your gallery to select images.";
    const noCityFoundTitle = appSettings.slovakLanguage ? "Mesto nebolo nájdené" : "No city found";

    const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;
    const inputFieldStyle = appSettings.darkMode ? GlobalStyles.inputFieldDark : GlobalStyles.inputField;
    const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
    const textColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;
    const cardBackground = appSettings.darkMode ? GlobalStyles.cardBackgroundDark : GlobalStyles.cardBackground;
    const placeholderColor = appSettings.darkMode ? colors.placeholderDark : colors.placeholder;
    const primaryTextColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;

    const [city, setCity] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg(locationPermissionDeniedTitle);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            reverseGeocode(location.coords.latitude, location.coords.longitude);
        })();
    }, []);

    const reverseGeocode = async (latitude: number, longitude: number) => {
        try {
            let address = await Location.reverseGeocodeAsync({ latitude, longitude });
            console.log(address);
            let city = address[0].country + ", " + address[0].region;
            setCity(city);
        } catch (error) {
            setErrorMsg(errorFetchingCityNameTitle);
            console.error(errorFetchingCityNameTitle, error);
        }
    };

    const handleImagePickerPress = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                {
                    title: galleryPermissionTitle,
                    message: galleryPermissionMessage,
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                imagePickerPress();
                console.log('Gallery permission granted');
            } else {
                console.log('Gallery permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const imagePickerPress = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
            base64: true
        });

        if (!result.canceled) {
            const logoPicked = result.assets[0];
            setDisabledSubmit(name === '' || logoPicked.uri === '');
            setLogo(logoPicked.uri);
            console.log(logoPicked);
            setLogoBase64(logoPicked);
        }
    };

    const handleNameChange = (value: string) => {
        setDisabledSubmit(value === '');
        setName(value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    image_base64: logoBase64?.base64,
                    userId: userId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const lastTeamId = data.id;
                const teams = await fetchTeams(userId);

                setName('');
                setLogo('');
                setLogoBase64(undefined);

                navigation.navigate('CreatePriceList' as never);

                setAppSettings((prevSettings) => ({
                    ...prevSettings,
                    userTeams: teams,
                    userLastTeamId: lastTeamId,
                }));

            } else if (response.status === 409) {
                console.log('Team already exists');
            } else {
                console.log('Team creation failed');
            }
        } catch (error) {
            console.error('An error occurred during team creation:', error);
        }
    };

    const handleCancel = () => {
        navigation.goBack();
        setName('');
        setLogo('');
        setLogoBase64(undefined);
    };

    return (
        <View style={containerStyle}>
            <PageTitleText textString={createTeamTitle} />
            <InputTextField stateValue={name} placeholderText={teamNameTitle} onChangeText={handleNameChange} />
            <TouchableOpacity onPress={handleImagePickerPress} style={[inputFieldStyle, shadowStyle]}>
                <Text style={styles.placeholder}>{logo ? logo : chooseLogoTitle}</Text>
            </TouchableOpacity>
            <Text style={[styles.teamPreviewText, primaryTextColor]}>
                {teamPreviewTitle}
            </Text>
            <TouchableOpacity
                style={[
                    styles.card,
                    shadowStyle,
                    cardBackground
                ]}
            >
                <Image
                    style={styles.teamLogo}
                    source={logo === '' ? undefined : { uri: logo }}
                    resizeMode="center"
                />
                <View style={styles.teamInfo}>
                    <Text style={[styles.teamName, textColor]}>{name || teamNameTitle}</Text>
                    <Text style={[styles.teammatesCount, textColor]}>{membersCountTitle} 1</Text>
                </View>
            </TouchableOpacity>
            {city ? <Text style={textColor}>{city}</Text> : <Text>{noCityFoundTitle}</Text>}
            <SubmitContainer
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                disabledSubmit={disabledSubmit}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    placeholder: {
        marginTop: 10,
        color: colors.placeholder
    },
    teamPreviewText: {
        marginBottom: 10
    },
    card: {
        width: '85%',
        height: 100,
        borderWidth: 2,
        borderRadius: 35,
        marginBottom: 25,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    teamLogo: {
        height: '100%',
        width: '42%',
        position: 'relative',
        left: 5,
        borderRadius: 35,
    },
    teamInfo: {
        width: '58%',
        justifyContent: 'center',
        marginLeft: 10
    },
    teamName: {
        fontWeight: '500',
        textAlign: 'left'
    },
    teammatesCount: {
        textAlign: 'left',
        fontSize: 12,
    },
});
