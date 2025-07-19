import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Markers({ photoMarkers = [], spotMarkers = [], onSpotPress, markerColors, localFavorites = {} }) {
    const renderFavoriteText = (id) => {
        const rating = localFavorites[id];
        if (!rating || rating <= 0) return null;
        return <Text>Favorite: {String(rating)}</Text>;
    };

    return (
        <>
            {photoMarkers.map(photo => {
                const isRated = localFavorites[photo.id] && localFavorites[photo.id] > 0;
                const pinColor = isRated ? markerColors.favoriet : markerColors.gebruiker;

                return (
                    <Marker
                        key={photo.id}
                        coordinate={{ latitude: photo.location.latitude, longitude: photo.location.longitude }}
                        title={photo.note || 'Geen titel'}
                        onPress={() => onSpotPress(photo, 'photo')}
                        pinColor={pinColor}
                    >
                        <Callout>
                            <View style={styles.callout}>
                                <Text style={styles.title}>{photo.note || 'Geen titel'}</Text>
                            </View>
                        </Callout>
                    </Marker>
                );
            })}

            {spotMarkers.map(spot => {
                const isRated = localFavorites[spot.id] && localFavorites[spot.id] > 0;
                const pinColor = isRated ? markerColors.favoriet : markerColors.hotspot;

                return (
                    <Marker
                        key={spot.id}
                        coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                        title={spot.title}
                        onPress={() => onSpotPress(spot, 'spot')}
                        pinColor={pinColor}
                    >
                        <Callout>
                            <View style={styles.callout}>
                                <Text style={styles.title}>{spot.title}</Text>
                                {renderFavoriteText(spot.id)}
                            </View>
                        </Callout>
                    </Marker>
                );
            })}
        </>
    );
}


const styles = StyleSheet.create({
    callout: { width: 250 },
    title: { fontWeight: 'bold', marginBottom: 5 },
    image: { width: 230, height: 120, borderRadius: 5 },
});
