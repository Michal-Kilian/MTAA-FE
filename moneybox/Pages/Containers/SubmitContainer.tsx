import React, { useContext } from 'react';
import { StyleSheet, Dimensions, Text, TouchableOpacity, View, DrawerLayoutAndroid } from 'react-native';
import { colors } from '../Styles/Colors';
import { GlobalStyles } from '../Styles/GlobalStyles';
import { AppSettings } from '../AppSettings';

const isTablet = () => {
    const { height, width } = Dimensions.get('window');
    const smallerDimension = Math.min(height, width);
    return smallerDimension >= 600;
};

interface SubmitContainerProps {
  onSubmit: () => void,
  onCancel: () => void,
  disabledSubmit?: boolean
}

export function SubmitContainer({ onSubmit, onCancel, disabledSubmit }: SubmitContainerProps) {
  const { appSettings } = useContext(AppSettings);

  const confirmButtonTitle = appSettings.slovakLanguage ? "Potvrdiť" : "Confirm";
  const cancelButtonTitle = appSettings.slovakLanguage ? "Zrušiť" : "Cancel";

  const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
  const primaryTextColor = appSettings.darkMode ? GlobalStyles.primaryTextColorDark : GlobalStyles.primaryTextColor;
  const backgroundColorPrimary = appSettings.darkMode ? GlobalStyles.backgroundColorPrimaryDark : GlobalStyles.backgroundColorPrimary;

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, styles.leftButton, shadowStyle, backgroundColorPrimary, disabledSubmit && styles.disabledButton]}
        onPress={onSubmit}
        disabled={disabledSubmit}>
        <Text style={[styles.buttonText, primaryTextColor]}>{confirmButtonTitle}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.rightButton, shadowStyle, backgroundColorPrimary]} onPress={onCancel}>
        <Text style={[styles.buttonText, primaryTextColor]}>{cancelButtonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: '5%',
    left: isTablet() ? '25%' : '5%',
    right: isTablet() ? '25%' : '5%',
  },
  button: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    width: '43%',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    marginLeft: 20,
  },
  rightButton: {
    width: '43%',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.4
  },
}); 
