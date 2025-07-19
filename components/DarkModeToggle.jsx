import React from 'react';
import { Switch, View, Text, StyleSheet } from 'react-native';

export default function DarkModeToggle({ isDarkMode, toggleDarkMode }) {
    return (
        <View style={styles.container}>
            <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                thumbColor={isDarkMode ? 'yellow' : 'white'}
                trackColor={{ false: '#333', true: '#ADD8E6' }}
                ios_backgroundColor="#333"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', padding: 10 },
});
