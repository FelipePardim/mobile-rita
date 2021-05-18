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
    Image
} from "react-native";

import { useUser } from "../contexts/User";

import { Button } from "../components/Button";

import rita from "../assets/RitaImg.png";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function UserLogin() {
    const { changeEmail, changePassword } = useUser();
    const navigation = useNavigation();

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();

    function handleInputBlur() {
        setIsFocused(false);
        setIsFilled(!!email);
    }

    function handleInputFocus() {
        setIsFocused(true);
    }

    function handleInputEmail(value: string) {
        setIsFilled(!!value);
        setEmail(value);
    }

    function handleInputPassword(value: string) {
        setIsFilled(!!value);
        setPassword(value);
    }

    async function handleSubmit() {
        if (!email) {
            return Alert.alert("Por favor informe o seu e-mail 😥");
        }

        if (!password) {
            return Alert.alert("Por favor informe a sua senha 😥");
        }

        if (password.length < 6) {
            return Alert.alert("A senha deve possuir ao menos 6 caracteres 😥");
        }

        try {
            await AsyncStorage.setItem("@plantmanager:user", email);
            changeEmail(email);
            await AsyncStorage.setItem("@plantmanager:help", "true");

            // REQUEST TO FIREBASE API
            // REQUEST TO RITA BACKEND
            // To login and retrieve user name

            navigation.navigate("Confirmation", {
                title: "Prontinho",
                subtitle:
                    "Agora vamos começar a cuidar das suas plantinhas com muito cuidado.",
                buttonTitle: "Começar",
                icon: "smile",
                nextScreen: "PlantSelect",
            });
        } catch (error) {
            return Alert.alert("Não foi possível logar com essa conta. 😥");
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
                            <View>
                                <Image
                                    source={rita}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                                <Text style={styles.title}>Insira suas credenciais para prosseguir...</Text>
                            </View>

                            <TextInput
                                style={[
                                    styles.input,
                                    (isFocused || isFilled) && {
                                        borderColor: colors.green,
                                    },
                                ]}
                                placeholder="Digite seu email"
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                                onChangeText={handleInputEmail}
                                value={email}
                                keyboardType={"email-address"}
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    (isFocused || isFilled) && {
                                        borderColor: colors.green,
                                    },
                                ]}
                                placeholder="Digite uma senha"
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                                onChangeText={handleInputPassword}
                                value={password}
                                secureTextEntry={true}
                            />
                            <View style={styles.footer}>
                                <Button title="Entrar" onPress={handleSubmit} />
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
    image: {
        width: 100,
        height: 100,
        marginLeft: 5
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