import { useState, useEffect } from "react";

export function useFetch(fetchFn, initialValue) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(initialValue);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);

            try {
                const data = await fetchFn();
                setData(data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setError({ message: error.message || 'Could not fetch data.' });
            }
        }

        fetchData();
    }, [fetchFn]);

    return { isLoading, data, error, setData };
}