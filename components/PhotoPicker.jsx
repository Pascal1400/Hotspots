import React from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export async function pickImageFromCamera(onImagePicked) {
    try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Camera-toegang geweigerd');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            quality: 0.5,
            allowsEditing: true,
        });

        if (!result.canceled && result.assets.length > 0) {
            onImagePicked(result.assets[0].uri);
        }
    } catch (error) {
        console.log('Fout bij camera:', error);
    }
}

export async function pickImageFromLibrary(onImagePicked) {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Toegang tot galerij geweigerd');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.5,
            allowsEditing: true,
        });

        if (!result.canceled && result.assets.length > 0) {
            onImagePicked(result.assets[0].uri);
        }
    } catch (error) {
        console.log('Fout bij galerij:', error);
    }
}

export default function PhotoPicker({ onImagePicked }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => pickImageFromCamera(onImagePicked)}>
                <Text style={styles.buttonText}>Foto maken</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => pickImageFromLibrary(onImagePicked)}>
                <Text style={styles.buttonText}>Kies uit galerij</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#E9A561',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginVertical: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
