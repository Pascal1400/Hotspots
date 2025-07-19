import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Map from '../components/Map';
import useHotspots from '../data/Hotspots';
import ButtonsBar from '../components/ButtonsBar';
import MarkerColorSettings from '../components/MarkerColorSettings';
import DarkModeToggle from '../components/DarkModeToggle';
import { ThemeContext } from '../components/ThemeContext';
import * as Location from 'expo-location';

export default function HomeScreen({ navigation, route }) {
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
    const [photos, setPhotos] = useState([]);
    const { spots, loading, localFavorites } = useHotspots();

    const [markerColors, setMarkerColors] = useState({
        gebruiker: 'red',
        hotspot: 'blue',
        favoriet: 'gold',
    });

    const [region, setRegion] = useState({
        latitude: 51.9225,
        longitude: 4.47917,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    });

    const updateRegion = async () => {
        if (route?.params?.centerOnLocation) {
            const { latitude, longitude } = route.params.centerOnLocation;
            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0025,
                longitudeDelta: 0.0025,
            });
            navigation.setParams({ centerOnLocation: null });
        } else {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Locatie-permissie geweigerd, gebruik default');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    };

    useEffect(() => {
        updateRegion();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            updateRegion();
        });
        return unsubscribe;
    }, [navigation, route]);

    useEffect(() => {
        const loadPhotos = async () => {
            const stored = await AsyncStorage.getItem('photos');
            setPhotos(stored ? JSON.parse(stored) : []);
        };
        const unsubscribe = navigation.addListener('focus', loadPhotos);
        return unsubscribe;
    }, [navigation]);

    const centerOnUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Locatie-permissie geweigerd');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    };


    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            {loading ? (
                <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
            ) : (
                <>
                    <View style={styles.mapContainer}>
                        <Map
                            key={`map-${isDarkMode ? 'dark' : 'light'}`}
                            region={region}
                            photoMarkers={photos}
                            spotMarkers={spots}
                            onSpotPress={(item, type) => navigation.navigate('Detail', { photo: item, type })}
                            markerColors={markerColors}
                            localFavorites={localFavorites}
                            isDarkMode={isDarkMode}
                        />
                    </View>

                    <View style={styles.topButtonsContainer}>
                        <MarkerColorSettings markerColors={markerColors} setMarkerColors={setMarkerColors} />
                        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                    </View>

                    <TouchableOpacity style={styles.centerButton} onPress={centerOnUserLocation}>
                        <Text style={styles.centerButtonText}>Centreren</Text>
                    </TouchableOpacity>

                    <ButtonsBar navigation={navigation} />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    topButtonsContainer: {
        position: 'absolute',
        top: 40,
        alignSelf: 'left',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'space-between',
        zIndex: 10,
        elevation: 10,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkContainer: {
        backgroundColor: '#000',
    },
    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
    },
    markerButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
        zIndex: 10,
        elevation: 10,
    },
    markerButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    centerButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        backgroundColor: '#E9A561',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        zIndex: 10,
    },
    centerButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
