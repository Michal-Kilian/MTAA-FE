import React, { useRef, ReactNode, useContext } from 'react';
import { StyleSheet, Dimensions, Text, TouchableOpacity, View, DrawerLayoutAndroid, PanResponder, Animated } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { colors } from '../Styles/Colors';
import { GlobalStyles } from '../Styles/GlobalStyles';
import { Octicons } from '@expo/vector-icons';
import { Menu } from '../Menu';
import { AppSettings } from '../AppSettings';

const isTablet = () => {
  const { height, width } = Dimensions.get('window');
  const smallerDimension = Math.min(height, width);
  return smallerDimension >= 600;
};

interface NavigationContainerProps {
  children: ReactNode;
}

export function NavigationContainer({ children }: NavigationContainerProps) {
  const navigation = useNavigation();
  const drawerRef = useRef<DrawerLayoutAndroid>(null);
  const isFocused = useIsFocused();
  const { appSettings } = useContext(AppSettings);

  const finesTitleButton = appSettings.slovakLanguage ? "Pokuty" : "Fines";
  const teammatesTitleButton = appSettings.slovakLanguage ? "Spoluhráči" : "Teammates";

  const shadowStyle = appSettings.darkMode ? GlobalStyles.shadowDark : GlobalStyles.shadow;
  const primaryTextColor = appSettings.darkMode ? GlobalStyles.primaryTextColorDark : GlobalStyles.primaryTextColor;
  const mainContainer = appSettings.darkMode ? GlobalStyles.mainContainerDark : GlobalStyles.mainContainer;
  const backgroundColorPrimary = appSettings.darkMode ? GlobalStyles.backgroundColorPrimaryDark : GlobalStyles.backgroundColorPrimary;
  const iconColor = appSettings.darkMode ? colors.primaryTextDark : colors.primaryText;

  const handleHomePress = () => {
    drawerRef.current?.openDrawer();
  };

  const handleTeammatesPress = () => {
    navigation.navigate('Teammates' as never);
  };

  const handleFinesPress = () => {
    navigation.navigate('Fines' as never);
  };

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) => Math.abs(gestureState.dx) > 10, // Detect horizontal movements
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          drawerRef.current?.openDrawer();
          pan.setValue({ x: 0, y: 0 });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const panStyle = {
    transform: pan.getTranslateTransform(),
  };

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={() => <Menu />}
      drawerLockMode="unlocked"
      style={mainContainer}
      key={isFocused}
    >
      {children}
      <Animated.View
        style={[styles.draggableContainer, panStyle]}
        {...panResponder.panHandlers}
      >
        <View style={styles.draggableHandle} />
      </Animated.View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.leftButton, shadowStyle, backgroundColorPrimary]} onPress={handleFinesPress}>
          <Text style={[styles.buttonText, primaryTextColor]}>{finesTitleButton}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.middleButton, shadowStyle, backgroundColorPrimary]} onPress={handleHomePress}>
          <Octicons
            name='home'
            size={20}
            color={iconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.rightButton, shadowStyle, backgroundColorPrimary]} onPress={handleTeammatesPress}>
          <Text style={[styles.buttonText, primaryTextColor]}>{teammatesTitleButton}</Text>
        </TouchableOpacity>
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  middleButton: {
    width: '17%',
  },
  leftButton: {
    width: '35%',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    marginRight: 5,
    marginLeft: 20,
  },
  rightButton: {
    width: '35%',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    marginRight: 20,
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  draggableContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 90,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: '58%',
    width: '20%'
  },
  draggableHandle: {
    width: 100,
    height: '55%',
    borderRadius: 5,
  },
});
