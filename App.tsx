import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './Components/HomeScreen';
import CreateUserScreen from './Components/CreateUserScreen';
import LoginUserScreen from './Components/LoginUserScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from './Services/AuthService';
import ProfileScreen from './Components/ProfileScreen';

type RootStackParamList = {
  Login: undefined;
  CreateUser: undefined;
  Home: undefined;
};

type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} // Replace with actual Profile component
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Settings" 
        component={HomeScreen} // Replace with actual Settings component
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await AuthService.isAuthenticated();
        setInitialRoute(isAuth ? 'Home' : 'Login');
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      <StripeProvider publishableKey='pk_test_51QNEhWIP7uD6y7g1Npk22hUVt691IvN65Y9qaKaON9MCSWaJd6FtzDdoMjEP5vG8dM1OOD70FjetzSKUS7cgXFjn00Qexjn9uE'>
        <Stack.Navigator 
          initialRouteName={initialRoute} 
          screenOptions={{ 
            headerShown: false,
            gestureEnabled: false // Disable iOS back gesture
          }}>
          <Stack.Screen 
            name="Login" 
            component={LoginUserScreen} 
            options={{ gestureEnabled: false }} 
          />
          <Stack.Screen 
            name="CreateUser" 
            component={CreateUserScreen} 
            options={{ gestureEnabled: false, headerShown:false }}
          />
          <Stack.Screen 
            name="Home" 
            component={TabNavigator} 
            options={{  gestureEnabled: false, headerShown:false }}
          />
        </Stack.Navigator>
      </StripeProvider>
    </NavigationContainer>
  );
}
