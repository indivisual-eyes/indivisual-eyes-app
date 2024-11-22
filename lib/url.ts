import * as Linking from 'expo-linking'

export async function getUrl() {
    const ip = await Linking.getInitialURL();
    return `http${ip?.substring(3, ip.length - 4)}8000`;
}
