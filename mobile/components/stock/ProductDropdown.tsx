import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface VariantItem {
  id: number;
  sku: string;
  product: string;
  color?: string | null;
  size?: string | null;
}

interface ProductDropdownProps {
  value?: VariantItem | null;
  onSelect: (item: VariantItem | null) => void;
  error?: string | null;
}

export default function ProductDropdown({ value, onSelect, error }: ProductDropdownProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<VariantItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchVariants() {
      try {
        setLoading(true);
        // Try test server first (if running), fall back to real inventory API
        let json = null;
        try {
          const testRes = await fetch("http://localhost:5001/test/search");
          if (testRes.ok) {
            json = await testRes.json();
          }
        } catch (e) {
          // ignore test server errors and fallback
        }

        if (!json) {
          const res = await fetch("http://localhost:5000/api/inventory?page=1&pageSize=100");
          json = await res.json();
        }
        if (!mounted) return;
        const list = (json?.data?.items ?? []).map((it: any) => ({
          id: it.id,
          sku: it.sku,
          product: it.product,
          color: it.color,
          size: it.size,
        }));
        setItems(list);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchVariants();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.sku.toLowerCase().includes(q) || it.product.toLowerCase().includes(q));
  }, [items, query]);

  function handleSelect(item: VariantItem) {
    onSelect(item);
    setQuery(`${item.sku} — ${item.product}`);
    setOpen(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product</Text>

      <TextInput
        value={query}
        onChangeText={(t) => {
          setQuery(t);
          setOpen(true);
          if (t === "") onSelect(null);
        }}
        placeholder="Type SKU or product name"
        style={styles.input}
        onFocus={() => setOpen(true)}
        autoCapitalize="none"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {open && (
        <View style={styles.dropdown}>
          {loading ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <Pressable style={styles.row} onPress={() => handleSelect(item)}>
                  <Text style={styles.rowSku}>{item.sku}</Text>
                  <Text style={styles.rowProduct}>{item.product}</Text>
                </Pressable>
              )}
              style={{ maxHeight: 220 }}
            />
          )}
        </View>
      )}

      {value ? (
        <Text style={styles.selected}>Selected: {value.sku} — {value.product}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
    color: "#111827",
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 8,
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowSku: {
    fontWeight: "700",
    color: "#111827",
  },
  rowProduct: {
    color: "#6B7280",
  },
  selected: {
    marginTop: 8,
    color: "#374151",
  },
  error: {
    marginTop: 8,
    color: "#DC2626",
    fontSize: 13,
  },
});
