import { useEffect } from "react";

export function useKey(key, event) {
    useEffect(function () {
        function callback(e) {
            if (e.code.toLowerCase() === key.toLowerCase()) {
                event()
            }
        }
        document.addEventListener('keydown', callback)
        return function () {
            document.removeEventListener('keydown', callback)
        }
    }, [key, event])
}