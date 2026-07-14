import { useCallback, useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "@/constants/api";

interface ReportSummary {
    currentInventory: number;
    lowStock: number;
    stockMovements: number;
    categoryCount: number;
}

interface Movement {
    id: number;
    date: string;
    sku: string;
    product: string;
    movementType: string;
    quantity: number;
    reference: string;
    user: string;
}

interface ReportsApiResponse {
    success: boolean;
    data: {
        summary: {
            currentInventory: number;
            lowStock: number;
            stockMovements: number;
            categories: number;
        };
        recentTransactions: {
            items: Array<{
                id: number;
                date: string | null;
                sku: string;
                product: string;
                transactionType: string;
                quantity: number;
                remarks: string | null;
                employee: string;
            }>;
        };
    };
}

export function useReports() {
    const [summary, setSummary] = useState<ReportSummary | null>(null);
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadReports = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await fetch(`${API_BASE_URL}/api/reports?page=1&pageSize=30`);
            if (!response.ok) {
                throw new Error("Unable to fetch reports.");
            }

            const json: ReportsApiResponse = await response.json();
            const nextSummary = json.data.summary;
            const nextMovements = (json.data.recentTransactions?.items ?? []).map((item) => ({
                id: item.id,
                date: item.date ? new Date(item.date).toLocaleDateString() : "-",
                sku: item.sku,
                product: item.product,
                movementType: item.transactionType ?? "",
                quantity: item.quantity,
                reference: item.remarks ?? "-",
                user: item.employee ?? "System",
            }));

            setSummary({
                currentInventory: nextSummary.currentInventory ?? 0,
                lowStock: nextSummary.lowStock ?? 0,
                stockMovements: nextSummary.stockMovements ?? 0,
                categoryCount: nextSummary.categories ?? 0,
            });
            setMovements(nextMovements);
            setError(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unable to load reports";
            setError(message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void loadReports();
    }, [loadReports]);

    const refreshReports = useCallback(() => loadReports(true), [loadReports]);

    const summaryCards = useMemo(
        () => [
            {
                title: "Current Inventory",
                value: summary?.currentInventory ?? 0,
            },
            {
                title: "Low Stock",
                value: summary?.lowStock ?? 0,
            },
            {
                title: "Stock Movements",
                value: summary?.stockMovements ?? 0,
            },
            {
                title: "Categories",
                value: summary?.categoryCount ?? 0,
            },
        ],
        [summary],
    );

    return {
        summary,
        movements,
        loading,
        refreshing,
        error,
        summaryCards,
        refreshReports,
    };
}
