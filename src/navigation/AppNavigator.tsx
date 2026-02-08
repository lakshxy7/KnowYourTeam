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

// --- TYPES ---
export type RootStackParamList = {
  MainTabs: undefined;
  CreateProject: undefined; // Modal lives at Root
};

// Stack 1: Directory
export type DirectoryStackParamList = {
  DirectoryMain: undefined;
  DepartmentList: { department: string };
  EmployeeDetails: { user: User };
};

// Stack 2: Departments
export type DepartmentStackParamList = {
  DepartmentMain: undefined;
  DepartmentList: { department: string };
  EmployeeDetails: { user: User };
};

// Stack 3: Projects (✅ New Nested Stack)
export type ProjectsStackParamList = {
  ProjectsMain: undefined;
  ProjectDetails: { project: Project };
  EmployeeDetails: { user: User }; // In case you click a member in the project view
};

// Stack 4: My Team (✅ New Nested Stack)
export type MyTeamStackParamList = {
  MyTeamMain: undefined;
  EmployeeDetails: { user: User };
};

export type TabParamList = {
  DirectoryStack: undefined;
  DepartmentStack: undefined;
  ProjectsStack: undefined;
  MyTeamStack: undefined;
};

// --- NAVIGATORS ---
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const DirStack = createNativeStackNavigator<DirectoryStackParamList>();
const DeptStack = createNativeStackNavigator<DepartmentStackParamList>();
const ProjStack = createNativeStackNavigator<ProjectsStackParamList>();
const TeamStack = createNativeStackNavigator<MyTeamStackParamList>();

// 1. Directory Stack
const DirectoryStackNavigator = () => (
  <DirStack.Navigator screenOptions={{ headerTitleAlign: 'center', headerBackTitle: 'Back' }}>
    <DirStack.Screen 
      name="DirectoryMain" 
      component={DirectoryScreen} 
      options={{ title: 'Know Your Team' }} 
    />
    <DirStack.Screen 
      name="DepartmentList" 
      component={DepartmentListScreen} 
      options={({ route }) => ({ title: route.params.department })} 
    />
    <DirStack.Screen 
      name="EmployeeDetails" 
      component={EmployeeDetailsScreen} 
      options={{ title: 'Profile' }} 
    />
  </DirStack.Navigator>
);

// 2. Department Stack
const DepartmentStackNavigator = () => (
  <DeptStack.Navigator screenOptions={{ headerTitleAlign: 'center', headerBackTitle: 'Back' }}>
    <DeptStack.Screen 
      name="DepartmentMain" 
      component={DepartmentScreen} 
      options={{ title: 'Departments' }} 
    />
    <DeptStack.Screen 
      name="DepartmentList" 
      component={DepartmentListScreen} 
      options={({ route }) => ({ title: route.params.department })} 
    />
    <DeptStack.Screen 
      name="EmployeeDetails" 
      component={EmployeeDetailsScreen} 
      options={{ title: 'Profile' }} 
    />
  </DeptStack.Navigator>
);

// 3. Projects Stack (✅ Fixes Lag)
const ProjectsStackNavigator = () => (
  <ProjStack.Navigator screenOptions={{ headerTitleAlign: 'center', headerBackTitle: 'Back' }}>
    <ProjStack.Screen 
      name="ProjectsMain" 
      component={ProjectsScreen} 
      options={{ title: 'Projects' }} 
    />
    <ProjStack.Screen 
      name="ProjectDetails" 
      component={ProjectDetailsScreen} 
      options={{ title: 'Project Overview' }} 
    />
    <ProjStack.Screen 
      name="EmployeeDetails" 
      component={EmployeeDetailsScreen} 
      options={{ title: 'Profile' }} 
    />
  </ProjStack.Navigator>
);

// 4. My Team Stack (✅ Fixes Lag)
const MyTeamStackNavigator = () => (
  <TeamStack.Navigator screenOptions={{ headerTitleAlign: 'center', headerBackTitle: 'Back' }}>
    <TeamStack.Screen 
      name="MyTeamMain" 
      component={MyTeamScreen} 
      options={{ title: 'My Team' }} 
    />
    <TeamStack.Screen 
      name="EmployeeDetails" 
      component={EmployeeDetailsScreen} 
      options={{ title: 'Profile' }} 
    />
  </TeamStack.Navigator>
);

// --- MAIN TABS ---
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // All headers handled by Stacks
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 70, 
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
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
        tabBarIcon: ({ focused, color }) => {
          let iconSource;
          if (route.name === 'DirectoryStack') iconSource = iconHome;
          else if (route.name === 'DepartmentStack') iconSource = iconDept;
          else if (route.name === 'MyTeamStack') iconSource = iconTeam;
          else if (route.name === 'ProjectsStack') iconSource = iconProject;
          
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
      <Tab.Screen 
        name="DirectoryStack" 
        component={DirectoryStackNavigator} 
        options={{ title: 'Directory' }} 
      />
      <Tab.Screen 
        name="DepartmentStack" 
        component={DepartmentStackNavigator} 
        options={{ title: 'Departments' }} 
      />
      <Tab.Screen 
        name="ProjectsStack" 
        component={ProjectsStackNavigator} 
        options={{ title: 'Projects' }} 
      />
      <Tab.Screen 
        name="MyTeamStack" 
        component={MyTeamStackNavigator} 
        options={{ title: 'My Team' }} 
      />
    </Tab.Navigator>
  );
};

// --- APP ROOT ---
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        {/* The Main App */}
        <Stack.Screen 
          name="MainTabs" 
          component={BottomTabs} 
          options={{ headerShown: false }} 
        />
        
        {/* Global Modals (Like 'Create Project') stay at Root to slide OVER everything */}
        <Stack.Screen 
          name="CreateProject" 
          component={CreateProjectScreen} 
          options={{ 
            title: 'New Project', 
            presentation: 'modal',
            headerTitleAlign: 'center'
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;