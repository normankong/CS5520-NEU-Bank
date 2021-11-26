import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    layerTop: {
        marginTop: 25,
        flex: 0.8,
        backgroundColor: 'red',
        borderBottomWidth: 4,
        borderColor: "#5E76FA",
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    layerUpperTop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    layerCenter: {
        flex: 5,
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    layerLowerBottom: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    layerBottom: {
        flex: 6,
        backgroundColor: '#5E76FA'
    },

    layerLeft: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    focused: {
        flex: 6,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    layerRight: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: 500,
        justifyContent: 'center',
        alignItems: 'center',
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
    accountRow: {
        flexDirection: "row",
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    ctaButton: {
        backgroundColor: "#5E76FA",
        marginVertical: 3
    },
    normalButton: {
        marginVertical: 3 
    },
    animation: {
        width: 150,
        height: 150,
    },
    map_animation: {
        width: 50,
        height: 50,
    },
    cashButton : {
       justifyContent: 'center',
       color: "blue",
    },



      camera: {
        flex: 1,
      },
      buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
      },
      button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
      },
      text: {
        fontSize: 18,
        color: 'white',
      },
});