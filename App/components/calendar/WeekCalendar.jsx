import {
    View,
    StyleSheet,
    Text
} from "react-native"
import { Ionicons } from "@expo/vector-icons";

export default function WeekCalendar({ checkedDays = [] }) {

    const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <View style={styles.circleIcon}>
                    <Ionicons name="barbell-outline" size={20} color="#FFF" />
                </View>
                <Text style={styles.title}>Seus treinos durante a semana</Text>
            </View>

            <View style={styles.divider} />

            {/* Dias da semana */}
            <View style={styles.weekRow}>
                {days.map((day) => {
                    const isChecked = checkedDays.includes(day);
                    return (
                        <View key={day} style={styles.dayContainer}>
                            <Text style={styles.dayText}>{day}</Text>
                            <View
                                style={[
                                    styles.circle,
                                    isChecked ? styles.circleChecked : styles.circleEmpty,
                                ]}
                            >
                                {isChecked && (
                                    <Ionicons name="checkmark" size={18} color="#FFF" />
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1C1C1E",
        borderRadius: 16,
        padding: 16,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },

    title: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },

    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.2)",
        marginVertical: 8,
    },

    weekRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
    },

    dayContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 40,
    },

    dayText: {
        color: "#FFF",
        fontSize: 13,
        marginBottom: 6,
    },

    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },

    circleIcon: {
        padding: 6,
        borderRadius: 100,
        borderColor: "white",
        borderWidth: 0.5
    },

    circleChecked: {
        backgroundColor: "#2ECC71", // verde quando feito
    },

    circleEmpty: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
});