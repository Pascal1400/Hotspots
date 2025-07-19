import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../components/ThemeContext';
import UserSpotsList from '../components/UserSpotsList';
import ApiSpotsList from '../components/ApiSpotsList';
import ButtonsBar from "../components/ButtonsBar";

export default function OverviewScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const [selectedTab, setSelectedTab] = useState('user');

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'user' && styles.activeTabBorder]}
                    onPress={() => {
                        setSelectedTab('user');
                    }}
                >
                    <Text style={[styles.tabButtonText, selectedTab === 'user' ? styles.activeTabText : { color: theme.text }]}>
                        Gebruiker
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'api' && styles.activeTabBorder]}
                    onPress={() => {
                        setSelectedTab('api');
                    }}
                >
                    <Text style={[styles.tabButtonText, selectedTab === 'api' ? styles.activeTabText : { color: theme.text }]}>
                        Hotspots
                    </Text>
                </TouchableOpacity>
            </View>

            {selectedTab === 'user' ? (
                <UserSpotsList navigation={navigation} />
            ) : (
                <ApiSpotsList navigation={navigation} />
            )}

            <ButtonsBar navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
        marginTop: 40,
    },
    tabButton: {
        marginHorizontal: 20,
        paddingBottom: 8,
    },
    tabButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#E9A561',
    },
    activeTabBorder: {
        borderBottomColor: '#E9A561',
        borderBottomWidth: 2,
    },
    spotsList: {
        flex: 1,
    },
});
