import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Info from '../screens/Home/info';
import InfoPokedex from '../screens/Wishlist/infopoke';
import EditPokedex from '../screens/Wishlist/editpokemon';
import PokedexHandle from '../screens/Wishlist/';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Router = () => {
    const HomeStack = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen name={'PokemonList'} component={Home} />
                <Stack.Screen name={'PokemonDetail'} component={Info} options={{ title: 'Pokemon Detail' }} />
            </Stack.Navigator>
        );
    };

    const PokedexStack = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen name={'PokedexList'} component={PokedexHandle} />
                <Stack.Screen name={'InfoPokedex'} component={InfoPokedex} options={{ title: 'Info Pokemon' }}/>
                <Stack.Screen name={'EditPokemon'} component={EditPokedex} options={{ title: 'Edit Pokemon' }}/>
            </Stack.Navigator>
        );
    };

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        height: 70,
                        paddingBottom: 10,
                        paddingTop: 5,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                    tabBarActiveTintColor: 'violet',
                }}>
                <Tab.Screen
                    name={'Pokemon'}
                    component={HomeStack}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <AntIcon name="home" color={color} size={focused ? 24 : 20} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={'Pokedex'}
                    component={PokedexStack}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <AntIcon name="book" size={24} color="black" />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Router;
