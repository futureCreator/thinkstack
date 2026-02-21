import { useState, useRef, useEffect } from "react";
import { LazyStore } from "@tauri-apps/plugin-store";
import type { StackItem, TabId } from "../types";
import { DEFAULT_TAB, DEFAULT_TAB_ICONS, AVAILABLE_ICONS } from "../types";

const store = new LazyStore("store.json");

// 탭별 아이템 저장 구조
type TabItemsMap = Record<TabId, StackItem[]>;

export function useStore() {
  const [activeTab, setActiveTab] = useState<TabId>(DEFAULT_TAB);
  const [allItems, setAllItems] = useState<TabItemsMap>({
    work: [],
    ideas: [],
    today: [],
    personal: [],
  });
  const [tabIcons, setTabIcons] = useState<Record<TabId, string>>(DEFAULT_TAB_ICONS);
  const [editingTabIcon, setEditingTabIcon] = useState<TabId | null>(null);
  const nextIdRef = useRef(1);
  const isLoadedRef = useRef(false);

  // 현재 탭의 아이템
  const items = allItems[activeTab];
  const setItems = (updater: React.SetStateAction<StackItem[]>) => {
    setAllItems((prev) => {
      const currentItems = prev[activeTab];
      const newItems = typeof updater === 'function' 
        ? (updater as (prev: StackItem[]) => StackItem[])(currentItems)
        : updater;
      return { ...prev, [activeTab]: newItems };
    });
  };

  // 앱 시작 시 저장된 데이터 로드
  useEffect(() => {
    (async () => {
      try {
        const savedItems = await store.get<TabItemsMap>("tabItems");
        const savedActiveTab = await store.get<TabId>("activeTab");
        const savedNextId = await store.get<number>("nextId");
        
        if (savedItems) {
          const now = Date.now();
          // 마이그레이션: 각 탭의 아이템에 createdAt 추가
          const migrated: TabItemsMap = {
            work: savedItems.work?.map((item) => ({
              ...item,
              createdAt: item.createdAt ?? now,
            })) || [],
            ideas: savedItems.ideas?.map((item) => ({
              ...item,
              createdAt: item.createdAt ?? now,
            })) || [],
            today: savedItems.today?.map((item) => ({
              ...item,
              createdAt: item.createdAt ?? now,
            })) || [],
            personal: savedItems.personal?.map((item) => ({
              ...item,
              createdAt: item.createdAt ?? now,
            })) || [],
          };
          setAllItems(migrated);
        } else {
          // 기존 데이터 마이그레이션 (단일 items -> 탭별)
          const oldItems = await store.get<StackItem[]>("items");
          if (oldItems) {
            const now = Date.now();
            const migrated = oldItems.map((item) => ({
              ...item,
              createdAt: item.createdAt ?? now,
            }));
            setAllItems((prev) => ({ ...prev, work: migrated }));
          }
        }
        
        if (savedActiveTab) setActiveTab(savedActiveTab);
        if (savedNextId) nextIdRef.current = savedNextId;
        
        // 탭 아이콘 로드
        const savedTabIcons = await store.get<Record<TabId, string>>("tabIcons");
        if (savedTabIcons) {
          setTabIcons((prev) => ({ ...prev, ...savedTabIcons }));
        }
      } catch (e) {
        console.error("데이터 로드 실패:", e);
      } finally {
        isLoadedRef.current = true;
      }
    })();
  }, []);

  // 데이터 변경 시 자동 저장
  useEffect(() => {
    if (!isLoadedRef.current) return;

    (async () => {
      try {
        await store.set("tabItems", allItems);
        await store.set("activeTab", activeTab);
        await store.set("nextId", nextIdRef.current);
        await store.set("tabIcons", tabIcons);
      } catch (e) {
        console.error("데이터 저장 실패:", e);
      }
    })();
  }, [allItems, activeTab, tabIcons]);

  // 새 아이템을 현재 탭의 맨 위에 추가
  const addItem = (text: string) => {
    setAllItems((prev) => ({
      ...prev,
      [activeTab]: [
        { id: nextIdRef.current++, text, createdAt: Date.now() },
        ...prev[activeTab],
      ],
    }));
  };

  // 탭 변경
  const switchTab = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  // 탭 아이콘 업데이트
  const updateTabIcon = (tabId: TabId, icon: string) => {
    setTabIcons((prev) => ({ ...prev, [tabId]: icon }));
  };

  // 아이콘 선택 모드 토글
  const toggleIconEdit = (tabId: TabId | null) => {
    setEditingTabIcon(editingTabIcon === tabId ? null : tabId);
  };

  return {
    items,
    setItems,
    addItem,
    activeTab,
    switchTab,
    allItems,
    setAllItems,
    tabIcons,
    updateTabIcon,
    editingTabIcon,
    toggleIconEdit,
    availableIcons: AVAILABLE_ICONS,
  };
}
