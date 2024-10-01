import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../Styles/Colors';
import { AppSettings } from '../AppSettings';
import { GlobalStyles } from '../Styles/GlobalStyles';
import React, { useContext } from 'react';

interface SecondaryButtonProps {
  onPress: () => void;
  title: string;
}

export function SecondaryButton({ onPress, title }: SecondaryButtonProps) {
  const { appSettings } = useContext(AppSettings);
  const buttonTextStyle = appSettings.darkMode ? GlobalStyles.buttonTextDark : GlobalStyles.buttonText;

  return (
    <View>
        <TouchableOpacity onPress={onPress}>
          <Text style={buttonTextStyle}>{title}</Text>
        </TouchableOpacity>
    </View>
  );
}
