import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: "#5E76FA" ,
    },
    title: {
        flex: 1,
        color: 'white',
        alignItems: 'flex-start',
        fontSize: 20,
        fontWeight: 'bold',

    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },

    listview: {
        marginTop: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
        width: Dimensions.get('window').width,
        borderWidth: 3,
        borderRadius: 10,
        borderColor: "white",
    },
    text: {
        fontSize: 10,
    },
    flatList: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    accountNumber: {
        fontSize: 15,
        color: "blue",
    },
    accountDescription: {
        fontSize: 15,
        color: "blue",
    },
    accountCurrency: {
        fontSize: 15,
        color: "blue",
    },
    accountBalance: {
        fontSize: 15,
        color: "blue",
    },
    accountRow: {
        flexDirection: "row",
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    image: {
        borderWidth: 3,
        backgroundColor: 'black',
        marginTop: 30,
        resizeMode: 'cover',
        justifyContent: 'center',
        width: "100%",
        height: 190,
    },

    accountDetail : {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: Dimensions.get('window').width,
        borderWidth: 3,
        borderRadius: 10,
        borderColor: "white",
    }

});
