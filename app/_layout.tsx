import '~/global.css'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Theme, ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { Platform } from 'react-native'
import { NAV_THEME } from '~/lib/constants'
import { useColorScheme } from '~/lib/useColorScheme'
import { Header } from '@react-navigation/elements'

const LIGHT_THEME: Theme = {
    dark: false,
    colors: NAV_THEME.light,
    fonts: {
        regular: {
            fontFamily: 'Inter',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Inter',
            fontWeight: '500',
        },
        bold: {
            fontFamily: 'Inter',
            fontWeight: '600',
        },
        heavy: {
            fontFamily: 'Inter',
            fontWeight: '700',
        },
    },
}

const DARK_THEME: Theme = {
    dark: true,
    colors: NAV_THEME.dark,
    fonts: {
        regular: {
            fontFamily: 'Inter',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Inter',
            fontWeight: '500',
        },
        bold: {
            fontFamily: 'Inter',
            fontWeight: '600',
        },
        heavy: {
            fontFamily: 'Inter',
            fontWeight: '700',
        },
    },
}

export {
    ErrorBoundary,
} from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme()
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)

    React.useEffect(() => {
        (async () => {
            const theme = await AsyncStorage.getItem('theme')
            if (Platform.OS === 'web') {
                document.documentElement.classList.add('bg-background')
            }
            if (!theme) {
                await AsyncStorage.setItem('theme', colorScheme)
                setIsColorSchemeLoaded(true)
                return
            }
            const colorTheme = theme === 'dark' ? 'dark' : 'light'
            if (colorTheme !== colorScheme) {
                setColorScheme(colorTheme)

                setIsColorSchemeLoaded(true)
                return
            }
            setIsColorSchemeLoaded(true)
        })().finally(() => {
            SplashScreen.hideAsync()
        })
    }, [])

    if (!isColorSchemeLoaded) {
        return null
    }

    return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? 'light' : 'dark'}/>
            <Stack screenOptions={{
                header: ({ options }) => (
                    <Header {...options} title={''} headerStyle={{ height: 64 }} />
                )
            }}/>
        </ThemeProvider>
    )
}
