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

import { useUser } from "../../contexts/User";

import { Button } from "../../components/Button";

import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { useRoute } from "@react-navigation/native";

interface userEmail {
    email: string;
}

export function UserPassword() {
    const { changePassword } = useUser();
    const navigation = useNavigation();

    const route = useRoute();
    const { email } = route.params as userEmail;

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [password, setPassword] = useState<string>();
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>();

    function handleInputBlur() {
        setIsFocused(false);
        setIsFilled(!!password);
    }

    function handleInputFocus() {
        setIsFocused(true);
    }

    function handleInputChange(value: string) {
        setIsFilled(!!value);
        setPassword(value);
    }

    function handlePasswordConfirmation(value: string) {
      setIsFilled(!!value);
      setPasswordConfirmation(value);
  }

    async function handleSubmit() {
        if (!password) {
            return Alert.alert("Você esqueceu de informar uma senha 😥");
        }

        if (!passwordConfirmation) {
          return Alert.alert("Você esqueceu de confirmar a sua senha 😥");
        }

        if (password != passwordConfirmation) {
          return Alert.alert("As senhas não são iguais 😥");
        }

        try {
            await AsyncStorage.setItem("@plantmanager:user", password);
            changePassword(password);
            await AsyncStorage.setItem("@plantmanager:help", "true");

            navigation.navigate("UserIdentification", {
                email: email,
                password: password
            });
        } catch (error) {
            return Alert.alert("Não foi possível salvar o sua senha. 😥");
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
                                    Crie uma senha
                                </Text>
                            </View>

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
                                onChangeText={handleInputChange}
                                value={password}
                                secureTextEntry={true}
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    (isFocused || isFilled) && {
                                        borderColor: colors.green,
                                    },
                                ]}
                                placeholder="Repita a senha"
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                                onChangeText={handlePasswordConfirmation}
                                value={passwordConfirmation}
                                secureTextEntry={true}
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
