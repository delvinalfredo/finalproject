import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const Info = ({ route }) => {
    const { pokemon } = route.params;
    const [species, setSpecies] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSpecies();
    }, []);

    const fetchSpecies = async () => {
        try {
            const response = await fetch(pokemon.species.url);
            const speciesData = await response.json();
            setSpecies(speciesData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching species:', error);
            setLoading(false);
        }
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <Text style={styles.title}>{capitalize(pokemon.name)}</Text>
                    <Image
                        source={{ uri: pokemon.sprites.front_default }}
                        style={styles.image}
                    />
                    <Text style={styles.text}>Height: {pokemon.height / 10} m</Text>
                    <Text style={styles.text}>Weight: {pokemon.weight / 10} kg</Text>
                    <Text style={styles.text}>Base Experience: {pokemon.base_experience}</Text>
                    <Text style={styles.text}>Species: {species && capitalize(species.name)}</Text>
                    <Text style={styles.subtitle}>Stats:</Text>
                    {pokemon.stats.map((stat) => (
                        <Text key={stat.stat.name} style={styles.text}>
                            {capitalize(stat.stat.name)}: {stat.base_stat}
                        </Text>
                    ))}
                    <Text style={styles.subtitle}>Abilities:</Text>
                    {pokemon.abilities.map((ability) => (
                        <Text key={ability.ability.name} style={styles.text}>
                            {capitalize(ability.ability.name)}
                        </Text>
                    ))}
                </>
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
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginVertical: 5,
    },
});

export default Info;
