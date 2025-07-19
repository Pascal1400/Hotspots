import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhotoCard from './PhotoCard';
import { ThemeContext } from './ThemeContext';

export default function UserSpotsList({ navigation, onLoad }) {
    const { theme } = useContext(ThemeContext);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadPhotos = async () => {
        try {
            const stored = await AsyncStorage.getItem('photos');
            const photos = stored ? JSON.parse(stored) : [];
            setPhotos(photos);
        } catch (error) {
            console.error('Fout bij laden fotos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPhotos();
        const unsubscribe = navigation.addListener('focus', () => loadPhotos());
        return () => unsubscribe();
    }, [navigation]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.text} />
                <Text style={{ color: theme.text, marginTop: 10 }}>Bezig met laden...</Text>
            </View>
        );
    }

    if (photos.length === 0) {
        return <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>Geen user spots gevonden</Text>;
    }

    return (
        <FlatList
            data={photos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <PhotoCard
                    photo={item}
                    onPress={() => navigation.navigate('Detail', { photo: item, type: 'photo' })}
                    theme={theme}
                />
            )}
            contentContainerStyle={{ paddingBottom: 60 }}
        />
    );
}
