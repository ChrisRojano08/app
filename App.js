import 'react-native-gesture-handler';
import React from 'react';
import StyleSheet from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider } from 'native-base';

import HomeComponent from './src/HomePage/component/HomePage';
import AboutComponent from './src/Utils/component/Hola';

import generalCss from './src/resources/css/General.css';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const Stack = createStackNavigator();

class App extends React.Component {
  render() {
    return (
        <NativeBaseProvider>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator>
            <Stack.Screen
              options={{ headerShown: false }} 
              name="Home"
              component={HomeComponent}
            />
            <Stack.Screen
              options={{ headerShown: false }} 
              name="Friends"
              component={AboutComponent}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
      
    );
  }
}

export default App;