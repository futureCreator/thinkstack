import { useRef, useEffect } from "react";
import { TabId, TAB_OPTIONS, AVAILABLE_EMOJIS } from "../types";

interface TabsProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  itemCounts: Record<TabId, number>;
  tabIcons: Record<TabId, string>;
  editingTabEmoji: TabId | null;
  onToggleEmojiEdit: (tabId: TabId | null) => void;
  onUpdateTabIcon: (tabId: TabId, icon: string) => void;
}

export function Tabs({
  activeTab,
  onTabChange,
  itemCounts,
  tabIcons,
  editingTabEmoji,
  onToggleEmojiEdit,
  onUpdateTabIcon,
}: TabsProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 이모지 선택기 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onToggleEmojiEdit(null);
      }
    };

    if (editingTabEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingTabEmoji, onToggleEmojiEdit]);

  return (
    <div className="tabs-container">
      {TAB_OPTIONS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onToggleEmojiEdit(tab.id);
          }}
          title={tab.name}
        >
          <span className="tab-icon">
            {tabIcons[tab.id] || tab.icon}
          </span>
          {itemCounts[tab.id] > 0 && (
            <span className="tab-badge">{itemCounts[tab.id]}</span>
          )}

          {/* 이모지 선택기 */}
          {editingTabEmoji === tab.id && (
            <div
              ref={pickerRef}
              className="emoji-picker"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="emoji-grid">
                {AVAILABLE_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    className="emoji-option"
                    onClick={() => {
                      onUpdateTabIcon(tab.id, emoji);
                      onToggleEmojiEdit(null);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
