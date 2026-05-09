// src/navigation/index.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Typography } from '../theme';

import LoginScreen    from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ClassesScreen  from '../screens/ClassesScreen';
import PlannerScreen  from '../screens/PlannerScreen';
import NotesScreen    from '../screens/NotesScreen';
import ProfileScreen  from '../screens/ProfileScreen';
import UploadScreen   from '../screens/UploadScreen';
import AdminScreen    from '../screens/AdminScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.6 }}>{emoji}</Text>
  );
}

function MainTabs({ route }: any) {
  const session = route?.params?.session || {};

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopWidth: 0,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.accentLight,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: -2 },
        headerStyle: { backgroundColor: Colors.primary, shadowOpacity: 0, elevation: 0 },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontFamily: Typography.heading, fontWeight: '700', fontSize: 18 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        initialParams={{ session }}
        options={{ title: 'Home', tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tab.Screen
        name="Classes"
        component={ClassesScreen}
        initialParams={{ session }}
        options={{ title: 'Classes', tabBarIcon: ({ focused }) => <TabIcon emoji="📚" focused={focused} /> }}
      />
      <Tab.Screen
        name="Planner"
        component={PlannerScreen}
        initialParams={{ session }}
        options={{ title: 'Planner', tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} /> }}
      />
      <Tab.Screen
        name="Notes"
        component={NotesScreen}
        initialParams={{ session }}
        options={{ title: 'Notes', tabBarIcon: ({ focused }) => <TabIcon emoji="📝" focused={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ session }}
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth screens */}
        <Stack.Screen name="Auth" component={AuthStack} />
        {/* Main app */}
        <Stack.Screen name="Main" component={MainTabs} />
        {/* Modal screens */}
        <Stack.Screen name="Upload" component={UploadScreen}
          options={{ headerShown: true, title: 'Upload Material', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white }} />
        <Stack.Screen name="Admin" component={AdminScreen}
          options={{ headerShown: true, title: '⚙ Admin Panel', headerStyle: { backgroundColor: Colors.primary }, headerTintColor: Colors.white }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const AuthStackNav = createStackNavigator();
function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login"    component={LoginScreen}    />
      <AuthStackNav.Screen name="Register" component={RegisterScreen} />
    </AuthStackNav.Navigator>
  );
}
