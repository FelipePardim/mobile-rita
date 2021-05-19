import React, { useState } from "react";

import { useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
    Alert,
} from "react-native";

import { useUser } from "../contexts/User";

import { Button } from "../components/Button";

import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { useRoute } from "@react-navigation/native";
import firebase from "./../services/firebaseConfig";
import api from "./../services/api";

interface userData {
    email: string;
    password: string;
}

export function UserIdentification() {
    const { changeName } = useUser();
    const navigation = useNavigation();

    const route = useRoute();
    const { email, password } = route.params as userData;

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [name, setName] = useState<string>();

    function handleInputBlur() {
        setIsFocused(false);
        setIsFilled(!!name);
    }

    function handleInputFocus() {
        setIsFocused(true);
    }

    function handleInputChange(value: string) {
        setIsFilled(!!value);
        setName(value);
    }

    async function handleRegister() {
        api.post("/users", {
            email,
            password,
            type: 0, // Common user type
            name,
        })
            .then((response) => {
                console.log(response);
                if (response.status === 200 || response.status === 201) {
                    Alert.alert("Parabéns você foi cadastrado 🎉");
                } else if (response.status === 500) {
                  Alert.alert("Erro de servidor ⚠️");
                } else if (response.status === 401) {
                  Alert.alert("Usuário ou senha incorretos ⚠️");
                }
            })
            .catch((response) => {
                alert(response.message);
            });
    }

    async function handleSubmit() {
        if (!name) {
            return Alert.alert("Me diz como chamar você 😥");
        }

        try {
            changeName(name);

            console.log(
                `Email: ${email}\nPassword: ${password}\nName: ${name}`
            );

            await handleRegister();

            navigation.navigate("Confirmation", {
                title: "Prontinho",
                subtitle: "Agora vamos começar a cuidar dos seus medicamentos",
                buttonTitle: "Começar",
                icon: "smile",
                nextScreen: "UserLogin",
            });
        } catch (error) {
            return Alert.alert("Não foi possível salvar o seu nome. 😥");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <View style={styles.header}>
                                <Text style={styles.emoji}>
                                    {isFilled ? "😆" : "😀"}
                                </Text>
                                <Text style={styles.title}>
                                    Como posso {"\n"} chamar você?
                                </Text>
                            </View>

                            <TextInput
                                style={[
                                    styles.input,
                                    (isFocused || isFilled) && {
                                        borderColor: colors.green,
                                    },
                                ]}
                                placeholder="Digite seu nome"
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                                onChangeText={handleInputChange}
                                value={name}
                            />
                            <View style={styles.footer}>
                                <Button
                                    title="Confirmar"
                                    onPress={handleSubmit}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around",
    },
    content: {
        flex: 1,
        width: "100%",
    },
    form: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 54,
        alignItems: "center",
    },
    header: {
        alignItems: "center",
    },
    emoji: {
        fontSize: 44,
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
    title: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: "center",
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20,
    },
    footer: {
        width: "100%",
        marginTop: 40,
        paddingHorizontal: 20,
    },
});
