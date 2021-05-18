import React from "react";

import { useNavigation } from "@react-navigation/core";

import {
    Text,
    SafeAreaView,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    View,
} from "react-native";

import hospitalTeam from "../assets/medicine.png";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function Welcome() {
    const navigation = useNavigation();

    function handleCreateAccount() {
        navigation.navigate("UserEmail");
    }

    function handleLogin() {
        navigation.navigate("UserLogin");
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapper}>
                <Image
                    source={hospitalTeam}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>
                    Conheça a Rita, sua assistente para consumo de medicamentos
                </Text>

                <Text style={styles.subtitle}>
                    Rita foi criada para que você nunca mais se esqueça de seus
                    medicamentos
                </Text>

                <TouchableOpacity
                    style={styles.createButton}
                    activeOpacity={0.7}
                    onPress={handleCreateAccount}
                >
                    <Text style={styles.createButtonText}>Criar uma conta</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.loginButton}
                    activeOpacity={0.7}
                    onPress={handleLogin}
                >
                    <Text style={styles.loginButtonText}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        textAlign: "center",
        color: "black",
        fontFamily: fonts.heading,
        lineHeight: 24,
    },
    subtitle: {
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: 15,
        color: "black",
        fontFamily: fonts.text,
    },
    image: {
        height: Dimensions.get("window").width * 0.7,
    },
    createButton: {
        backgroundColor: colors.green,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        marginBottom: 10,
        height: 56,
        width: 220,
    },
    loginButton: {
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.green,
        marginBottom: 10,
        height: 56,
        width: 220,
    },
    createButtonText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        paddingHorizontal: 15,
        color: "white",
        fontFamily: fonts.text,
    },
    loginButtonText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        paddingHorizontal: 15,
        color: colors.green,
        fontFamily: fonts.text,
    },
});
