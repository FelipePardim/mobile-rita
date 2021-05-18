import React, { useEffect, useState } from "react";

import { View, StyleSheet, Text, Image, FlatList, Alert } from "react-native";

import { loadMedicines, MedicineProps, removeMedicine } from "../libs/storage";
import { formatDistance } from "date-fns";
import { pt } from "date-fns/locale";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

import { MaterialIcons } from "@expo/vector-icons";

import { Header } from "../components/Header";
import { MedicineCardSecundary } from "../components/MedicineCardSecundary";
import { Load } from "../components/Load";

export function MyMedicines() {
  const [myMedicines, setMyMedicines] = useState<MedicineProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWaterd] = useState<string>();

  function handleRemove(medicine: MedicineProps) {
    Alert.alert("Remover", `Deseja remover a ${medicine.name}?`, [
      {
        text: "Não 🙏",
        style: "cancel",
      },
      {
        text: "Sim 😥",
        onPress: async () => {
          try {
            await removeMedicine(medicine.id);

            setMyMedicines((oldMedicines) =>
              oldMedicines.filter((item) => item.id !== medicine.id)
            );

            if (myMedicines[0].id === medicine.id && myMedicines[1]) {
              const nextTime = formatDistance(
                new Date(myMedicines[1].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
              );

              setNextWaterd(
                `Regue sua ${myMedicines[1].name} daqui a ${nextTime}`
              );
              return;
            }

            if (myMedicines[0].id === medicine.id && !myMedicines[1]) {
              setNextWaterd(`Você ainda não tem medicações. 😥`);
              setMyMedicines([]);
              return;
            }
          } catch (error) {
            Alert.alert("Não foi possível remover! 😥");
            console.log(error);
          }
        },
      },
    ]);
  }

  useEffect(() => {
    async function loadStorageData() {
      const medicineStorage = await loadMedicines();

      if (!medicineStorage[0]) {
        setMyMedicines([]);
        setNextWaterd(`Você ainda não tem medicações. 😥`);
        setLoading(false);
        return;
      }

      const nextTime = formatDistance(
        new Date(medicineStorage[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      );

      setNextWaterd(`Tome a medicação ${medicineStorage[0].name} daqui a ${nextTime}`);

      setMyMedicines(medicineStorage);
      setLoading(false);
    }

    loadStorageData();
  }, []);

  if (loading) {
    return <Load />;
  }

  return (
    <View style={styles.container}>
      <Header title="Minhas" subtitle="Medicações" />

      <View style={styles.spotlight}>
        <MaterialIcons name="medical-services" size={60} color={colors.blue} />

        <Text style={styles.spotlightText}>{nextWaterd}</Text>
      </View>

      <View style={styles.medicines}>
        <Text style={styles.medicinesTitle}>Próximas Medicações:</Text>

        <FlatList
          data={myMedicines}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <MedicineCardSecundary
              data={item}
              handleRemove={() => handleRemove(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },

  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },

  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },

  medicines: {
    flex: 1,
    width: "100%",
  },
  medicinesTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
