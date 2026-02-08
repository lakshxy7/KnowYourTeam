import React from 'react';
import { Image, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import DirectoryScreen from '../screens/DirectoryScreen';
import DepartmentScreen from '../screens/DepartmentScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import EmployeeDetailsScreen from '../screens/EmployeeDetailScreen';
import DepartmentListScreen from '../screens/DepartmentListScreen';

import ProjectsScreen from '../screens/ProjectsScreen';
import CreateProjectScreen from '../screens/CreateProjectsScreen';
import ProjectDetailsScreen from '../screens/ProjectDetailsScreen';

import { User, Project } from '../types'; 

const iconHome = require('../assets/icons/home.png');
const iconDept = require('../assets/icons/department.png');
const iconTeam = require('../assets/icons/team.png');
const iconProject = require('../assets/icons/project.png'); 

export type RootStackParamList = {
  MainTabs: undefined;
  CreateProject: undefined;
  ProjectDetails: { project: Project };
  EmployeeDetails: { user: User }; 
};

export type DirectoryStackParamList = {
  DirectoryMain: undefined;
  DepartmentList: { department: string };
  EmployeeDetails: { user: User };
};

export type TabParamList = {
  DirectoryStack: undefined;
  Departments: undefined;
  MyTeam: undefined;
  Projects: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// 🆕 1. Nested Stack for Directory Tab
const DirStack = createNativeStackNavigator<DirectoryStackParamList>();

const DirectoryStackNavigator = () => {
  return (
    <DirStack.Navigator>
      <DirStack.Screen 
        name="DirectoryMain" 
        component={DirectoryScreen} 
        options={{ title: 'Know Your Team', headerTitleAlign: 'center' }} 
      />
      <DirStack.Screen 
        name="DepartmentList" 
        component={DepartmentListScreen} 
        options={({ route }) => ({ title: route.params.department, headerTitleAlign: 'center' })} 
      />
      <DirStack.Screen 
        name="EmployeeDetails" 
        component={EmployeeDetailsScreen} 
        options={{ 
          title: 'Profile', 
          headerBackTitle: 'Back',
          headerTitleAlign: 'center'
        }} 
      />
    </DirStack.Navigator>
  );
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide Tab Header (Stack handles it)
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerTitleAlign: 'center',
        // 🎨 Premium Tab Bar Styling
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 70, 
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          // Soft Shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;
          if (route.name === 'DirectoryStack') iconSource = iconHome;
          else if (route.name === 'Departments') iconSource = iconDept;
          else if (route.name === 'MyTeam') iconSource = iconTeam;
          else if (route.name === 'Projects') iconSource = iconProject;
          
          return (
            <Image 
              source={iconSource} 
              style={{ width: 24, height: 24, tintColor: color }} 
              resizeMode="contain"
            />
          );
        },
      })}
    >
      {/* 🆕 2. Use the Stack inside the Tab */}
      <Tab.Screen 
        name="DirectoryStack" 
        component={DirectoryStackNavigator} 
        options={{ title: 'Directory' }} 
      />
      
      <Tab.Screen 
        name="Departments" 
        component={DepartmentScreen} 
        options={{ title: 'Departments', headerShown: true }} 
      />
      <Tab.Screen 
        name="Projects" 
        component={ProjectsScreen} 
        options={{ title: 'Projects', headerShown: true }} 
      />
      <Tab.Screen 
        name="MyTeam" 
        component={MyTeamScreen} 
        options={{ title: 'My Team', headerShown: true }} 
      />
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
        
        {/* Global Modal */}
        <Stack.Screen 
          name="CreateProject" 
          component={CreateProjectScreen} 
          options={{ 
            title: 'New Project', 
            presentation: 'modal',
            headerTitleAlign: 'center'
          }} 
        />
        
        {/* Project Details */}
        <Stack.Screen 
          name="ProjectDetails" 
          component={ProjectDetailsScreen} 
          options={{ title: 'Project Overview', headerTitleAlign: 'center' }} 
        />
        
        {/* Fallback Access */}
        <Stack.Screen 
          name="EmployeeDetails" 
          component={EmployeeDetailsScreen} 
          options={{ title: 'Profile', headerTitleAlign: 'center' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;