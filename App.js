import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Agenda from './screens/Agenda';
import Games from './screens/Games';
import Home from './screens/Home';
import Login from './screens/Login';
import Profile from './screens/Profile';
import Register from './screens/Register';
import Videos from './screens/Videos';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Games" component={Games} />
        <Stack.Screen name="Agenda" component={Agenda} />
        <Stack.Screen name="Videos" component={Videos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
