'use client'
import React from 'react'
import StoreProvider from '@/app/StoreProvider'
import SearchFilterComponent from './SearchFilterComponent'


type SearchProps = { searchParam: string; currentCategory: string; currentPage: number };


const SearchFilterProvider: React.FC<SearchProps> = ({
  searchParam,
  currentCategory,
  currentPage
}) => {
  return (
    <StoreProvider>
        <SearchFilterComponent searchParam={searchParam} currentCategory={currentCategory} currentPage={currentPage}/>
    </StoreProvider>
  )
}

export default SearchFilterProvider