import { StyleSheet } from 'react-native';

export const textColor = '#bfbfbf';

export const primaryColor = '#000f2F';
export const primaryAccent = '#3A0A45';

export const secondaryColor = '#001F3F';
export const secondaryAccent = '#5A2D81';

export const errorColor = '#990606';

export default StyleSheet.create({
    flex: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    flexRow: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    flexTop: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
    },
    background: {
        backgroundColor: primaryColor
    },
    foreground: {
        backgroundColor: secondaryColor,
        fontFamily: 'NotoSans'
    },
    input: {
        width: '70%',
        marginTop: 15,
        borderWidth: 1,
        padding: 5,
        paddingLeft: 10,
        borderRadius: 6,
        backgroundColor: primaryAccent
    },
    container: {
        backgroundColor: secondaryColor,
        borderColor: primaryColor,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        shadowColor: 'black',
        elevation: 5
    },
    errorBox: {
        backgroundColor: errorColor,
        borderColor: textColor,
        color: textColor,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        width: '70%',
        elevation: 3
    },
    text: {
        fontFamily: 'NotoSans',
        color: textColor,
        fontSize: 15
    },
    largeText: {
        fontFamily: 'NotoSans',
        color: textColor,
        fontSize: 20
    },
    largerText: {
        fontFamily: 'NotoSans',
        color: textColor,
        fontSize: 22
    },
    headerText: {
        fontFamily: "NotoSansBold",
        color: textColor,
        fontSize: 40
    },
    paragraph: {
        marginBottom: 20,
        marginTop: 5
    },
    bold: {
        fontWeight: 700
    },
    button: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 3,
        marginBottom: 3,
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        borderColor: primaryAccent,
        backgroundColor: secondaryAccent
    },
    subtleButton: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 4,
        marginTop: 15,
        alignItems: 'center',
        borderColor: primaryColor,
        backgroundColor: secondaryColor
    }
});




