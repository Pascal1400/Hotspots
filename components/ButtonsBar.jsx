import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from './ThemeContext';

function ButtonsBar({ navigation }) {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={[styles.buttonContainer, { backgroundColor: theme.background }]}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={[styles.buttonText, { color: theme.text }]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.cameraButton, { backgroundColor: theme.background }]}
                onPress={() => navigation.navigate('Camera')}
            >
                <Text style={styles.cameraButtonText}>📸</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Overview')}
            >
                <Text style={[styles.buttonText, { color: theme.text }]}>Hotspots</Text>
            </TouchableOpacity>
        </View>


    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',  // meer ruimte tussen buttons
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,             // helemaal onderaan
        left: 0,
        right: 0,
        height: 60,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',      // horizontaal centreren
        paddingVertical: 10,
        marginHorizontal: 20,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
    },
    cameraButton: {
        width: 100,                     // iets groter
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        elevation: 5,
    },
    cameraButtonText: {
        fontSize: 50,                  // iets groter emoji
    },
});

export default ButtonsBar;
