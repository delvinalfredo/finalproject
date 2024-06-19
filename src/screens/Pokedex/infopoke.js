import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../config';

const InfoPokedex = ({ route }) => {
    const { id, pokemonName } = route.params; // Ambil ID dan nama Pokemon dari route params
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPokemon();
    }, []);

    const fetchPokemon = async () => {
        try {
            const docRef = doc(db, 'pokedex', id); // Ambil referensi dokumen berdasarkan ID
            const docSnap = await getDoc(docRef); // Ambil data dari dokumen

            if (docSnap.exists()) {
                setPokemon(docSnap.data()); // Set data Pokemon ke state
                setLoading(false);
            } else {
                console.log('No such document!');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching document:', error);
            setLoading(false);
        }
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                pokemon && (
                    <>
                        <Text style={styles.title}>{capitalize(pokemonName)}</Text>
                        <Image
                            source={{ uri: pokemon.sprites.front_default }}
                            style={styles.image}
                        />
                        <Image
                            source={{ uri: pokemon.sprites.back_default }}
                            style={styles.image}
                        />
                        <Text style={styles.text}>Height: {pokemon.height / 10} m</Text>
                        <Text style={styles.text}>Weight: {pokemon.weight / 10} kg</Text>
                    </>
                )
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        marginVertical: 5,
    },
});

export default InfoPokedex;
