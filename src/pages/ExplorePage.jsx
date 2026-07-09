// components
import React, { useState } from 'react';
import Header from '../components/Header/Header.jsx';
import Explore from 'components/Explore/Explore.jsx';

function ExplorePage() {
  const [searchCurrentValue, setSearchCurrentValue] = useState();

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16]" data-testid="explore-container">
      <Header setSearchCurrentValue={setSearchCurrentValue} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Explore searchInputValue={searchCurrentValue} />
      </main>
    </div>
  );
}

export default ExplorePage;
