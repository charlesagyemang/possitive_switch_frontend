import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// API Base URL
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6070/api/v1';

// Types
export interface OrganizationNode {
  id: string;
  name: string;
  title: string;
  email: string;
  department: string;
  level: number;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  children?: OrganizationNode[];
  isExpanded?: boolean;
}

export interface OrganizationStatistics {
  total_employees: number;
  departments_count: number;
  max_level: number;
  managers_count: number;
  by_department: Record<string, number>;
  by_level: Record<string, number>;
}

export interface Department {
  id: string;
  name: string;
  count: number;
}

export interface CreateOrganizationNodeData {
  name: string;
  title: string;
  email: string;
  department: string;
  parent_id?: string | null;
}

export interface UpdateOrganizationNodeData extends CreateOrganizationNodeData {
  id: string;
}

// API Functions
const getAuthHeaders = (apiKey: string) => ({
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
});

// Get all organization nodes
export const fetchOrganizationNodes = async (apiKey: string, format?: 'hierarchy' | 'flat') => {
  const url = format 
    ? `${NEXT_PUBLIC_API_BASE_URL}/organization_nodes?format_type=${format}`
    : `${NEXT_PUBLIC_API_BASE_URL}/organization_nodes`;
    
  const response = await fetch(url, {
    headers: getAuthHeaders(apiKey),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch organization nodes');
  }

  return response.json();
};

// Get single organization node
export const fetchOrganizationNode = async (apiKey: string, nodeId: string) => {
  const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/organization_nodes/${nodeId}`, {
    headers: getAuthHeaders(apiKey),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch organization node');
  }

  return response.json();
};

// Create organization node
export const createOrganizationNode = async (apiKey: string, data: CreateOrganizationNodeData) => {
  console.log('=== createOrganizationNode ===');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'No API key');
  console.log('Data being sent:', data);
  console.log('API URL:', `${NEXT_PUBLIC_API_BASE_URL}/organization_nodes`);
  
  const requestBody = {
    organization_node: {
      ...data,
      parent_id: data.parent_id === '__none__' ? null : data.parent_id
    }
  };
  console.log('Request body:', JSON.stringify(requestBody, null, 2));

  const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/organization_nodes`, {
    method: 'POST',
    headers: getAuthHeaders(apiKey),
    body: JSON.stringify(requestBody),
  });

  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
      console.log('Error response data:', errorData);
    } catch (e) {
      console.log('Failed to parse error response as JSON:', e);
      const textResponse = await response.text();
      console.log('Error response as text:', textResponse);
      throw new Error(`Failed to create organization node. Status: ${response.status}, Response: ${textResponse}`);
    }
    throw new Error(errorData.message || 'Failed to create organization node');
  }

  const responseData = await response.json();
  console.log('Success response data:', responseData);
  return responseData;
};

// Update organization node
export const updateOrganizationNode = async (apiKey: string, data: UpdateOrganizationNodeData) => {
  const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/organization_nodes/${data.id}`, {
    method: 'PUT',
    headers: getAuthHeaders(apiKey),
    body: JSON.stringify({
      organization_node: {
        name: data.name,
        title: data.title,
        email: data.email,
        department: data.department,
        parent_id: data.parent_id === '__none__' ? null : data.parent_id
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update organization node');
  }

  return response.json();
};

// Delete organization node
export const deleteOrganizationNode = async (apiKey: string, nodeId: string) => {
  const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/organization_nodes/${nodeId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(apiKey),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete organization node');
  }

  return response.json();
};

// Get organization statistics
export const fetchOrganizationStatistics = async (apiKey: string) => {
  const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/organization_nodes/statistics`, {
    headers: getAuthHeaders(apiKey),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch organization statistics');
  }

  return response.json();
};

// Get departments
export const fetchDepartments = async (apiKey: string) => {
  const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/organization_nodes/departments`, {
    headers: getAuthHeaders(apiKey),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch departments');
  }

  return response.json();
};


// React Query Hooks
export const useOrganizationNodes = (apiKey: string, format?: 'hierarchy' | 'flat') => {
  return useQuery({
    queryKey: ['organizationNodes', apiKey, format],
    queryFn: () => fetchOrganizationNodes(apiKey, format),
    enabled: !!apiKey,
  });
};

export const useOrganizationNode = (apiKey: string, nodeId: string) => {
  return useQuery({
    queryKey: ['organizationNode', apiKey, nodeId],
    queryFn: () => fetchOrganizationNode(apiKey, nodeId),
    enabled: !!apiKey && !!nodeId,
  });
};

export const useOrganizationStatistics = (apiKey: string) => {
  return useQuery({
    queryKey: ['organizationStatistics', apiKey],
    queryFn: () => fetchOrganizationStatistics(apiKey),
    enabled: !!apiKey,
  });
};

export const useDepartments = (apiKey: string) => {
  return useQuery({
    queryKey: ['departments', apiKey],
    queryFn: () => fetchDepartments(apiKey),
    enabled: !!apiKey,
  });
};


export const useCreateOrganizationNode = (apiKey: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrganizationNodeData) => createOrganizationNode(apiKey, data),
    onSuccess: () => {
      // Invalidate and refetch organization data
      queryClient.invalidateQueries({ queryKey: ['organizationNodes', apiKey] });
      queryClient.invalidateQueries({ queryKey: ['organizationStatistics', apiKey] });
      queryClient.invalidateQueries({ queryKey: ['departments', apiKey] });
    },
  });
};

export const useUpdateOrganizationNode = (apiKey: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateOrganizationNodeData) => updateOrganizationNode(apiKey, data),
    onSuccess: () => {
      // Invalidate and refetch organization data
      queryClient.invalidateQueries({ queryKey: ['organizationNodes', apiKey] });
      queryClient.invalidateQueries({ queryKey: ['organizationStatistics', apiKey] });
    },
  });
};

export const useDeleteOrganizationNode = (apiKey: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (nodeId: string) => deleteOrganizationNode(apiKey, nodeId),
    onSuccess: () => {
      // Invalidate and refetch organization data
      queryClient.invalidateQueries({ queryKey: ['organizationNodes', apiKey] });
      queryClient.invalidateQueries({ queryKey: ['organizationStatistics', apiKey] });
      queryClient.invalidateQueries({ queryKey: ['departments', apiKey] });
    },
  });
};

// Utility function to build hierarchy from flat data
export const buildHierarchyFromFlat = (nodes: OrganizationNode[]): OrganizationNode[] => {
  const nodeMap = new Map<string, OrganizationNode>();
  const roots: OrganizationNode[] = [];

  // Create a map of all nodes
  nodes.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  // Build the hierarchy
  nodes.forEach(node => {
    const nodeWithChildren = nodeMap.get(node.id)!;
    if (node.parent_id && nodeMap.has(node.parent_id)) {
      const parent = nodeMap.get(node.parent_id)!;
      if (!parent.children) parent.children = [];
      parent.children.push(nodeWithChildren);
    } else {
      roots.push(nodeWithChildren);
    }
  });

  return roots;
};

// Transform API response to frontend format
export const transformApiResponse = (apiResponse: any) => {
  if (apiResponse.success && apiResponse.data) {
    return {
      nodes: apiResponse.data.nodes || [],
      hierarchy: apiResponse.data.hierarchy || [],
      statistics: apiResponse.data.statistics || {}
    };
  }
  throw new Error(apiResponse.message || 'Invalid API response');
};
