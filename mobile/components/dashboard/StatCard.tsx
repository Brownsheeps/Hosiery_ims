import { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconBackgroundColor: string;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBackgroundColor,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: iconBackgroundColor },
        ]}
      >
        {icon}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",
    paddingLeft:8,
    borderRadius: 16,

    

      

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconContainer: {
    width: 50,
    height: 50,

    borderRadius: 12,

    
    justifyContent: "center",
    alignItems: "center",

    marginRight: 16,
  },

  content: {
    flex: 1,
    padding:8,
  },

  title: {
    fontSize: 13,
    color: "#6B7280",

  },

  value: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
});