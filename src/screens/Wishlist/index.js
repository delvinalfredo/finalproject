import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Dimensions } from 'react-native';
import { Card } from '@rneui/base';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromPokedex, setPokedex } from '../../redux/action';
import { db } from '../config';
import { collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const PokedexHandle = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const pokedex = useSelector((state) => state.pokedex);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const fireStoreCollection = collection(db, 'pokedex');
                const querySnapshot = await getDocs(fireStoreCollection);
                const fetchedPokedex = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                dispatch(setPokedex(fetchedPokedex));
                setLoading(false);
            } catch (error) {
                console.warn('Error fetching pokedex: ', error);
                setLoading(false);
            }
        };

        fetchInitialData();

        const interval = setInterval(fetchInitialData, 1000);

        return () => clearInterval(interval);

    }, [dispatch]);

    const handleRemoveFromPokedex = async (item) => {
        if (!item.id) {
            console.warn('Document ID is empty or undefined');
            return;
        }
        try {
            await deleteDoc(doc(collection(db, 'pokedex'), item.id));
            dispatch(removeFromPokedex(item));
        } catch (error) {
            console.warn('Error removing document: ', error);
        }
    };

    const handleInfoPress = (pokemon) => {
        navigation.navigate('InfoPokedex', { id: pokemon.id, pokemonName: pokemon.name });
    };

    const handleEditPress = (pokemon) => {
        navigation.navigate('EditPokemon', { id: pokemon.id, pokemonName: pokemon.name });
    };    

    if (loading) {
        return (
            <View style={styles.loader}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={pokedex}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card >
                        <Card.Title>{item.name}</Card.Title>
                        {item.sprites && <Card.Image source={{ uri: item.sprites.front_default }} />}
                        <Text style={styles.text}>Height: {item.height / 10} m</Text>
                        <Text style={styles.text}>Weight: {item.weight / 10} kg</Text>
                        {/* <Button title="Remove" onPress={() => handleRemoveFromPokedex(item)} /> */}
                        <View style={styles.buttonContainer}>
                                <Button
                                    title="Info"
                                    buttonStyle={styles.infoButton}
                                    onPress={() => handleInfoPress(item)}
                                />
                                <Button
                                    title="Edit"
                                    buttonStyle={styles.infoButton}
                                    onPress={() => handleEditPress(item)}
                                />
                                <Button
                                    title="Remove"
                                    buttonStyle={styles.addButton}
                                    onPress={() => handleRemoveFromPokedex(item)}
                                />
                            </View>
                    </Card>
                )}
            />
        </View>
    );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    text: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
    },
    infoButton: {
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: (width - 60) / 2 - 10, // Lebar tombol disesuaikan dengan lebar layar
    },
    addButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'white',
        paddingHorizontal: 10,
        width: (width - 60) / 2 - 10, // Lebar tombol disesuaikan dengan lebar layar
    },
});

export default PokedexHandle;