import React from 'react'
import PostList from '@/components/posts/post-list';
import { fetchPostBySearch } from '@/lib/query/post';
type SearchPageProps = {
    searchParams : Promise<{term : string}>
}
const SearchPage : React.FC<SearchPageProps> =async  ({searchParams}) => {
  const term = (await searchParams).term;

  const searchResult = await fetchPostBySearch(term);
    console.log("Search result:", searchResult);
  return (
    <div>
        <h1 className='text-md italic'>Search result for {term}</h1>
        <PostList fetchData={() => fetchPostBySearch(term)} />
    </div>
  )
}

export default SearchPage
