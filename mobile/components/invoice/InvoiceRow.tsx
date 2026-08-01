import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/constants/api";

export interface InvoiceProductOption { id: number; sku: string; productName: string; sellingPrice: number | null; }
export interface InvoiceRowData { id: string; product: InvoiceProductOption | null; rate: number; quantity: number; total: number; }
interface InvoiceRowProps { item: InvoiceRowData; onSelectProduct: (product: InvoiceProductOption | null) => void; onQuantityChange: (quantity: number) => void; onRemove: () => void; }

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function InvoiceRow({ item, onSelectProduct, onQuantityChange, onRemove }: InvoiceRowProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<InvoiceProductOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const fieldRef = useRef<View | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef(0);
  const selectedLabel = useMemo(() => item.product ? `${item.product.sku} - ${item.product.productName}` : "Search SKU or product name", [item.product]);

  useEffect(() => { if (item.product) setQuery(`${item.product.sku} - ${item.product.productName}`); }, [item.product]);
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const searchProducts = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const searchTerm = text.trim();
    if (searchTerm.length < 2) { requestRef.current += 1; setResults([]); setLoading(false); return; }
    const requestId = ++requestRef.current;
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/search?q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error("Unable to search products.");
        const json = await response.json();
        if (requestRef.current !== requestId) return;
        setResults((json.data?.items ?? []).map((product: Record<string, unknown>) => ({
          id: Number(product.id ?? product.variantId), sku: String(product.sku ?? ""),
          productName: String(product.productName ?? product.product ?? ""),
          sellingPrice: Number(product.sellingPrice ?? product.selling_price ?? 0),
        })));
      } catch (error) { console.error(error); if (requestRef.current === requestId) setResults([]); }
      finally { if (requestRef.current === requestId) setLoading(false); }
    }, 300);
  }, []);

  function openSearch() { fieldRef.current?.measureInWindow((x, y, width) => { setPosition({ top: y, left: x, width: Math.max(width, 220) }); setOpen(true); }); }
  function closeSearch() { setOpen(false); setPosition(null); }
  function clearSearch() { requestRef.current += 1; setQuery(""); setResults([]); setLoading(false); onSelectProduct(null); }
  function selectProduct(product: InvoiceProductOption) { onSelectProduct(product); setQuery(`${product.sku} - ${product.productName}`); setResults([]); closeSearch(); }

  return <View style={styles.card}>
    <View style={styles.headerRow}><Text style={styles.rowTitle}>Item</Text><Pressable onPress={onRemove} accessibilityLabel="Remove item"><Ionicons name="trash-outline" size={18} color="#DC2626" /></Pressable></View>
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>SKU + Product</Text>
      <View ref={fieldRef}><Pressable style={styles.searchField} onPress={openSearch}>
        <Ionicons name="search-outline" size={18} color="#64748B" /><Text style={[styles.searchText, !item.product && styles.placeholder]} numberOfLines={1}>{selectedLabel}</Text>
        {item.product ? <Pressable onPress={clearSearch} hitSlop={8} accessibilityLabel="Clear selected product"><Ionicons name="close-circle" size={18} color="#64748B" /></Pressable> : null}
      </Pressable></View>
      <Modal transparent visible={open} animationType="fade" onRequestClose={closeSearch}>
        <Pressable style={styles.backdrop} onPress={closeSearch}>
          <View style={[styles.overlay, position ? { top: position.top, left: position.left, width: position.width } : null]} onStartShouldSetResponder={() => true}>
            <View style={styles.modalSearchField}><Ionicons name="search-outline" size={18} color="#64748B" /><TextInput autoFocus value={query} onChangeText={searchProducts} placeholder="Search SKU or product name" placeholderTextColor="#94A3B8" style={styles.searchInput} autoCapitalize="none" returnKeyType="search" />
              {query.length > 0 ? <Pressable onPress={clearSearch} hitSlop={8} accessibilityLabel="Clear product search"><Ionicons name="close-circle" size={18} color="#64748B" /></Pressable> : null}
            </View>
            {loading ? <ActivityIndicator style={styles.loading} size="small" color="#2563EB" /> : null}
            {!loading && query.trim().length >= 2 && results.length === 0 ? <Text style={styles.emptyText}>No products found</Text> : null}
            {!loading && results.length > 0 ? <FlatList data={results} keyExtractor={(product) => String(product.id)} keyboardShouldPersistTaps="handled" style={styles.resultList} renderItem={({ item: product }) => <Pressable style={styles.optionRow} onPress={() => selectProduct(product)}><Text style={styles.optionText}>{`${product.sku} - ${product.productName}`}</Text></Pressable>} /> : null}
          </View>
        </Pressable>
      </Modal>
    </View>
    <View style={styles.rowFields}>
      <View style={styles.fieldGroupSmall}><Text style={styles.label}>Rate</Text><View style={styles.readOnlyBox}><Text style={styles.readOnlyText}>{formatCurrency(item.rate)}</Text></View></View>
      <View style={styles.fieldGroupSmall}><Text style={styles.label}>Quantity</Text><TextInput style={styles.input} value={String(item.quantity)} keyboardType="number-pad" onChangeText={(text) => { const quantity = text.replace(/\D/g, ""); onQuantityChange(quantity === "" ? 1 : Math.max(1, Number(quantity))); }} maxLength={3} /></View>
      <View style={styles.fieldGroupSmall}><Text style={styles.label}>Total</Text><View style={styles.readOnlyBox}><Text style={styles.readOnlyText}>{formatCurrency(item.total)}</Text></View></View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }, rowTitle: { fontSize: 15, fontWeight: "700", color: "#0F172A" }, fieldGroup: { marginBottom: 10 }, fieldGroupSmall: { flex: 1 }, label: { fontSize: 12, fontWeight: "700", color: "#475569", marginBottom: 6 },
  searchField: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" }, searchText: { color: "#0F172A", flex: 1, fontSize: 14 }, placeholder: { color: "#94A3B8" },
  backdrop: { flex: 1 }, overlay: { position: "absolute", zIndex: 999, elevation: 999, borderRadius: 10, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#FFFFFF", maxHeight: 320, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  modalSearchField: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" }, searchInput: { flex: 1, paddingVertical: 4, color: "#0F172A", fontSize: 14 }, loading: { paddingVertical: 20 }, resultList: { maxHeight: 260 }, optionRow: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }, optionText: { color: "#0F172A", fontSize: 13 }, emptyText: { padding: 12, color: "#64748B", fontSize: 13 },
  rowFields: { flexDirection: "row", gap: 8 }, readOnlyBox: { borderRadius: 10, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#F8FAFC", paddingHorizontal: 12, paddingVertical: 10 }, readOnlyText: { color: "#334155", fontSize: 14 }, input: { borderRadius: 10, borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#FFFFFF", paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: "#0F172A" },
});
