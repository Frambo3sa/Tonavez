import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Games from './Games';
import Agenda from './Agenda';
import Videos from './Videos';
import Profile from './Profile'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Games" component={Games} />
      <Tab.Screen name="Agenda" component={Agenda} />
      <Tab.Screen name="Videos" component={Videos} />
    </Tab.Navigator>
  );
}
