// screens/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Home';
import GamesScreen from './Games';
import AgendaScreen from './Agenda';
import VideosScreen from './Videos';

const Tab = createBottomTabNavigator();

export default ({ user }) => (
  <Tab.Navigator>
    <Tab.Screen name="Home">{props => <HomeScreen {...props} user={user} />}</Tab.Screen>
    <Tab.Screen name="Jogos" component={GamesScreen}/>
    <Tab.Screen name="Agenda">{props => <AgendaScreen {...props} user={user} />}</Tab.Screen>
    <Tab.Screen name="SeLigaSó" component={VideosScreen}/>
  </Tab.Navigator>
);
