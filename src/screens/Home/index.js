import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config';
import { useDispatch, useSelector } from 'react-redux';
import { addToPokedex } from '../../redux/action';

const HomeScreen = ({ navigation }) => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const pokedex = useSelector((state) => state.pokedex);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchPokemons();

        const unsubscribe = navigation.addListener('focus', fetchPokemons);

        return unsubscribe;
    }, [navigation]);

    const fetchPokemons = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
            const data = await response.json();
            const pokemonPromises = data.results.map(async (pokemon) => {
                const pokemonData = await fetch(pokemon.url);
                return pokemonData.json();
            });
            const pokemonDetails = await Promise.all(pokemonPromises);
            setPokemons(pokemonDetails);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pokemons:', error);
            setLoading(false);
        }
    };

    const getCardColor = (types) => {
        if (types && types.length > 0) {
            const typeColors = {
                normal: '#A8A878',
                fighting: '#C03028',
                flying: '#A890F0',
                poison: '#A040A0',
                ground: '#E0C068',
                rock: '#B8A038',
                bug: '#A8B820',
                ghost: '#705898',
                steel: '#B8B8D0',
                fire: '#F08030',
                water: '#6890F0',
                grass: '#78C850',
                electric: '#F8D030',
                psychic: '#F85888',
                ice: '#98D8D8',
                dragon: '#7038F8',
                dark: '#705848',
                fairy: '#EE99AC',
            };

            const primaryType = types[0].type.name;
            return typeColors[primaryType] || '#808080';
        } else {
            return '#808080';
        }
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const handleInfoPress = (pokemon) => {
        navigation.navigate('PokemonDetail', { pokemon });
    };

    const handleAddPokedexPress = async (item) => {
        // if (isInPokedex(item)) {
        //     console.warn('Pokemon is already in the Pokedex');
        //     return;
        // }
        try {
            await saveToFirebase(item); // Save to Firebase first
            dispatch(addToPokedex(item)); // Then dispatch action to add to Redux
        } catch (error) {
            console.warn('Error adding to Pokedex:', error);
        }
    };

    // const isInPokedex = (item) => {
    //     return pokedex.some((pokedexItem) => pokedexItem.name === item.name);
    // };

    const saveToFirebase = async (item) => {
        const fireStoreCollection = collection(db, 'pokedex');
        const objectPost = {
            name: item.name,
            height: item.height,
            weight: item.weight,
            sprites: item.sprites,
        };
        try {
            await addDoc(fireStoreCollection, objectPost);
            console.warn('Pokemon added to Pokedex');
        } catch (error) {
            console.warn('Error adding to Pokedex:', error);
            throw error;
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={pokemons}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Card containerStyle={{ backgroundColor: getCardColor(item.types) }}>
                            <Card.Title>{capitalize(item.name)}</Card.Title>
                            <Card.Divider />
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: item.sprites.front_default }}
                                    style={styles.image}
                                />
                            </View>
                            <Text style={styles.text}>Height: {item.height / 10} m</Text>
                            <Text style={styles.text}>Weight: {item.weight / 10} kg</Text>
                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Info"
                                    buttonStyle={styles.infoButton}
                                    onPress={() => handleInfoPress(item)}
                                />
                                <Button
                                    title="Add Pokedex"
                                    buttonStyle={styles.addButton}
                                    onPress={() => handleAddPokedexPress(item)}
                                />
                            </View>
                        </Card>
                    )}
                />
            )}
        </View>
    );
};
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    image: {
        width: 200,
        height: 200,
    },
    text: {
        marginVertical: 5,
        color: 'white', // Mengatur warna teks menjadi putih
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

export default HomeScreen;