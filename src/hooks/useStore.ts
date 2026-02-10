import { useState, useRef, useEffect } from "react";
import { LazyStore } from "@tauri-apps/plugin-store";
import type { StackItem } from "../types";

const store = new LazyStore("store.json");

export function useStore() {
  const [items, setItems] = useState<StackItem[]>([]);
  const nextIdRef = useRef(1);
  const isLoadedRef = useRef(false);

  // 앱 시작 시 저장된 데이터 로드
  useEffect(() => {
    (async () => {
      try {
        const savedItems = await store.get<StackItem[]>("items");
        const savedNextId = await store.get<number>("nextId");
        if (savedItems) {
          const now = Date.now();
          const migrated = savedItems.map((item) => ({
            ...item,
            createdAt: item.createdAt ?? now,
          }));
          setItems(migrated);
        }
        if (savedNextId) nextIdRef.current = savedNextId;
      } catch (e) {
        console.error("데이터 로드 실패:", e);
      } finally {
        isLoadedRef.current = true;
      }
    })();
  }, []);

  // items 변경 시 자동 저장
  useEffect(() => {
    if (!isLoadedRef.current) return;

    (async () => {
      try {
        await store.set("items", items);
        await store.set("nextId", nextIdRef.current);
      } catch (e) {
        console.error("데이터 저장 실패:", e);
      }
    })();
  }, [items]);

  // 새 아이템을 맨 위에 추가
  const addItem = (text: string) => {
    setItems((prev) => [{ id: nextIdRef.current++, text, createdAt: Date.now() }, ...prev]);
  };

  return { items, setItems, addItem };
}
