import { useEffect, useState } from "react";
import { userService } from "../services/userService";

export function useUsers({ limit = 20, offset = 0 } = {}) {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.listUsers({ limit, offset });
      setUsers(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [limit, offset]);

  return { users, meta, isLoading, error, reload: load };
}