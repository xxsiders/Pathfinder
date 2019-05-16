import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    input: {
        width: '85%',
        borderRadius: 15,
        height: 50,
        backgroundColor: '#E4E4E4',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',
        marginBottom: 30,
        fontSize: 20,
        fontWeight: '500',
        color: '#707070'
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        backgroundColor: '#F44336',
        width: 150, height: 50,
        marginTop: 50,
        marginBottom:20
    },
    btnText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600'
    },
    header: {
        height: 100,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F44336',
    },
    headerText: {
        fontSize: 30,
        color: 'white',
        fontWeight: '700',
        marginTop: 10
    }

})
export default styles