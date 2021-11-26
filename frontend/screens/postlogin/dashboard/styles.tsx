import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#5E76FA",
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
        backgroundColor: '#fff',
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

    background_image: {
        borderWidth: 3,
        marginTop: 20,
        width: "100%",
        height: 190,
    },
    avator: {
        marginLeft: 4,
        marginTop: 2,
        width: 72,
        height: 72,
        borderRadius: 40,
    },

    icon: {
        paddingVertical: 5,
    },

    accountSummarySection: {
        flexDirection: "column",
        backgroundColor: '#efefef',
        marginTop: 5,
        paddingVertical: 1,
        paddingHorizontal: 1,
        borderWidth: 3,
        borderRadius: 10,
        borderColor: "white",
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flex: 1,
    },

    accountSummary: {
        fontSize: 20,
        color: "blue",
        fontWeight : "bold",
        flex: 1,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },


    accountSummaryBackground: {
        width: Dimensions.get('window').width,
        height: 120,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },

    accountTransaction: {
        flex: 6,
        backgroundColor: "#5E76FA",
        flexDirection: "row",
    },

    animation: {
        width: 50,
        height: 50,
    },

});
