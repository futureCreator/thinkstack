import { useState, useRef, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

interface StackItem {
  id: number;
  text: string;
}

export default function App() {
  const [items, setItems] = useState<StackItem[]>([]);
  const [input, setInput] = useState("");
  const [pinned, setPinned] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextIdRef = useRef(1);

  // 앱 시작 시 입력창에 포커스 + always-on-top 초기 설정
  useEffect(() => {
    inputRef.current?.focus();
    getCurrentWindow().setAlwaysOnTop(true);
  }, []);

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
    setItems((prev) => prev.filter((_, i) => i !== index));
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

  return (
    <>
      <div className="input-bar">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="텍스트 입력 후 Enter..."
        />
        <button
          className={`pin-btn ${pinned ? "active" : ""}`}
          onClick={togglePin}
          title={pinned ? "항상 위 해제" : "항상 위 고정"}
        >
          📌
        </button>
      </div>

      <div className="item-list">
        {items.length === 0 ? (
          <div className="empty-state">/del 번호 · /pop · /clear</div>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="stack-item">
              <span className="number">{index + 1}</span>
              <span className="content">{item.text}</span>
              <button
                className="delete-btn"
                onClick={() => deleteItem(index)}
                title="삭제"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
