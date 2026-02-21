import type { StackItem, TabId } from "../types";
import { TAB_OPTIONS } from "../types";

interface UseCommandsParams {
  items: StackItem[];
  deleteItem: (index: number) => void;
  startEditing: (id: number) => void;
  setItems: React.Dispatch<React.SetStateAction<StackItem[]>>;
  switchTab?: (tabId: TabId) => void;
  activeTab?: TabId;
}

export function useCommands({
  items,
  deleteItem,
  startEditing,
  setItems,
  switchTab,
  activeTab,
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
    } else if (command === "/tab" && parts[1] && switchTab) {
      // 탭 전환: /tab work, /tab ideas, /tab today, /tab personal
      const tabName = parts[1].toLowerCase();
      const tabMap: Record<string, TabId> = {
        work: "work",
        업무: "work",
        w: "work",
        ideas: "ideas",
        아이디어: "ideas",
        i: "ideas",
        today: "today",
        오늘: "today",
        t: "today",
        personal: "personal",
        개인: "personal",
        p: "personal",
      };
      const targetTab = tabMap[tabName];
      if (targetTab) {
        switchTab(targetTab);
      }
    } else if (command === "/tabs") {
      // 현재 탭 정보 표시 (콘솔에)
      const currentTab = TAB_OPTIONS.find((t) => t.id === activeTab);
      console.log(
        "현재 탭:",
        currentTab?.name || activeTab,
        "/ 사용 가능한 탭:",
        TAB_OPTIONS.map((t) => `${t.icon} ${t.name}(/tab ${t.id})`).join(", ")
      );
    }
  };

  return { handleCommand };
}
