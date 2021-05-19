import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";

import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { format, isBefore, subHours } from "date-fns";

import { useNavigation, useRoute } from "@react-navigation/core";

import { getBottomSpace } from "react-native-iphone-x-helper";
import { SvgFromUri } from "react-native-svg";

import { loadMedicines, MedicineProps, saveMedicine } from "../../libs/storage";

import colors from "../../styles/colors";
import fonts from "../../styles/fonts";

import { Button } from "../../components/Button";
import { MaterialIcons } from "@expo/vector-icons";

interface ParamsPageMedicineSave {
  medicineName: string;
  dosage: string;
}

export function MedicineSaveName() {
  const route = useRoute();
  const navigation = useNavigation();
  const { medicineName, dosage } = route.params as ParamsPageMedicineSave;

  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");

  function handleChangeTime(event: Event, dateTime: Date | undefined) {
    if (Platform.OS === "android") {
      setShowDatePicker((oldState) => !oldState);
    }

    // console.log(dateTime);
    // console.log(new Date());
    // console.log(isBefore(dateTime!, new Date()));
    // console.log(isBefore(dateTime!, new Date("2021-04-23T12:00:08.862Z")));

    if (dateTime && isBefore(dateTime, new Date())) {
      setSelectedDateTime(new Date());
      return Alert.alert("Escolha uma hora no futuro! ⏰");
    }

    if (dateTime) {
      setSelectedDateTime(dateTime);
    }
  }

  function handleOpenDateTimePickerForAndroid() {
    setShowDatePicker((oldState) => !oldState);
  }

  async function handleSaveMedicine() {
    // console.log(subHours(selectedDateTime, 3));
    if (selectedDateTime && isBefore(selectedDateTime, new Date())) {
      setSelectedDateTime(new Date());
      return Alert.alert("Escolha uma hora no futuro! ⏰");
    }
    try {
      await saveMedicine({
        // HARD CODED ID
        id: '5',
        name: medicineName,
        dosage: dosage,
        dateTimeNotification: selectedDateTime,
        frequency: {
          times: 2,
          repeat_every: "day"
        }
      });
      // const data = await loadMedicines();
      // console.log(data);

      navigation.navigate("MyMedicines");
    } catch {
      Alert.alert("Não foi possível salvar. 😥");
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>Medicação: {medicineName}</Text>
        </View>

        <View style={styles.controller}>
          <View style={styles.tipContainer}>
            <MaterialIcons name="medical-services" size={60} color={colors.blue} />
            <Text style={styles.tipText}>Você irá cadastrar a medicação: {medicineName}</Text>
          </View>

          <Text style={styles.alertLabel}>
            Escolha o melhor horário para ser lembrado:
          </Text>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDateTime}
              mode="time"
              display="spinner"
              onChange={handleChangeTime}
            />
          )}

          {Platform.OS === "android" && (
            <TouchableOpacity
              onPress={handleOpenDateTimePickerForAndroid}
              style={styles.dateTimePickerButton}
            >
              <Text style={styles.dateTimePickerText}>
                {`Mudar ${format(selectedDateTime, "HH:mm")}`}
              </Text>
            </TouchableOpacity>
          )}

          <Button title="Cadastrar Medicação" onPress={handleSaveMedicine} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.shape,
  },
  medicineInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.shape,
  },
  medicineName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15,
  },
  medicineAbout: {
    textAlign: "center",
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10,
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20,
  },
  tipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: "relative",
    bottom: 60,
  },
  tipImage: {
    width: 56,
    height: 56,
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
  },
  alertLabel: {
    textAlign: "center",
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 17,
    marginBottom: 5,
  },
  dateTimePickerButton: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 30,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
  },
});
