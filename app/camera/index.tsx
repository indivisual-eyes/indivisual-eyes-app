import { CameraView, useCameraPermissions } from 'expo-camera'
import { ActivityIndicator, Image, Platform, View } from 'react-native'
import { useRef, useState } from 'react'

import { getUrl } from '@/lib/url'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { SlidersHorizontal } from '~/lib/icons/SlidersHorizontal'
import { ArrowLeft } from '~/lib/icons/ArrowLeft'
import { Link } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions()
    const [image, setImage] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)

    const cameraRef = useRef<CameraView>(null)

    if (!permission) {
        return <View/>
    }

    if (!permission.granted) {
        return (
            <View className={'flex-1'}>
                <Text>We need your permission to show the camera</Text>
                <Button onPress={requestPermission}><Text>Grant permission</Text></Button>
            </View>
        )
    }

    async function takePicture() {
        if (cameraRef.current) {
            const data = await cameraRef.current.takePictureAsync()

            if (data) {
                setImage(data.uri)
            }
        }
    }

    async function sendImage() {
        setLoading(true)
        const body = new FormData()
        // @ts-ignore
        body.append('image', {
            uri: Platform.OS === 'ios' ? image?.replace('file://', '') : image,
            name: 'photo.jpg',
            type: 'image/jpeg',
        })

        const cvdType = await AsyncStorage.getItem('cvdType')
        body.append('cvd_type', cvdType || '')

        try {
            const url = await getUrl()

            const response = await fetch(url + '/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body,
            })

            if (response.ok) {
                const image = await response.blob()

                const fileReaderInstance = new FileReader()
                fileReaderInstance.readAsDataURL(image)

                fileReaderInstance.onload = () => {
                    const vtt_data = fileReaderInstance.result
                    setImage(vtt_data?.toString())
                }
            }
        } catch (e) {
            console.log(e)
        }

        setLoading(false)
    }

    async function resetImage() {
        setImage(undefined)
    }

    if (image) {
        return (
            <View className={'flex-1'}>
                <View className={'flex-1 w-full justify-center items-center'}>
                    <Image className={'flex-1 w-full h-full absolute'} source={{ uri: image }}/>
                    {loading ? (<ActivityIndicator size={'large'} color={'#FFFFFF'}/>) : <></>}
                </View>
                <View className={'w-full p-4 flex-row gap-4 justify-between items-center'}>
                    <Button className={''} onPress={sendImage}><Text>Upload image</Text></Button>
                    <Button className={''} size={'icon'} variant={'secondary'} onPress={resetImage}><ArrowLeft className={'text-primary'}/></Button>
                </View>
            </View>
        )
    }

    return (
        <View className={'flex-1'}>
            <View className={'flex-1 w-full'}>
                <CameraView style={{ flexGrow: 1, width: '100%', height: '100%' }} ref={cameraRef}/>
            </View>
            <View className={'w-full p-4 flex-row gap-4 justify-between items-center'}>
                <Button className={''} onPress={takePicture}><Text>Take picture</Text></Button>
                <Link href={'/'} asChild>
                    <Button className={''} size={'icon'} variant={'secondary'}><SlidersHorizontal className={'text-primary'}/></Button>
                </Link>
            </View>
        </View>
    )
}
