import type { StackItem } from "../types";

interface UseCommandsParams {
  items: StackItem[];
  deleteItem: (index: number) => void;
  startEditing: (id: number) => void;
  setItems: React.Dispatch<React.SetStateAction<StackItem[]>>;
}

export function useCommands({
  items,
  deleteItem,
  startEditing,
  setItems,
}: UseCommandsParams) {
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

  return { handleCommand };
}
