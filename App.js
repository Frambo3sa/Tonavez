import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Games from './screens/Games';
import Agenda from './screens/Agenda';
import Videos from './screens/Videos';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        {/* Login e Cadastro */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={Register} 
          options={{ title: 'Criar Conta' }} 
        />

        {/* Telas Principais */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ title: 'Meu Perfil' }} 
        />
        <Stack.Screen 
          name="Games" 
          component={Games} 
          options={{ title: 'Jogos' }} 
        />
        <Stack.Screen 
          name="Agenda" 
          component={Agenda} 
          options={{ title: 'Agenda de Reservas' }} 
        />
        <Stack.Screen 
          name="Videos" 
          component={Videos} 
          options={{ title: 'Se Liga Só - Tutoriais' }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
