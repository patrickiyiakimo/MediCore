import { useEffect, useState, useCallback } from "react";

export function useList(fetcher, { limit = 20, offset = 0 } = {}) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher({ limit, offset });
      setItems(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, limit, offset]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, meta, isLoading, error, reload: load };
}
