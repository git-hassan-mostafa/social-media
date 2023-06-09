import { useSession } from "next-auth/react";
import React from "react";
import { useEffect, useState } from "react";

type methodType = 'GET' | 'POST' | 'PATCH' | 'DElETE' | 'PUT'
export const fetchData = async (url: string, method: methodType, body?: {}, options?: {}) => {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body),
            ...options
        });
        if (!response.ok) {
            console.error('not ok')
        }
        const data = await response.json()
        return data
    }
    catch (error) {
        console.error(error)
    }

};




export const useInfiniteFetching = <T>(url: string, queries?: string, dependencies?: any[]) => {

    const [data, setData] = useState<T[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [hasNext, setHasNext] = useState(true)


    const fetchInfiteData = async (reset = false) => {
        if (hasNext) {
            if (reset) {
                setData([]);
                setPageNumber(1);
                setHasNext(true);
            }

            else if (!data || data?.length < 1) setIsLoading(true)
            else setIsFetching(true);
            const newData = await fetchData(`${url}?${queries}&page=${pageNumber}`, 'GET')
            if (newData?.data?.length > 0) setData((prev: T[] | null) => (reset ? [] : prev || []).concat(newData?.data))
            else setHasNext(false)
            setIsLoading(false)
            setIsFetching(false)
        }
        else return

    }
    const loadMore = () => {
        if (hasNext) setPageNumber(prev => prev + 1)
        else return;
    }

    const refetch = async () => {
        setIsLoading(true)
        await fetchInfiteData(true)
        setIsLoading(false)
    }


    useEffect(() => {
        fetchInfiteData();
    }, [pageNumber]);

    useEffect(() => {
        if (Number(data?.length) >= 10) {
            const handleScroll = () => {
                const documentHeight = document.documentElement.scrollHeight;
                const scrollPosition = window.innerHeight + window.pageYOffset;
                if (documentHeight === scrollPosition) {
                    if (hasNext) {
                        setTimeout(() => loadMore(), 300);
                    }
                    else return;
                }
            };
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [data, pageNumber]);


    return { data, isLoading, loadMore, isFetching, refetch, hasNext }
}
