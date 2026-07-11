import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import { API_BASE_URL } from "@/constants/api";
import { ProductDropdownProps, ProductSearchItem } from "./interface/types";


export default function ProductDropdown({ value, onSelect, error }: ProductDropdownProps) {

  const [query, setQuery] = useState("");
  const [items, setItems] = useState<ProductSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function handleSearch(text: string) {
    setQuery(text);
    onSelect(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const q = text.trim();

    if (q.length < 2) {
      setItems([]);
      setOpen(false);
      return;
    }

    setOpen(true);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch( `${API_BASE_URL}/api/products/search?q=${encodeURIComponent(q)}`);

        if (!response.ok) {
          setItems([]);
          return;
        }

        const json = await response.json();
        setItems(json.data.items ?? []);

      } 
      catch (error) {
      console.error(error);
      setItems([]);

      } finally {
        setLoading(false);
      }
    }, 300);
  }

  useEffect(() => {
    if (!value) {
      setQuery("");
      setItems([]);
      setOpen(false);
    }
  }, [value]);

  function handleSelect(item: ProductSearchItem) {
    onSelect(item);
    setQuery(`${item.sku} — ${item.productName}`);
    setOpen(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product</Text>

      <TextInput
        value={query}
        onChangeText={handleSearch}
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
              data={items}
              keyExtractor={(item) => String(item.variantId)}
              renderItem={({ item }) => (
                <Pressable style={styles.row} onPress={() => handleSelect(item)}>
                  <Text style={styles.rowSku}>{item.sku}</Text>
                  <Text style={styles.rowProduct}>{item.productName}</Text>
                </Pressable>
              )}
              style={{ maxHeight: 220 }}
            />
          )}
        </View>
      )}

      {value ? (
        <Text style={styles.selected}>Selected: {value.sku} — {value.productName}</Text>
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
