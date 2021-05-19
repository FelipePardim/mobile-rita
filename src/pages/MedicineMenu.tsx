import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";

import { useNavigation } from "@react-navigation/core";

import { MedicineProps } from "../libs/storage";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

import { Header } from "../components/Header";
import { Load } from "../components/Load";
import { Button } from "../components/Button";

export function MedicineMenu() {
    const navigation = useNavigation();
    const [medicineName, setMedicineName] = useState("");

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const [loading, setLoading] = useState(false);

    function handleInputBlur() {
        setIsFocused(false);
        setIsFilled(!!medicineName);
    }

    function handleInputFocus() {
        setIsFocused(true);
    }

    function handleInputMedicineName(value: string) {
        setIsFilled(!!value);
        setMedicineName(value);
    }

    async function handleSubmit() {
        if (!medicineName) {
            return Alert.alert("Por favor informe o nome do remédio 😥");
        }

        navigation.navigate("MedicineSaveDosage", {
            medicineName,
        });
    }

    function handleMedicineSelect(medicine: MedicineProps) {
        navigation.navigate("MedicineSaveName", { medicine });
    }

    if (loading) {
        return <Load />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />

                <Text style={styles.title}>Qual medicação você</Text>
                <Text style={styles.subtitle}>você deseja cadastrar?</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={[
                        styles.input,
                        (isFocused || isFilled) && {
                            borderColor: colors.green,
                        },
                    ]}
                    placeholder="Ex: Dipirona"
                    onBlur={handleInputBlur}
                    onFocus={handleInputFocus}
                    onChangeText={handleInputMedicineName}
                    value={medicineName}
                />
                <View style={styles.button}>
                    <Button title="Próximo" onPress={handleSubmit} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 27,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 35,
        marginTop: 35,
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 23,
        lineHeight: 30,
        color: colors.heading,
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
    },
    form: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 54,
        alignItems: "center",
    },
    button: {
        width: 150,
        marginTop: 20
    }
});
