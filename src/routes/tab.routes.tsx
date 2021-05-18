import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import colors from "../styles/colors";

import { MaterialIcons } from "@expo/vector-icons";

import { MedicineSelect } from "../pages/MedicineSelect";
import { MyMedicines } from "../pages/MyMedicines";

const AppTab = createBottomTabNavigator();

const AuthRoutes: React.FC = () => (
  <AppTab.Navigator
    tabBarOptions={{
      activeTintColor: colors.green,
      inactiveTintColor: colors.body_light,
      labelPosition: "beside-icon",
      style: {
        borderTopWidth: 0,
        borderTopStartRadius: 60,
        borderTopEndRadius: 60,
        height: 88,
        paddingVertical: Platform.OS === "ios" ? 20 : 0,
      },
    }}
  >
    <AppTab.Screen
      name="Nova Medicação"
      component={MedicineSelect}
      options={{
        tabBarIcon: ({ size, color }) => (
          <MaterialIcons name="add-circle-outline" size={size} color={color} />
        ),
      }}
    />

    <AppTab.Screen
      name="Minhas Medicações"
      component={MyMedicines}
      options={{
        tabBarIcon: ({ size, color }) => (
          <MaterialIcons
            name="format-list-bulleted"
            size={size}
            color={color}
          />
        ),
      }}
    />
  </AppTab.Navigator>
);

export default AuthRoutes;
