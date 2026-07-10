// components
import React from 'react';
import Header from 'components/Header/Header';
import TagDetails from 'components/Tag/TagDetails';
import ExploreHeader from 'components/Header/ExploreHeader';

function TagPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-dark" data-testid="tag-container">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col gap-4">
        <ExploreHeader />
        <div className="w-full">
          <TagDetails />
        </div>
      </main>
    </div>
  );
}

export default TagPage;
