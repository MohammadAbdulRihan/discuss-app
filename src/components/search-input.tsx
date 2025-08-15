"use client";
import React from 'react'
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import { search } from '@/actions/search';

const SearchInput = () => {

const searchParams = useSearchParams();
  return (
    <div className='flex items-center w-full'>
      <form action={search}>
        <Input type='text' name='term' defaultValue={searchParams.get("term") || ""} placeholder='Search for post' />
      </form>
    </div>
  )
}

export default SearchInput
