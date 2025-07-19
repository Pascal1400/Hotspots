import React, { useContext, useEffect } from 'react';
import { FlatList, Text, ActivityIndicator, View } from 'react-native';
import PhotoCard from './PhotoCard';
import useHotspots from '../data/Hotspots';
import { ThemeContext } from './ThemeContext';

export default function ApiSpotsList({ navigation, onLoad }) {
    const { theme } = useContext(ThemeContext);
    const { spots, loading } = useHotspots();

    useEffect(() => {
        if (!loading && onLoad) {
            onLoad(false);
        }
    }, [loading, onLoad]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.text }}>Bezig met laden...</Text>
            </View>
        );
    }

    if (!spots || spots.length === 0) {
        return <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>Geen spots gevonden via API</Text>;
    }

    return (
        <FlatList
            data={spots}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <PhotoCard
                    photo={item}
                    onPress={() => navigation.navigate('Detail', { photo: item, type: 'api' })}
                    theme={theme}
                />
            )}
            contentContainerStyle={{ paddingBottom: 60 }}
        />
    );
}
