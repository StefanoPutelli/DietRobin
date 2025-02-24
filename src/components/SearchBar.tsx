'use client';
import React from 'react';
import { foodInterface } from '@/lib/foodApi';

export default function SearchBar({ setCustResult, setCustLoading, custResult, clickHandler = () => { } }: { setCustResult: (result: foodInterface[]) => void, setCustLoading: (val: boolean) => void, custResult: boolean, clickHandler?: (e: any) => void }) {

  const timeout = React.useRef<NodeJS.Timeout>();
  const [results, setResults] = React.useState<foodInterface[]>([]);
  const [loading, setLoading] = React.useState(false);

  function insertResult(result: foodInterface[]) {
    if (custResult) {
      setCustResult(result);
    }
    else {
      setResults(result);
    }
  }

  function search(text: string) {
    if (text === '') {
      insertResult([]);
      return;
    }
    if (custResult) {
      setCustLoading(true);
    } else {
      setLoading(true);
    }
    insertResult([]);
    fetch(`/api/food/search?query=${text}`).then(res => res.json()).then(data => {
      insertResult(data);
      setLoading(false);
      setCustLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      search(e.target.value);
    }, 400);
  }

  return (
    <div className="flex flex-col w-full h-full relative">
      <input id="searchFoodInput" type="text" className="border border-base-300 p-2 rounded-lg w-full h-[3em]" placeholder="Cerca alimento..." onChange={handleSearch} />
      {results.length ?
        <div className='flex flex-col max-h-[300px] overflow-y-scroll absolute left-0 top-[3em] w-full border-base-300 bg-base-100 border-[1px] rounded-lg mt-[0.1em]'>
          {results.map((result: any) => (
            <div key={result.id} className="w-full p-2 rounded-lg mt-2 cursor-pointer hover:bg-base-300" onClick={() => {
              (document.getElementById('searchFoodInput') as HTMLInputElement).value = '';
              insertResult([]);
              clickHandler(result)
            }}>
              {result.foodName}
            </div>
          ))}
          :
          {loading ?
            <div className='flex justify-center mt-[1em]'>
              <span className="loading loading-dots loading-md"></span>
            </div>
            :
            null}
        </div> : null
      }
    </div>
  )
}