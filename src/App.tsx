import { useState, useRef, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import { LazyStore } from "@tauri-apps/plugin-store";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const store = new LazyStore("store.json");

interface StackItem {
  id: number;
  text: string;
}

interface SortableItemProps {
  item: StackItem;
  index: number;
  editingId: number | null;
  editInputRef: React.RefObject<HTMLInputElement | null>;
  startEditing: (id: number) => void;
  saveEdit: (id: number, newText: string) => void;
  handleEditKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => void;
  deleteItem: (index: number) => void;
}

function SortableItem({
  item,
  index,
  editingId,
  editInputRef,
  startEditing,
  saveEdit,
  handleEditKeyDown,
  deleteItem,
}: SortableItemProps) {
  const isEditing = editingId === item.id;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id.toString(), disabled: isEditing });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`stack-item ${isEditing ? "editing" : ""} ${transform ? "sorting" : ""}`}
      onDoubleClick={() => startEditing(item.id)}
    >
      <span className="drag-handle" {...attributes} {...listeners}>
        ⠿
      </span>
      <span className="number">{index + 1}</span>
      {isEditing ? (
        <input
          ref={editInputRef}
          className="edit-input"
          defaultValue={item.text}
          onKeyDown={(e) => handleEditKeyDown(e, item.id)}
          onBlur={(e) => saveEdit(item.id, e.currentTarget.value)}
        />
      ) : (
        <span className="content">{item.text}</span>
      )}
      <button
        className="delete-btn"
        onClick={() => deleteItem(index)}
        title="삭제"
      >
        ×
      </button>
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState<StackItem[]>([]);
  const [input, setInput] = useState("");
  const [pinned, setPinned] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(1);
  const isLoadedRef = useRef(false);

  // 앱 시작 시 저장된 데이터 로드 + 입력창 포커스 + always-on-top 초기 설정
  useEffect(() => {
    inputRef.current?.focus();
    getCurrentWindow().setAlwaysOnTop(true);

    (async () => {
      try {
        const savedItems = await store.get<StackItem[]>("items");
        const savedNextId = await store.get<number>("nextId");
        if (savedItems) setItems(savedItems);
        if (savedNextId) nextIdRef.current = savedNextId;
      } catch (e) {
        console.error("데이터 로드 실패:", e);
      } finally {
        isLoadedRef.current = true;
      }
    })();
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
      // 새 아이템을 맨 위에 추가
      setItems((prev) => [{ id: nextIdRef.current++, text: value }, ...prev]);
    }

    setInput("");
  };

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

  const handleCommand = (cmd: string) => {
    const parts = cmd.split(/\s+/);
    const command = parts[0].toLowerCase();

    if (command === "/del" && parts[1]) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num) && num >= 1) {
        // 번호는 1부터 시작, 배열 인덱스는 0부터
        deleteItem(num - 1);
      }
    } else if (command === "/pop") {
      // 맨 위(첫 번째) 아이템 삭제
      deleteItem(0);
    } else if (command === "/edit" && parts[1]) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num) && num >= 1 && num <= items.length) {
        startEditing(items[num - 1].id);
      }
    } else if (command === "/clear") {
      // 모든 아이템 삭제
      setItems([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return; // IME 조합 중이면 무시
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

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
      <div className="input-bar">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={cancelEdit}
          placeholder="텍스트 입력 후 Enter..."
        />
        <button
          className={`pin-btn ${pinned ? "active" : ""}`}
          onClick={togglePin}
          title={pinned ? "항상 위 해제 (Ctrl+Shift+P)" : "항상 위 고정 (Ctrl+Shift+P)"}
        >
          📌
        </button>
      </div>

      <div className="item-list">
        {items.length === 0 ? (
          <div className="empty-state">
            /del 번호 · /edit 번호 · /pop · /clear
            <br />
            Ctrl+Shift+T 포커스 · Ctrl+Shift+P 고정
          </div>
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
