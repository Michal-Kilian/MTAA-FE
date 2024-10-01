import React, { useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from './Styles/Colors';
import { GlobalStyles } from './Styles/GlobalStyles';
import { PageTitleText } from './Components/PageTitleText';
import { ModeSwitch } from './Components/ModeSwitch';
import { LanguageSwitch } from './Components/LanguageSwitch';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { TeamCard } from './Containers/TeamCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AppSettings } from './AppSettings';
import { fetchTeams } from '../Api/FetchTeams';

interface UserHistory {
  darkMode: boolean;
  slovakLanguage: boolean;
  userId: string;
  userName: string;
  userSurname: string;
  userEmail: string;
  userLastTeamId: string;
  userPassword: string;
  userTeams: any[];
  userTeamFines: any[];
  userTeamTeammates: any[];
  userInvitations: any[];
  userFinesList: any[];
}

export const Menu = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { appSettings, setAppSettings } = useContext(AppSettings);
  const teams = appSettings.userTeams;

  useEffect(() => {
    if (isFocused) {
      initTeams();
    }
  }, [isFocused]);

  const initTeams = async () => {
    const userId = appSettings.userId;
    const teams = await fetchTeams(userId);
    if (teams) {
      setAppSettings((prevSettings) => ({
        ...prevSettings,
        userTeams: teams,
      }));
    }
  };

  const teamsTitle = appSettings.slovakLanguage ? 'Tímy' : 'Teams';
  const noTeamsTitle = appSettings.slovakLanguage ? 'Nie sú k dispozícii žiadne tímy' : 'No teams available';

  const textColor = appSettings.darkMode ? GlobalStyles.finesContainerTextColorDark : GlobalStyles.finesContainerTextColor;

  const handleProfilePress = () => {
    navigation.navigate('Profile' as never);
  };

  const handlePriceListPress = () => {
    navigation.navigate('CreatePriceList' as never);
  };

  const handleCreateTeamPress = () => {
    navigation.navigate('CreateTeam' as never);
  };

  const handleLogout = () => {
    const history: UserHistory = [
      {
        darkMode: appSettings.darkMode,
        slovakLanguage: appSettings.slovakLanguage,
        userId: appSettings.userId,
        userName: appSettings.userName,
        userSurname: appSettings.userSurname,
        userEmail: appSettings.userEmail,
        userLastTeamId: appSettings.userLastTeamId,
        userPassword: appSettings.userPassword,
        userTeams: appSettings.userTeams,
        userTeamFines: appSettings.userTeamFines,
        userTeamTeammates: appSettings.userTeamTeammates,
        userInvitations: appSettings.userInvitations,
        userFinesList: appSettings.userFinesList,
      }
    ];

    setAppSettings((prevSettings) => ({
      ...prevSettings,
      darkMode: false,
      slovakLanguage: true,
      userId: "",
      userName: "",
      userSurname: "",
      userEmail: "",
      userLastTeamId: "",
      userPassword: "",
      userTeams: [],
      userTeamFines: [],
      userTeamTeammates: [],
      selectedInvitation: "",
      history: history,
    }));

    navigation.navigate('Login' as never);
  };

  const handleOverview = () => {
    navigation.navigate('Overview' as never);
  };

  const handleInvitations = () => {
    navigation.navigate('Invitations' as never);
  };

  const containerStyle = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;
  const backgroundColorPrimary = appSettings.darkMode ? GlobalStyles.backgroundColorPrimaryDark : GlobalStyles.backgroundColorPrimary;
  const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;

  const teamList = () => {
    return (
      <View style={styles.teamList}>
        {teams && teams.length > 0 ? <TeamCard teams={teams} invitation={false} /> :
          <Text style={[textColor]}>
            {noTeamsTitle}
          </Text>}
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      <PageTitleText textString={teamsTitle} />
      {teamList()}
      <View style={styles.switchContainer}>
        <ModeSwitch />
        <LanguageSwitch />
      </View>
      <View style={styles.upButtonContainer}>
        <TouchableOpacity
          style={[styles.button, shadowStyle, backgroundColorPrimary]}
          onPress={handleCreateTeamPress}
        >
          <AntDesign
            name="pluscircleo"
            color="white"
            size={22}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, shadowStyle, backgroundColorPrimary]}
          onPress={handleInvitations}
        >
          <Ionicons
            name="mail-outline"
            color="white"
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, shadowStyle, backgroundColorPrimary]}
          onPress={handleOverview}
        >
          <Ionicons
            name="bar-chart-outline"
            color="white"
            size={22}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.button, shadowStyle, backgroundColorPrimary]}
          onPress={handleProfilePress}
        >
          <AntDesign
            name="user"
            color="white"
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, shadowStyle, backgroundColorPrimary]}
          onPress={handlePriceListPress}
        >
          <Ionicons
            name="pricetags-outline"
            color="white"
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, shadowStyle, backgroundColorPrimary]}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            color="white"
            size={24}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  upButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  button: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    borderRadius: 50
  },
  buttonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 210,
    left: 0,
    right: 0
  },
  teamList: {
    height: '40%'
  }
});
