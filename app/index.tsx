import { View } from 'react-native'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Label } from '~/components/ui/label'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
    const [value, setValue] = useState('Protanopia')

    function onLabelPress(label: string) {
        return () => {
            setValue(label)
        }
    }

    async function onContinue() {
        await AsyncStorage.setItem('cvdType', value)
        router.replace('/camera')
    }

    return (
        <View className={'flex-1 p-6 gap-8 flex-col'}>
            <Text className={'text-lg'}>What type of color vision deficiency do you have?</Text>
            <RadioGroup value={value} onValueChange={setValue} className='gap-3'>
                <RadioGroupItemWithLabel value='Protanopia' onLabelPress={onLabelPress('Protanopia')} />
                <RadioGroupItemWithLabel value='Deuteranopia' onLabelPress={onLabelPress('Deuteranopia')} />
                <RadioGroupItemWithLabel value='Tritanopia' onLabelPress={onLabelPress('Tritanopia')} />
                <RadioGroupItemWithLabel value='Achromatopsia' onLabelPress={onLabelPress('Achromatopsia')} />
            </RadioGroup>
            <View className={'flex-1 justify-end'}>
                <Button onPress={onContinue} className={''}><Text>Continue</Text></Button>
            </View>
        </View>
    )
}

function RadioGroupItemWithLabel({ value, onLabelPress }: {
    value: string;
    onLabelPress: () => void;
}) {
    return (
        <View className={'flex-row gap-2 items-center'}>
            <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value}/>
            <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
                {value}
            </Label>
        </View>
    )
}
