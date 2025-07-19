import React, { useContext, useRef, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { ThemeContext } from './ThemeContext';
import Markers from './Markers';

export default function Map(props) {
    const { theme } = useContext(ThemeContext);
    const mapRef = useRef(null);

    useEffect(() => {
        if (props.centerOnLocation && mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude: props.centerOnLocation.latitude,
                    longitude: props.centerOnLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                },
                1000
            );
        }
    }, [props.centerOnLocation]);

    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={props.region}
            customMapStyle={theme.mapStyle}
            showsUserLocation={true}
        >
            <Markers
                photoMarkers={props.photoMarkers}
                spotMarkers={props.spotMarkers}
                onSpotPress={props.onSpotPress}
                markerColors={props.markerColors}
                localFavorites={props.localFavorites}
            />
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: { flex: 1 },
});
