import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
    const [value, setValue] = useState(function () {
        const storedData = localStorage.getItem(key)
        if (JSON.parse(storedData)) return JSON.parse(storedData)
        return initialState
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key])

    return [value, setValue]
}