import { useEffect, useState } from "react";

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(
        function () {
            const controller = new AbortController()

            async function fetchMovie() {
                try {
                    setError('')
                    setIsLoading(true)
                    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=b032d39e`, { signal: controller.signal })
                    if (!response.ok) throw new Error('something is broken')
                    const data = await response.json()
                    if (data.Response === 'False') throw new Error('Movie not found')
                    setMovies(data.Search)
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.log(err)
                        setError(err.message)
                    }

                } finally {
                    setIsLoading(false)
                }
            }

            if (!query.length) {
                setMovies([])
                setError('')
                return
            }
            fetchMovie()

            return function () {
                controller.abort();
            }
        }, [query])

    return [movies, isLoading, error]

}