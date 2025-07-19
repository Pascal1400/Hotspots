import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import PhotoPicker from '../components/PhotoPicker';
import ButtonsBar from "../components/ButtonsBar";
import { ThemeContext } from '../components/ThemeContext';

function CameraScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const [image, setImage] = useState(null);
    const [note, setNote] = useState('');
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
        })();
    }, []);

    const savePhoto = async () => {
        if (!image || !location) {
            alert('Foto en locatie nodig!');
            return;
        }

        const newPhoto = {
            id: uuid.v4(),
            uri: image,
            note,
            location,
            date: new Date().toISOString(),
        };

        try {
            const stored = await AsyncStorage.getItem('photos');
            const photos = stored ? JSON.parse(stored) : [];
            photos.push(newPhoto);
            await AsyncStorage.setItem('photos', JSON.stringify(photos));
            navigation.navigate('Home');
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <View style={styles(theme).container}>
                <ScrollView contentContainerStyle={{ paddingBottom: 120 }} style={styles(theme).containerContent}>
                    <PhotoPicker onImagePicked={setImage} />
                    {image && <Image source={{ uri: image }} style={styles(theme).image} />}

                    <TextInput
                        placeholder="Notitie"
                        placeholderTextColor={theme.text}
                        value={note}
                        onChangeText={setNote}
                        style={styles(theme).input}
                        multiline
                        numberOfLines={4}
                    />

                    <TouchableOpacity style={styles(theme).actionButton} onPress={savePhoto}>
                        <Text style={styles(theme).actionButtonText}>Opslaan</Text>
                    </TouchableOpacity>
                </ScrollView>

                <ButtonsBar navigation={navigation} />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: theme.background,
    },
    containerContent: {
        top: 35,
    },
    input: {
        borderWidth: 1,
        padding: 12,
        marginVertical: 20,
        borderRadius: 8,
        borderColor: theme.text,
        color: theme.text,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    image: {
        width: '100%',
        height: 300,
        marginVertical: 10,
        borderRadius: 8,
    },
    actionButton: {
        backgroundColor: '#E9A561',
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: 'center',
        marginVertical: 10,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default CameraScreen;
