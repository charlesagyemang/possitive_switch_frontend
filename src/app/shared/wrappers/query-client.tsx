"use client";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useState } from "react";

const client = new QueryClient();
function QueryClientWrapper({ children }: { children: React.ReactNode }) {
  // const [client] = useState(() => new QueryClient());

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default QueryClientWrapper;
