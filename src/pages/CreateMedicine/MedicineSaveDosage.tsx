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
    TextInput,
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
}

export function MedicineSaveDosage() {
    const route = useRoute();
    const navigation = useNavigation();
    const { medicineName } = route.params as ParamsPageMedicineSave;

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const [dosage, setDosage] = useState("");

    function handleInputBlur() {
        setIsFocused(false);
        setIsFilled(!!dosage);
    }

    function handleInputFocus() {
        setIsFocused(true);
    }

    function handleInputMedicineName(value: string) {
        setIsFilled(!!value);
        setDosage(value);
    }

    async function handleSubmit() {
        if (!dosage) {
            return Alert.alert("Por favor informe a dosagem do remédio 😥");
        }

        navigation.navigate("MedicineSaveName", {
            medicineName,
            dosage,
        });
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.medicineInfo}>
                    <Text style={styles.medicineName}>
                        Dose da medicação: {medicineName}
                    </Text>
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <MaterialIcons
                            name="medical-services"
                            size={60}
                            color={colors.blue}
                        />
                        <Text style={styles.tipText}>
                            Você irá cadastrar a medicação: {medicineName}
                        </Text>
                    </View>

                    <Text style={styles.alertLabel}>
                        Informe a dosagem da medicação:
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            (isFocused || isFilled) && {
                                borderColor: colors.green,
                            },
                        ]}
                        placeholder="Ex: 15ml"
                        onBlur={handleInputBlur}
                        onFocus={handleInputFocus}
                        onChangeText={handleInputMedicineName}
                        value={dosage}
                    />

                    <Button title="Próximo" onPress={handleSubmit} />
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
        marginTop: 150,
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
        bottom: 16,
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
        // marginBottom: 50,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.gray,
        color: colors.heading,
        width: "100%",
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: "center",
        marginBottom: 120
    },
});
