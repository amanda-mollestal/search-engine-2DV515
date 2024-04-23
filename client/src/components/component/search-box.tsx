'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from '@/components/ui/table'
import Link from 'next/link'

interface SearchResult {
  name: string
  score: number
  freqScore: number
  locScore: number
}

export function SearchBox() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [time, setTime] = useState(0)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    setIsLoading(true)
    setError('')
    setTime(0)

    try {

      if (!searchQuery) return
      const startTime = performance.now()

      const response = await fetch('http://localhost:3030/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery.toLowerCase().trim()}),
      })

      if (!response.ok) {
        setTime(0)
        setError('Error searching for results')
      }

      const data = await response.json()

      if (data.length === 0) {
        setTime(0)
        setError('No results found')
      }

      const endTime = performance.now()
      setTime(Number((endTime - startTime).toFixed(4)))

      setSearchResults(data)
    } catch (err) {
      setTime(0)
      setError('Error searching for results')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div>
      <div className="flex flex-col gap-4 m-3">
        <div className="flex gap-2 items-center">
          <input
            className="block w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            id="searchbox"
            placeholder="java"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            autoComplete="off"
          />
          <Button
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            onClick={handleSearch}
            disabled={isLoading}
          >
            Search
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left text-white">Link</TableHead>
              <TableHead className="text-right text-white">Score</TableHead>
              <TableHead className="text-right text-white">Content</TableHead>
              <TableHead className="text-right text-white">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchResults.slice(0, 5).map((result, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-purple-400 hover:text-purple-500 cursor-pointer">

                  <Link href={`https://wikipedia.org/wiki/${result.name}`} rel="noopener noreferrer" target="_blank">
                    {result.name.replace(/_/g, ' ')}
                  </Link>

                </TableCell>
                <TableCell className="text-right text-gray-300">{result.score.toFixed(2)}</TableCell>
                <TableCell className="text-right text-gray-300">{result.freqScore.toFixed(2)}</TableCell>
                <TableCell className="text-right text-gray-300">{result.locScore.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {!isLoading && !error && (
          <div className="text-sm text-gray-400">Found {searchResults.length} results in {time} ms </div>
        )}
      </div>
    </div>
  )
}

