import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/core";

import { MedicineProps } from "../libs/storage";
import api from "../services/api";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

import { Header } from "../components/Header";
import { EnvironmentButton } from "../components/EnvironmentButton";
import { MedicineCardPrimary } from "../components/MedicineCardPrimary";
import { Load } from "../components/Load";

interface EnvironmentProps {
    key: string;
    title: string;
}

export function MedicineSelect() {
    const navigation = useNavigation();
    const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
    const [medicines, setMedicines] = useState<MedicineProps[]>([]);
    const [filteredMedicines, setFilteredMedicines] = useState<MedicineProps[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState("all");
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMorePages, setLoadingMorePages] = useState(false);

    function handleEnvironmentSelected(environment: string) {
        setEnvironmentSelected(environment);

        if (environment === "all") {
            setFilteredMedicines(medicines);
            return;
        }

        const filtered = medicines.filter((medicine) =>
        medicine.environments.includes(environment)
        );

        setFilteredMedicines(filtered);
    }

    async function fetchMedicines() {
        const { data } = await api.get<MedicineProps[]>(
            `medicines?_sort=name&_order=asc&_page=${page}&_limit=8`
        );

        if (!data) {
            setLoading(true);
        }

        if (data.length === 0) {
            setPage((oldValue) => oldValue - 1);
        }

        if (page > 1) {
            setMedicines((oldValue) => [...oldValue, ...data]);
            setFilteredMedicines((oldValue) => [...oldValue, ...data]);
        } else {
            setMedicines(data);
            setFilteredMedicines(data);
        }

        setLoading(false);
        setLoadingMorePages(false);
    }

    function handleFetchMorePages(distance: number) {
        if (distance < 1) return;

        setLoadingMorePages(true);
        setPage((oldValue) => oldValue + 1);
        fetchMedicines();
    }

    function handleMedicineSelect(medicine: MedicineProps) {
        navigation.navigate("MedicineSave", { medicine });
    }

    useEffect(() => {
        async function fetchEnvironment() {
            const { data } = await api.get(
                "medicines_environments?_sort=title&_order=asc"
            );
            setEnvironments([
                {
                    key: "all",
                    title: "Todos",
                },
                ...data,
            ]);
        }

        fetchEnvironment();
    }, []);

    useEffect(() => {
        fetchMedicines();
    }, []);

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

            {/* <View>
                <FlatList
                    data={environments}
                    keyExtractor={(item) => String(item.key)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.environmentList}
                    renderItem={({ item }) => (
                        <EnvironmentButton
                            title={item.title}
                            active={item.key === environmentSelected}
                            onPress={() => handleEnvironmentSelected(item.key)}
                        />
                    )}
                />
            </View>

            <View style={styles.medicines}>
                <FlatList
                    data={filteredMedicines}
                    keyExtractor={(item) => String(item.id)}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) =>
                        handleFetchMorePages(distanceFromEnd)
                    }
                    ListFooterComponent={
                        loadingMorePages ? (
                            <ActivityIndicator color={colors.green} />
                        ) : (
                            <></>
                        )
                    }
                    renderItem={({ item }) => (
                        <MedicineCardPrimary
                            data={item}
                            onPress={() => handleMedicineSelect(item)}
                        />
                    )}
                />
            </View> */}
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
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15,
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading,
    },
    environmentList: {
        height: 40,
        justifyContent: "center",
        paddingBottom: 5,
        marginVertical: 32,
        marginLeft: 32,
        paddingRight: 32 * 2,
    },
    medicines: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: "center",
    },
});
