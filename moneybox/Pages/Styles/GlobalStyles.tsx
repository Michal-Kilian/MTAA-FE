import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './Colors';

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

export const GlobalStyles = StyleSheet.create({
    shadow: {
        elevation: 3,
        shadowColor: colors.shadow,
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    shadowDark: {
        elevation: 3,
        shadowColor: colors.shadowDark,
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    mainContainer: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: isTablet() ? 'center ': 'flex-start',
        paddingHorizontal: isTabletWidth() ? '20%' : '5%',
        paddingVertical: '5%',
    },

    mainContainerDark: {
        flex: 1,
        backgroundColor: colors.backgroundDark,
        alignItems: 'center',
        justifyContent: isTablet() ? 'center ': 'flex-start',
        paddingHorizontal: isTabletWidth() ? '20%' : '5%',
        paddingVertical: '5%',
    },

    primaryButton: {
        width: '85%',
        height: 50,
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 10,
    },

    primaryButtonDark: {
        width: '85%',
        height: 50,
        backgroundColor: colors.primaryDark,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 10,
    },

    primaryButtonText: {
        color: colors.primaryText,
        fontSize: 16,
        fontWeight: 'bold',
    },

    primaryButtonTextDark: {
        color: colors.primaryTextDark,
        fontSize: 16,
        fontWeight: 'bold',
    },

    inputField: {
        width: '85%',
        height: 40,
        paddingLeft: 10,
        borderRadius: 10,
        backgroundColor: colors.backgroundInput,
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 10,
    },

    inputFieldDark: {
        width: '85%',
        height: 40,
        paddingLeft: 10,
        borderRadius: 10,
        backgroundColor: colors.backgroundInputDark,
        color: colors.placeholderDark,
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 10,
    },

    mainText: {
        color: colors.secondaryText,
        marginTop: 75,
        marginBottom: 50,
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 26,
    },

    mainTextDark: {
        color: colors.secondaryTextDark,
        marginTop: 75,
        marginBottom: 50,
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 26,
    },

    buttonText: {
        color: colors.secondaryText,
        fontSize: 16,
        fontWeight: 'bold',
    },

    buttonTextDark: {
        color: colors.secondaryTextDark,
        fontSize: 16,
        fontWeight: 'bold',
    },

    amountCircleColor: {
        backgroundColor: colors.backgroundInput,
    },

    amountCircleColorDark: {
        backgroundColor: colors.backgroundInputDark,
    },

    finesContainerTextColor: {
        color: colors.secondaryText,
    },

    finesContainerTextColorDark: {
        color: colors.secondaryTextDark,
    },

    primaryTextColor: {
        color: colors.primaryText,
    },

    primaryTextColorDark: {
        color: colors.primaryText,
    },

    backgroundColorPrimary: {
        backgroundColor: colors.primary,
    },

    backgroundColorPrimaryDark: {
        backgroundColor: colors.primaryDark,
    },

    iconDark: {
        color: 'white',
    },

    icon: {
        color: 'black',
    },

    cardBackground: {
        backgroundColor: '#D9D9D9'
    },
    cardBackgroundDark: {
        backgroundColor: colors.primaryDark,
    },

    selectedTeamCardBorder: {
        borderColor: 'black'
    },

    selectedTeamCardBorderDark: {
        borderColor: 'white'
    },

    notSelectedTeamCardBorder: {
        borderColor: '#D9D9D9'
    },
    notSelectedTeamCardBorderDark: {
        borderColor: 'black'
    },
});