import { useEffect, useState } from "react";
import { notify } from "../notification";
import axiosInstance from "../axiosInstance";


export default function useData(url) {
    const [data, setData] = useState({results: []});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!url) {
            return
        }
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(url);
                if (isMounted) {
                    if (url.includes('offset')) {
                        setData((prev) => ({
                            ...response.data,
                            results: [...prev.results, ...response.data.results]
                        }))
                    } else {
                        setData(response.data);
                    }
                }
            } catch (error) {
                setError(error);
                notify('error', error.response.data['detail'] || error.message)
            } finally {
                setLoading(false)
            }
        };

        // const timeoutId = setTimeout(() => {
        fetchData();
        // }, 200)

        return () => {
            isMounted = false;
            // clearTimeout(timeoutId)
        };
    }, [url]);
  
    return { data, loading, error };
}


export function useData2(url, setData) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        if (!url) {
            return
        }
        
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(url);
                if (isMounted) {
                    setData(response.data);
                }
            } catch (error) {
                setError(error);
                notify('error', error.response.data['detail'] || error.message)
            } finally {
                setLoading(false)
            }
        };
  
        fetchData();
    
        return () => {
            isMounted = false;
        };
    }, [url]);
  
    return { loading, error };
}
  