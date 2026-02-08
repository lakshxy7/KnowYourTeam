import React from 'react';
import { Text } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DirectoryScreen from '../screens/DirectoryScreen';
import DepartmentScreen from '../screens/DepartmentScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import EmployeeDetailsScreen from '../screens/EmployeeDetailScreen';


export type RootStackParamList = {
  MainTabs: undefined;
  EmployeeDetails: { userId: string }; 
};

export type TabParamList = {
  Directory: undefined;
  Departments: undefined;
  MyTeam: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true, 
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let icon = '❓';
          if (route.name === 'Directory') icon = '🏠';
          if (route.name === 'Departments') icon = '🏢';
          if (route.name === 'MyTeam') icon = '❤️';
          
          return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="Directory" component={DirectoryScreen} options={{ title: 'Directory' }} />
      <Tab.Screen name="Departments" component={DepartmentScreen} options={{ title: 'Departments' }} />
      <Tab.Screen name="MyTeam" component={MyTeamScreen} options={{ title: 'My Team' }} />
    </Tab.Navigator>
  );
};


const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
  
        <Stack.Screen 
          name="MainTabs" 
          component={BottomTabs} 
          options={{ headerShown: false }} 
        />
        
    
        <Stack.Screen 
          name="EmployeeDetails" 
          component={EmployeeDetailsScreen} 
          options={{ 
            title: 'Profile',
            headerBackTitle: 'Back', 
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;