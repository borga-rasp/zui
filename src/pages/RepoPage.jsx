// components
import React from 'react';
import Header from 'components/Header/Header';
import RepoDetails from 'components/Repo/RepoDetails';
import ExploreHeader from 'components/Header/ExploreHeader';

function RepoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#090d16]" data-testid="repo-container">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col gap-4">
        <ExploreHeader />
        <div className="w-full">
          <RepoDetails />
        </div>
      </main>
    </div>
  );
}

export default RepoPage;
