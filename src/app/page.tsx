'use client';

import { useProConStore } from '@/store/procon';
import { ListsOverview } from '@/components/ListsOverview';
import { ProConListView } from '@/components/ProConListView';

export default function Home() {
  const { currentList } = useProConStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {currentList ? (
        <ProConListView list={currentList} />
      ) : (
        <ListsOverview />
      )}
    </div>
  );
}
