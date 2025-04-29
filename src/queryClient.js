// Central React-Query client (60 s staleness, no auto-refocus refetch)
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 60_000, refetchOnWindowFocus: false }
    }
});
