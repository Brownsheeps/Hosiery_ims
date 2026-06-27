import { View, StyleSheet } from "react-native";
import {
  MaterialCommunityIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";

import StatCard from "./StatCard";

interface StatsSectionProps {
  stats: {
    totalSku: number;
    totalStock: number;
    lowStock: number;
    outStock: number;
  };
}

export default function StatsSection({
  stats,
}: StatsSectionProps) {
  const cards = [
    {
      title: "Total SKUs",
      value: stats.totalSku,
      icon: (
        <MaterialCommunityIcons
          name="package-variant"
          size={28}
          color="#1D4ED8"
        />
      ),
      iconBackgroundColor: "#DBEAFE",
    },
    {
      title: "Total Stock",
      value: stats.totalStock,
      icon: (
        <MaterialCommunityIcons
          name="cube-outline"
          size={28}
          color="#16A34A"
        />
      ),
      iconBackgroundColor: "#DCFCE7",
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      icon: (
        <Feather
          name="alert-triangle"
          size={28}
          color="#D97706"
        />
      ),
      iconBackgroundColor: "#FEF3C7",
    },
    {
      title: "Out of Stock",
      value: stats.outStock,
      icon: (
        <AntDesign
          name="close-circle"
          size={28}
          color="#DC2626"
        />
      ),
      iconBackgroundColor: "#FEE2E2",
    },
  ];

  return (
    <View style={styles.container}>
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconBackgroundColor={card.iconBackgroundColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    rowGap: 16,
  },
});