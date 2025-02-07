import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

interface Props {
    value: string;
    setValue: (value: string) => void;
}

const TextBox = ({ value, setValue }: Props) => {
    return (
        <TextInput
            style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 10 }}
            placeholder="Type your reason..."
            value={value}
            onChangeText={setValue}
        />
    )
}

export default TextBox

const styles = StyleSheet.create({})