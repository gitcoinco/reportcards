import { ReactNode, useState } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabViewProps {
  tabs: Tab[];
  defaultTabIndex?: number;
}

export const TabView = ({ tabs, defaultTabIndex = 0 }: TabViewProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(defaultTabIndex);

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-medium ${
              activeTabIndex === index
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTabIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        {tabs[activeTabIndex].content}
      </div>
    </div>
  );
}; 