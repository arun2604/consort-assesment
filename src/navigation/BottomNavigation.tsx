import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Tasks from '../screens/Tasks';
import LoginStatus from '../screens/LoginStatus';

const TabArr = [
    {
        route: 'profile',
        label: 'Profile',
        IconComponent: FontAwesome,
        activeIcon: 'tasks',
        inActiveIcon: 'tasks',
        component: Tasks,
    },
    {
        route: 'status',
        label: 'Login-status',
        IconComponent: MaterialCommunityIcons,
        activeIcon: 'login',
        inActiveIcon: 'login',
        component: LoginStatus,
    }
];

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="profile"
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: styles.tabBar,
                }}
            >
                {TabArr.map((tab, index) => (
                    <Tab.Screen
                        key={index}
                        name={tab.route}
                        component={tab.component}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => {
                                const IconComponent = tab.IconComponent;
                                return (
                                    <IconComponent
                                        name={focused ? tab.activeIcon : tab.inActiveIcon}
                                        size={size}
                                        color={focused ? 'blue' : 'gray'}
                                    />
                                );
                            },
                        }}
                    />
                ))}
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default BottomNavigation;

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        height: 60,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});
