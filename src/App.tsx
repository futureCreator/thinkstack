import { useState, useRef, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useStore } from "./hooks/useStore";
import { useCommands } from "./hooks/useCommands";
import { InputBar } from "./components/InputBar";
import { SortableItem } from "./components/StackItem";
import { EmptyState } from "./components/EmptyState";
import { Theme, Font } from "./types";
import { getInitialTheme, saveTheme } from "./utils/themeStorage";
import { getInitialFont, saveFont, getFontInfo } from "./utils/fontStorage";

export default function App() {
  const { items, setItems, addItem } = useStore();
  const [input, setInput] = useState("");
  const [pinned, setPinned] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  const [font, setFont] = useState<Font>(getInitialFont());
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const deleteItem = (index: number) => {
    setItems((prev) => {
      // 삭제 대상이 편집 중인 아이템이면 편집 모드 해제
      if (prev[index] && prev[index].id === editingId) {
        setEditingId(null);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const startEditing = (id: number) => {
    setEditingId(id);
  };

  const saveEdit = (id: number, newText: string) => {
    const trimmed = newText.trim();
    if (trimmed) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, text: trimmed } : item))
      );
    }
    setEditingId(null);
    inputRef.current?.focus();
  };

  const cancelEdit = () => {
    setEditingId(null);
    inputRef.current?.focus();
  };

  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.nativeEvent.isComposing) return; // 한국어 IME 조합 중 무시
    if (e.key === "Enter") {
      saveEdit(id, e.currentTarget.value);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const { handleCommand } = useCommands({
    items,
    deleteItem,
    startEditing,
    setItems,
  });

  const togglePin = async () => {
    const next = !pinned;
    await getCurrentWindow().setAlwaysOnTop(next);
    setPinned(next);
  };

  const handleSubmit = () => {
    const value = input.trim();
    if (!value) return;

    // 슬래시 명령어 처리
    if (value.startsWith("/")) {
      handleCommand(value);
    } else {
      addItem(value);
    }

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return; // IME 조합 중이면 무시
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // 테마 적용
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 테마 변경 핸들러
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  // 폰트 적용
  useEffect(() => {
    const fontInfo = getFontInfo(font);
    if (fontInfo) {
      document.documentElement.style.setProperty('--app-font-family', fontInfo.family);
    }
  }, [font]);

  // 폰트 변경 핸들러
  const handleFontChange = (newFont: Font) => {
    setFont(newFont);
    saveFont(newFont);
  };

  // 앱 시작 시 입력창 포커스 + always-on-top 초기 설정
  useEffect(() => {
    inputRef.current?.focus();
    getCurrentWindow().setAlwaysOnTop(true);
  }, []);

  // 글로벌 단축키(Ctrl+Shift+T) 이벤트 수신 → 입력창 포커스
  useEffect(() => {
    const unlisten = listen("global-shortcut-activated", () => {
      // 윈도우 활성화 완료 후 입력창 포커스를 위한 지연
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  // 앱 내 단축키 (Ctrl+Shift+P) → 항상 위 고정 토글
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyP") {
        e.preventDefault();
        togglePin();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [pinned]);

  // 편집 모드 진입 시 입력창 포커스 및 텍스트 전체 선택
  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id.toString() === active.id);
        const newIndex = prev.findIndex((i) => i.id.toString() === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      <InputBar
        input={input}
        setInput={setInput}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
        pinned={pinned}
        togglePin={togglePin}
        onFocus={cancelEdit}
        currentTheme={theme}
        currentFont={font}
        onThemeChange={handleThemeChange}
        onFontChange={handleFontChange}
      />

      <div className="item-list">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  index={index}
                  editingId={editingId}
                  editInputRef={editInputRef}
                  startEditing={startEditing}
                  saveEdit={saveEdit}
                  handleEditKeyDown={handleEditKeyDown}
                  deleteItem={deleteItem}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </>
  );
}
