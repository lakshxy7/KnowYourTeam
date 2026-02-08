import React from 'react';
import { Image } from 'react-native'; // <--- 1. Import Image
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import DirectoryScreen from '../screens/DirectoryScreen';
import DepartmentScreen from '../screens/DepartmentScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import EmployeeDetailsScreen from '../screens/EmployeeDetailScreen';
import DepartmentListScreen from '../screens/DepartmentListScreen';
import { User } from '../types'; 

// 2. Import your Icons
const iconHome = require('../assets/icons/home.png');
const iconDept = require('../assets/icons/department.png');
const iconTeam = require('../assets/icons/team.png');

export type RootStackParamList = {
  MainTabs: undefined;
  EmployeeDetails: { user: User }; 
  DepartmentList: { department: string };
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
        // 3. Update the Icon Logic
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'Directory') {
            iconSource = iconHome;
          } else if (route.name === 'Departments') {
            iconSource = iconDept;
          } else if (route.name === 'MyTeam') {
            iconSource = iconTeam;
          }
          
          return (
            <Image 
              source={iconSource} 
              style={{ 
                width: 24, 
                height: 24, 
                tintColor: color // <--- This applies the Blue/Gray color automatically
              }} 
              resizeMode="contain"
            />
          );
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
        <Stack.Screen 
          name="DepartmentList" 
          component={DepartmentListScreen} 
          options={({ route }) => ({ title: route.params.department })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;