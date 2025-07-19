import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MarkerColorSettings({ markerColors, setMarkerColors }) {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem('markerColors');
            if (stored) setMarkerColors(JSON.parse(stored));
        })();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('markerColors', JSON.stringify(markerColors));
    }, [markerColors]);

    const colors = ['red', 'blue', 'gold', 'green', 'purple', 'orange'];

    const changeColor = (type, color) => {
        setMarkerColors(prev => ({ ...prev, [type]: color }));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
                <Text style={styles.headerText}>Kleuren {expanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expanded && (
                <View style={styles.content}>
                    {['gebruiker', 'hotspot', 'favoriet'].map(type => (
                        <View key={type} style={styles.row}>
                            <Text style={styles.label}>{type.toUpperCase()}:</Text>
                            <View style={styles.colorOptions}>
                                {colors.map(color => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.colorCircle,
                                            { backgroundColor: color },
                                            markerColors[type] === color && styles.selectedColor,
                                        ]}
                                        onPress={() => changeColor(type, color)}
                                    />
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f4f4f4',
        margin: 10,
        borderRadius: 20,
        overflow: 'hidden',
    },
    header: {
        padding: 12,
        backgroundColor: '#E9A561',
    },
    headerText: {
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        padding: 12,
    },
    row: {
        marginBottom: 12,
    },
    label: {
        marginBottom: 6,
        fontWeight: '600',
    },
    colorOptions: {
        flexDirection: 'row',
    },
    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: 'black',
        borderWidth: 2,
    },
});
