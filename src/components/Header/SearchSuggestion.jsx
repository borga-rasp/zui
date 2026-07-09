import React, { useEffect, useMemo, useState } from 'react';
import { api, endpoints } from 'api';
import { host } from 'host';
import { mapToImage, mapToRepo } from 'utilities/objectModels';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router';
import { debounce, isEmpty } from 'lodash';
import { useCombobox } from 'downshift';
import { HEADER_SEARCH_PAGE_SIZE } from 'utilities/paginationConstants';
import { Search, Image as ImageIcon } from 'lucide-react';

function SearchSuggestion({ setSearchCurrentValue = () => {} }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestionData, setSuggestionData] = useState([]);
  const [queryParams] = useSearchParams();
  const search = queryParams.get('search') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [isFailedSearch, setIsFailedSearch] = useState(false);
  const [isComponentFocused, setIsComponentFocused] = useState(false);
  const navigate = useNavigate();
  const abortController = useMemo(() => new AbortController(), []);

  const handleSuggestionSelected = (event) => {
    const name = event.selectedItem?.name;
    if (name?.includes(':')) {
      const splitName = name.split(':');
      navigate(`/image/${encodeURIComponent(splitName[0])}/tag/${splitName[1]}`);
    } else {
      navigate(`/image/${encodeURIComponent(name)}`);
    }
  };

  const handleSearch = (event) => {
    const { key, type } = event;
    const name = event.target.value;
    if (key === 'Enter' || type === 'click') {
      if (name?.includes(':')) {
        const splitName = name.split(':');
        navigate(`/image/${encodeURIComponent(splitName[0])}/tag/${splitName[1]}`);
      } else {
        navigate({ pathname: `/explore`, search: createSearchParams({ search: inputValue || '' }).toString() });
      }
    }
  };

  const repoSearch = (value) => {
    api
      .get(
        `${host()}${endpoints.globalSearch({ searchQuery: value, pageNumber: 1, pageSize: HEADER_SEARCH_PAGE_SIZE })}`,
        abortController.signal
      )
      .then((suggestionResponse) => {
        if (suggestionResponse.data.data.GlobalSearch.Repos) {
          const suggestionParsedData = suggestionResponse.data.data.GlobalSearch.Repos.map((el) => mapToRepo(el));
          setSuggestionData(suggestionParsedData);
          if (isEmpty(suggestionParsedData)) {
            setIsFailedSearch(true);
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setIsFailedSearch(true);
      });
  };

  const imageSearch = (value) => {
    api
      .get(
        `${host()}${endpoints.imageSuggestions({ searchQuery: value, pageNumber: 1, pageSize: 9 })}`,
        abortController.signal
      )
      .then((suggestionResponse) => {
        if (suggestionResponse.data.data.GlobalSearch.Images) {
          const suggestionParsedData = suggestionResponse.data.data.GlobalSearch.Images.map((el) => mapToImage(el));
          setSuggestionData(suggestionParsedData);
          if (isEmpty(suggestionParsedData)) {
            setIsFailedSearch(true);
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setIsFailedSearch(true);
      });
  };

  const handleSeachChange = (event) => {
    const value = event?.inputValue;
    setSearchQuery(value);
    setSearchCurrentValue(value);
    setIsFailedSearch(false);
    setIsLoading(true);
    setSuggestionData([]);
  };

  const searchCall = (value) => {
    if (value !== '') {
      if (value?.includes(':')) {
        imageSearch(value);
      } else {
        repoSearch(value);
      }
    }
  };

  const debounceSuggestions = useMemo(() => {
    return debounce(searchCall, 300);
  }, []);

  useEffect(() => {
    debounceSuggestions(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      debounceSuggestions.cancel();
      abortController.abort();
    };
  }, []);

  const {
    inputValue,
    getInputProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    getComboboxProps,
    isOpen,
    openMenu
  } = useCombobox({
    items: suggestionData,
    onInputValueChange: handleSeachChange,
    onSelectedItemChange: handleSuggestionSelected,
    initialInputValue: !isEmpty(searchQuery) ? searchQuery : search,
    itemToString: (item) => item?.name || item
  });

  useEffect(() => {
    setIsComponentFocused(isOpen);
  }, [isOpen]);

  const renderSuggestions = () => {
    return suggestionData.map((suggestion, index) => (
      <li
        key={`${suggestion.name}_${index}`}
        className={`flex items-center gap-3 py-2.5 px-4 cursor-pointer transition-colors duration-150 ${
          highlightedIndex === index ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
        }`}
        {...getItemProps({ item: suggestion, index })}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-900 overflow-hidden shrink-0 border border-slate-700">
          {suggestion.logo ? (
            <img
              src={`data:image/png;base64, ${suggestion.logo}`}
              alt="logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <span className="font-medium truncate text-sm">{suggestion.name}</span>
      </li>
    ));
  };

  return (
    <div className="relative w-full max-w-lg z-[1150]">
      <div
        className={`flex items-center justify-between gap-2 border bg-slate-900/60 backdrop-blur rounded-lg px-3 py-1.5 transition-all duration-200 ${
          isComponentFocused
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : isFailedSearch && !isLoading
            ? 'border-red-500 ring-2 ring-red-500/10'
            : 'border-slate-800 hover:border-slate-700'
        }`}
        {...getComboboxProps()}
      >
        <input
          placeholder="Search for content..."
          className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          onKeyUp={handleSearch}
          onFocus={() => openMenu()}
          {...getInputProps()}
        />
        <button
          onClick={handleSearch}
          className="text-slate-400 hover:text-white transition duration-150 focus:outline-none cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      <ul
        {...getMenuProps()}
        className={`absolute top-full left-0 w-full mt-1.5 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-800/50 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        {isOpen && suggestionData?.length > 0 && renderSuggestions()}
        {isOpen && isLoading && !isEmpty(searchQuery) && isEmpty(suggestionData) && (
          <li
            className="py-3 px-4 text-slate-400 text-sm animate-pulse"
            {...getItemProps({ item: '', index: 0 })}
          >
            Loading...
          </li>
        )}
        {isOpen && isEmpty(searchQuery) && isEmpty(suggestionData) && (
          <>
            <li
              className="py-2.5 px-4 text-slate-400 text-xs hover:bg-slate-800/30 select-none"
              {...getItemProps({ item: '', index: 0 })}
            >
              Press Enter for advanced search
            </li>
            <li
              className="py-2.5 px-4 text-slate-400 text-xs hover:bg-slate-800/30 select-none border-t border-slate-800/30"
              {...getItemProps({ item: '', index: 1 })}
            >
              Use the ':' character to search for tags
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default SearchSuggestion;
