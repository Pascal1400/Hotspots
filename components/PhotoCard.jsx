import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from './ThemeContext';

function PhotoCard({ photo, onPress }) {
    const { theme } = useContext(ThemeContext);

    const cardBackground = theme.background === '#000'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.05)';

    // Fallback voor afbeelding
    const imageUri = photo.uri || photo.photoUri || photo.image || null;

    // Datum formatteren als die bestaat
    let formattedDate = '';
    if (photo.date) {
        const dateObj = new Date(photo.date);
        if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toLocaleDateString();
        }
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: cardBackground }]}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
                <Text style={{ color: theme.text, width: 100, height: 100, textAlign: 'center', textAlignVertical: 'center' }}>
                    Geen afbeelding
                </Text>
            )}

            <View style={styles.info}>
                <Text style={[styles.note, { color: theme.text }]}>
                    {photo.note || photo.title || 'Geen omschrijving'}
                </Text>
                {formattedDate ? (
                    <Text style={[styles.date, { color: theme.textSecondary }]}>{formattedDate}</Text>
                ) : null}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        marginVertical: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: { width: 100, height: 100 },
    info: { flex: 1, padding: 8, justifyContent: 'center' },
    note: { fontSize: 16, fontWeight: 'bold' },
    date: { fontSize: 12 },
});

export default PhotoCard;
