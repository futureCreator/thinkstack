import { useRef, useEffect } from "react";
import {
  Briefcase,
  Lightbulb,
  CheckSquare,
  Home,
  FileText,
  BarChart3,
  Calendar,
  Star,
  Flame,
  Heart,
  BookOpen,
  Music,
  Palette,
  Zap,
  Rocket,
  Target,
  Dumbbell,
  Brain,
  Laptop,
  Smartphone,
  Coffee,
  Clover,
  Sparkles,
  Gem,
  Bell,
  Pin,
  Tag,
  Wand2,
  PartyPopper,
  Rainbow,
  Cat,
  Dog,
  Fish,
  Bird,
  Moon,
  Sun,
  Cloud,
  Anchor,
  Plane,
} from "lucide-react";
import { TabId, TAB_OPTIONS, AVAILABLE_ICONS } from "../types";

// 아이콘 이름을 컴포넌트로 매핑
const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Briefcase,
  Lightbulb,
  CheckSquare,
  Home,
  FileText,
  BarChart3,
  Calendar,
  Star,
  Flame,
  Heart,
  BookOpen,
  Music,
  Palette,
  Zap,
  Rocket,
  Target,
  Dumbbell,
  Brain,
  Laptop,
  Smartphone,
  Coffee,
  Clover,
  Sparkles,
  Gem,
  Bell,
  Pin,
  Tag,
  Wand2,
  PartyPopper,
  Rainbow,
  Cat,
  Dog,
  Fish,
  Bird,
  Moon,
  Sun,
  Cloud,
  Anchor,
  Plane,
};

interface TabsProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  itemCounts: Record<TabId, number>;
  tabIcons: Record<TabId, string>;
  editingTabIcon: TabId | null;
  onToggleIconEdit: (tabId: TabId | null) => void;
  onUpdateTabIcon: (tabId: TabId, icon: string) => void;
}

export function Tabs({
  activeTab,
  onTabChange,
  itemCounts,
  tabIcons,
  editingTabIcon,
  onToggleIconEdit,
  onUpdateTabIcon,
}: TabsProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 아이콘 선택기 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onToggleIconEdit(null);
      }
    };

    if (editingTabIcon) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingTabIcon, onToggleIconEdit]);

  const renderIcon = (iconName: string, fallbackIcon?: string) => {
    const IconComponent = ICON_MAP[iconName] || (fallbackIcon ? ICON_MAP[fallbackIcon] : null);
    if (IconComponent) {
      return <IconComponent size={16} />;
    }
    return null;
  };

  return (
    <div className="tabs-container">
      {TAB_OPTIONS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onToggleIconEdit(tab.id);
          }}
          title={tab.name}
        >
          <span className="tab-icon">
            {renderIcon(tabIcons[tab.id], tab.icon)}
          </span>
          {itemCounts[tab.id] > 0 && (
            <span className="tab-badge">{itemCounts[tab.id]}</span>
          )}

          {/* 아이콘 선택기 */}
          {editingTabIcon === tab.id && (
            <div
              ref={pickerRef}
              className="icon-picker"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="icon-grid">
                {AVAILABLE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    className="icon-option"
                    onClick={() => {
                      onUpdateTabIcon(tab.id, icon);
                      onToggleIconEdit(null);
                    }}
                  >
                    {renderIcon(icon)}
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
