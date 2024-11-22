import { CameraView, useCameraPermissions } from 'expo-camera'
import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRef, useState } from 'react'

import { getUrl } from '@/lib/url'

export default function App() {
    const [permission, requestPermission] = useCameraPermissions()
    const [image, setImage] = useState<string>()

    const cameraRef = useRef<CameraView>(null)

    if (!permission) {
        return <View/>
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title='grant permission'/>
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
        const body = new FormData()
        // @ts-ignore
        body.append('image', {
            uri: Platform.OS === 'ios' ? image?.replace('file://', '') : image,
            name: 'photo.jpg',
            type: 'image/jpeg',
        })

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
    }

    async function resetImage() {
        setImage(undefined)
    }

    if (image) {
        return (
            <View style={styles.container}>
                <View style={styles.camera}>
                    <Image source={{ uri: image }} style={styles.camera}/>
                    <TouchableOpacity style={styles.button} onPress={sendImage}>
                        <Text style={styles.text}>Upload image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={resetImage}>
                        <Text style={styles.text}>Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.camera}>
                <CameraView style={styles.camera} ref={cameraRef}>
                </CameraView>
                <TouchableOpacity style={styles.button} onPress={takePicture}>
                    <Text style={styles.text}>Take picture</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 3,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
})
