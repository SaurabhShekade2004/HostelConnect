import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get token from localStorage if available
  const user = localStorage.getItem('hostelUser');
  const token = user ? JSON.parse(user).token : null;
  
  console.log(`Making ${method} request to ${url}`, { hasToken: !!token });
  
  // Check if data is FormData
  const isFormData = data instanceof FormData;
  
  // Build headers with auth token if available
  const headers: Record<string, string> = {
    ...(data && !isFormData ? { "Content-Type": "application/json" } : {}),
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };

  if (isFormData && token) {
    console.log("FormData submission with auth token");
  }

  const res = await fetch(url, {
    method,
    headers,
    body: isFormData ? data as FormData : data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    console.error(`Request failed: ${res.status} ${res.statusText}`);
    const errorText = await res.text();
    console.error(`Error details: ${errorText}`);
    throw new Error(`${res.status}: ${errorText || res.statusText}`);
  }
  
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get token from localStorage if available
    const user = localStorage.getItem('hostelUser');
    const token = user ? JSON.parse(user).token : null;
    
    console.log(`Making GET request to ${queryKey[0]}`, { hasToken: !!token });
    
    // Build headers with auth token if available
    const headers: Record<string, string> = {
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
    
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
        headers
      });
  
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }
  
      if (!res.ok) {
        console.error(`Request failed: ${res.status} ${res.statusText}`);
        const errorText = await res.text();
        console.error(`Error details: ${errorText}`);
        throw new Error(`${res.status}: ${errorText || res.statusText}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error(`Error fetching ${queryKey[0]}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
