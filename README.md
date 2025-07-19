# hotspots — React Native Hotspot & Fotospots App
Hotspot is een mobiele app gemaakt met React Native en Expo waarmee gebruikers hun favoriete fotospots kunnen vastleggen met locatie en een foto. De app toont ook externe hotspots via een API en slaat gebruikersspots lokaal op.

## Functionaliteiten
- 📷 Foto maken met camera of kiezen uit galerij
- 📍 Locatie automatisch opslaan bij de foto
- 📝 Naam toevoegen bij elke foto
- 🗂️ Gebruikersspots lokaal opslaan met AsyncStorage
- 🌐 API-hotspots ophalen en tonen
- 🗺️ Kaart met markers voor gebruikers- en API-spots
- 🔍 Klikken op spot → zoomt kaart naar de locatie

## Installatie  
### Vereisten
- node -v versie 20 of 22
- npm -v versie 10

### Installatie
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/native-stack @react-native-async-storage/async-storage uuid
npx expo install expo-location expo-image-picker react-native-maps react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
```

## Werking
- Download de Expo Go app
- type ``npm run start``
- scan de qr-code met de Expo Go app
- Let op! Je telefoon moet verbonden zijn met hetzelfde netwerk als je computer.