import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GlobalStyles } from '../Styles/GlobalStyles';
import { AppSettings } from '../AppSettings';

interface PrimaryButtonProps {
  onPress: () => void,
  title: string,
  disabled?: boolean
};

export function PrimaryButton({ onPress, title, disabled }: PrimaryButtonProps) {
  const { appSettings } = useContext(AppSettings);

  const buttonStyle = appSettings.darkMode ? GlobalStyles.primaryButtonDark : GlobalStyles.primaryButton;
  const buttonTextStyle = appSettings.darkMode ? GlobalStyles.primaryButtonTextDark : GlobalStyles.primaryButtonText;
  const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={onPress} style={[buttonStyle, shadowStyle, disabled && styles.disabledButton]} disabled={disabled}>
        <Text style={buttonTextStyle}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.4
  },
});
