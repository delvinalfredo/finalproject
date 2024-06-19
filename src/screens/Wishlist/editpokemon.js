import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config';

const EditPokemon = ({ route, navigation }) => {
    const { id, pokemonName } = route.params;
    const [newName, setNewName] = useState(pokemonName);
    const [dialog, setDialog] = useState("");

    const handleSubmit = async () => {
        const dataUpdate = {
            name: newName,
        }
    
        const pokemonRef = doc(db, 'pokedex', id);
    
        try {
            await updateDoc(pokemonRef, dataUpdate);
            setDialog(true);
            // Navigasi kembali setelah berhasil update
            navigation.goBack();
        } catch (error) {
            console.warn(error);
        }
    }

    const toogleDialog = () => {
        setDialog(!dialog);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Current Name:</Text>
            <Text style={styles.currentName}>{pokemonName}</Text>

            <Text style={styles.label}>New Name:</Text>
            <TextInput
                style={styles.input}
                value={newName}
                onChangeText={text => setNewName(text)}
            />

            <Button
                title="Save"
                onPress={handleSubmit}
            />

            <Text>{dialog && "Data updated successfully!"}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    currentName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginBottom: 20,
        width: '100%',
    },
});

export default EditPokemon;
