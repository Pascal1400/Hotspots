import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { pickImageFromCamera, pickImageFromLibrary } from '../components/PhotoPicker';
import useHotspots from '../data/Hotspots';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

function DetailsScreen({ route, navigation }) {
    const { theme } = useContext(ThemeContext);
    const { photo: initialPhoto, type } = route.params;
    const [photo, setPhoto] = useState(initialPhoto);
    const { localPhotos, updateLocalPhoto, localFavorites, updateLocalFavorite, ready } = useHotspots();

    const [updating, setUpdating] = useState(false);
    const [isFavorite, setIsFavorite] = useState(localFavorites[photo.id] === 1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    const displayUri = localPhotos[photo.id] || photo.uri || photo.photoUri || photo.image;

    useEffect(() => {
        setIsFavorite(localFavorites[photo.id] === 1);
    }, [localFavorites, photo.id]);

    useEffect(() => {
        if (ready && photo && (!displayUri || displayUri === '')) {
            setImageLoaded(true);
        }
    }, [ready, photo, displayUri]);

    useEffect(() => {
        setImageLoaded(false);
    }, [displayUri]);

    useEffect(() => {
        if (!imageLoaded) {
            const timer = setTimeout(() => {
                setImageLoaded(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [imageLoaded]);

    const isLoaded = ready && photo && (displayUri ? imageLoaded : true);

    if (!isLoaded) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.text }}>Bezig met laden...</Text>
            </View>
        );
    }

    const toggleFavorite = async () => {
        setUpdating(true);
        const newValue = isFavorite ? 0 : 1;
        await updateLocalFavorite(photo.id, newValue);
        setIsFavorite(!isFavorite);
        setUpdating(false);
    };

    const handleImagePicked = async (newUri) => {
        if (type !== 'photo') return;
        setUpdating(true);
        await updateLocalPhoto(photo.id, newUri);
        setPhoto(prev => ({ ...prev, uri: newUri }));
        setImageLoaded(false);
        setUpdating(false);
    };

    const handleImagePress = () => {
        Alert.alert(
            'Afbeelding aanpassen',
            'Kies een optie',
            [
                { text: 'Maak foto', onPress: () => pickImageFromCamera(handleImagePicked) },
                { text: 'Kies uit galerij', onPress: () => pickImageFromLibrary(handleImagePicked) },
                { text: 'Annuleren', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const handleDelete = async () => {
        if (!photo.id) return;
        setUpdating(true);

        try {
            const stored = await AsyncStorage.getItem('photos');
            const photos = stored ? JSON.parse(stored) : [];
            const updatedPhotos = photos.filter(p => p.id !== photo.id);
            await AsyncStorage.setItem('photos', JSON.stringify(updatedPhotos));

            const localPhotosCopy = { ...localPhotos };
            if (localPhotosCopy[photo.id]) {
                delete localPhotosCopy[photo.id];
                await AsyncStorage.setItem('localSpotPhotos', JSON.stringify(localPhotosCopy));
            }

            const localFavoritesCopy = { ...localFavorites };
            if (localFavoritesCopy[photo.id]) {
                delete localFavoritesCopy[photo.id];
                await AsyncStorage.setItem('localSpotFavorites', JSON.stringify(localFavoritesCopy));
            }
        } catch (e) {
            console.log(e);
        }

        setUpdating(false);
        navigation.goBack();
    };

    const handleGoToLocation = () => {
        const targetLocation = photo.location || {
            latitude: photo.latitude,
            longitude: photo.longitude,
        };
        if (targetLocation.latitude && targetLocation.longitude) {
            navigation.navigate('Home', { centerOnLocation: targetLocation });
        } else {
            Alert.alert('Locatie niet beschikbaar');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>

            <Text style={[styles.title, { color: theme.text }]}>{photo.note || photo.title || 'Geen titel'}</Text>

            <TouchableOpacity onPress={handleImagePress} disabled={updating}>
                {displayUri ? (
                    <Image source={{ uri: displayUri }} style={styles.image} />
                ) : (
                    <Text style={{ color: theme.text }}>Geen afbeelding beschikbaar</Text>
                )}
            </TouchableOpacity>

            {type !== 'photo' && (
                <>
                    <TouchableOpacity onPress={() => setShowDescription(!showDescription)} style={styles.toggleButton}>
                        <Text style={{ color: '#E9A561', fontSize: 16 }}>
                            {showDescription ? 'Verberg omschrijving' : 'Toon omschrijving'}
                        </Text>
                    </TouchableOpacity>

                    {showDescription && (
                        <ScrollView style={styles.descriptionContainer}>
                            <Text style={[styles.note, { color: theme.text }]}>
                                {photo.description || 'Geen omschrijving'}
                            </Text>
                        </ScrollView>
                    )}
                </>
            )}

            <View style={styles.iconRow}>
                <TouchableOpacity onPress={handleGoToLocation}>
                    <Ionicons name="location-outline" size={36} color={'#E9A561'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFavorite} disabled={updating}>
                    <Text style={{ fontSize: 36 }}>{isFavorite ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')} disabled={updating}>
                    <Text style={styles.buttonText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()} disabled={updating}>
                    <Text style={styles.buttonText}>Terug</Text>
                </TouchableOpacity>
            </View>

            {type === 'photo' && (
                <View style={styles.delete}>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={updating}>
                        <Text style={styles.buttonText}>Verwijder spot</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 30,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginBottom: 16,
    },
    toggleButton: {
        alignSelf: 'center',
        marginVertical: 10,
    },
    descriptionContainer: {
        maxHeight: 200,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    note: {
        fontSize: 16,
        textAlign: 'center',
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 50,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    button: {
        flex: 1,
        backgroundColor: '#E9A561',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
        zIndex: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    delete: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    deleteButton: {
         flex:1,
    backgroundColor: '#E86C5A',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    zIndex: 10,
},
});
export default DetailsScreen;
