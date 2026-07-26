import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MetaOption } from "@/components/add-product/types";

type CodeField = "brandCode" | "colourCode" | "sizeCode";

interface SelectFieldProps {
  label: string;
  value: MetaOption | null;
  placeholder: string;
  options: MetaOption[];
  onChange: (value: MetaOption) => void;
  codeField?: CodeField; // if set, auto-derive code when creating new
}


export default function SelectField({ label, value, placeholder, options, onChange, codeField }: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = options.filter((o) => o.name.toLowerCase().includes(q));
  const canCreate = query.trim().length > 0 && !options.some((o) => o.name.toLowerCase() === q);

  function close() { setOpen(false); setQuery(""); }

  function select(option: MetaOption) { onChange(option); close(); }

  function create() {
    const name = query.trim();
    // Auto-derive code: first 3 non-space chars, uppercase
    const derivedCode = name.replace(/\s+/g, "").slice(0, 3).toUpperCase();
    const option: MetaOption = { id: null, name, isNew: true };
    if (codeField) (option as any)[codeField] = derivedCode;
    onChange(option);
    close();
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.select} onPress={() => setOpen(true)}>
        <Text style={[styles.value, !value && styles.placeholder]}>{value?.name || placeholder}</Text>
        <Ionicons name="chevron-down-outline" size={18} color="#64748B" />
      </Pressable>
      <Modal transparent visible={open} animationType="fade" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close}>
          <View style={styles.menu} onStartShouldSetResponder={() => true}>
            <Text style={styles.menuTitle}>{label}</Text>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color="#64748B" />
              <TextInput value={query} onChangeText={setQuery} autoFocus placeholder={`Search ${label.toLowerCase()}`} placeholderTextColor="#94A3B8" style={styles.searchInput} />
            </View>
            <FlatList
              data={filtered}
              keyExtractor={(o) => String(o.id ?? o.name)}
              ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
              renderItem={({ item }) => (
                <Pressable style={styles.option} onPress={() => select(item)}>
                  <Text style={styles.optionText}>{item.name}</Text>
                  {item.name === value?.name ? <Ionicons name="checkmark" size={18} color="#2563EB" /> : null}
                </Pressable>
              )}
            />
            {canCreate ? (
              <Pressable style={styles.createOption} onPress={create}>
                <Ionicons name="add" size={18} color="#2563EB" />
                <Text style={styles.createText}>{`Add "${query.trim()}"`}</Text>
              </Pressable>
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1, marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "700", color: "#475569", marginBottom: 6 },
  select: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 10, borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#FFFFFF", paddingHorizontal: 12 },
  value: { flex: 1, color: "#0F172A", fontSize: 14 }, placeholder: { color: "#94A3B8" },
  backdrop: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "rgba(15, 23, 42, 0.28)" },
  menu: { maxHeight: 340, overflow: "hidden", borderRadius: 16, backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOpacity: 0.16, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 12 },
  menuTitle: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, fontSize: 16, fontWeight: "700", color: "#0F172A" },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 12, marginBottom: 8, paddingHorizontal: 10, minHeight: 40, borderRadius: 9, borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" }, searchInput: { flex: 1, color: "#0F172A", fontSize: 14 },
  option: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, borderTopWidth: 1, borderTopColor: "#F1F5F9" }, optionText: { color: "#334155", fontSize: 14 },
  emptyText: { padding: 16, color: "#64748B", textAlign: "center", fontSize: 14 }, createOption: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: "#BFDBFE", backgroundColor: "#EFF6FF" }, createText: { flex: 1, color: "#2563EB", fontSize: 14, fontWeight: "700" },
});
