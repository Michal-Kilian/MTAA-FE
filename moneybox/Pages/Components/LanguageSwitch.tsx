import React, { useContext } from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import Icon from 'react-native-ico-flags';
import { GlobalStyles } from '../Styles/GlobalStyles';
import { colors } from '../Styles/Colors';
import { AppSettings } from '../AppSettings';

export const LanguageSwitch: React.FC = () => {
  const { appSettings, setAppSettings } = useContext(AppSettings);

  const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
  const switchColor = appSettings.darkMode ? colors.primaryDark : colors.primary;

  const toggleSwitch = async () => {
    try {
      const currentStatus: boolean = appSettings.slovakLanguage;
      const userId: string = appSettings.userId;
      const toChangeStatus: string = (!currentStatus) ? "sk" : "eng";

      const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL + '/language', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: toChangeStatus,
          user_id: userId,
        }),
      });

      if (response.ok) {
        console.log('Language change successful');
        setAppSettings(prevSettings => ({ ...prevSettings, slovakLanguage: !prevSettings.slovakLanguage }));
      } else {
        console.log('Language change failed');
      }
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Icon
        name={appSettings.slovakLanguage ? 'slovakia' : 'united-kingdom'}
        height="32"
        width="32"
        style={[styles.icon, shadowStyle]}
      />
      <Switch
        trackColor={{ false: 'white', true: 'white' }}
        thumbColor={switchColor}
        onValueChange={toggleSwitch}
        value={appSettings.slovakLanguage}
        style={[styles.switch, shadowStyle]}
      />
    </View>
  );
};

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