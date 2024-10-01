import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import registerNNPushToken from 'native-notify';

import { Registration } from './Pages/Registration';
import { Login } from './Pages/Login';
import { Fines } from './Pages/Fines';
import { Teammates } from './Pages/Teammates';
import { AssignFine } from './Pages/AssignFine';
import { CreateTeam } from './Pages/CreateTeam';
import { CreatePriceList } from './Pages/CreatePriceList';
import { Overview } from './Pages/Overview';
import { Invitations } from './Pages/Invitations';
import { AddTeammate } from './Pages/AddTeammate';
import { AppSettingsProvider } from './Pages/AppSettings';
import { Profile } from './Pages/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  registerNNPushToken(20890, 'dUuqoukOiDlPhBX9YZys5Q');

  return (
    <AppSettingsProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: 'Prihlásenie' }}
          />
          <Stack.Screen
            name="Registration"
            component={Registration}
            options={{ title: 'Registrácia' }}
          />
          <Stack.Screen
            name="Fines"
            component={Fines}
            options={{ title: 'Pokuty' }}
          />
          <Stack.Screen
            name="Teammates"
            component={Teammates}
            options={{ title: 'Spoluhráči' }}
          />
          <Stack.Screen
            name="AssignFine"
            component={AssignFine}
            options={{ title: 'Prideliť pokutu' }}
          />
          <Stack.Screen
            name="CreateTeam"
            component={CreateTeam}
            options={{ title: 'Vytvoriť tím' }}
          />
          <Stack.Screen
            name="CreatePriceList"
            component={CreatePriceList}
            options={{ title: 'Vytvoriť cenník' }}
          />
          <Stack.Screen
            name="Overview"
            component={Overview}
            options={{ title: 'Prehľad mesiaca' }}
          />
          <Stack.Screen
            name="Invitations"
            component={Invitations}
            options={{ title: 'Pozvánky' }}
          />
          <Stack.Screen
            name="AddTeammate"
            component={AddTeammate}
            options={{ title: 'Pridať spoluhráča' }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ title: 'Profil' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppSettingsProvider>
  );
};
