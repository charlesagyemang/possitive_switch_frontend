"use client";

import { useState, useCallback, useMemo, useEffect, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Crown, 
  User, 
  Building2,
  Sparkles,
  Eye
} from "lucide-react";
import { 
  useOrganizationNodes,
  useOrganizationStatistics,
  OrganizationNode,
  buildHierarchyFromFlat
} from "@/api/organization/organization-api";

interface Department {
  id: string;
  name: string;
  color: string;
}

type OrgNode = OrganizationNode & {
  children?: OrgNode[];
  isExpanded?: boolean;
};

interface PublicOrgViewProps {
  params: Promise<{
    public_token: string;
  }>;
}

export default function PublicOrgView({ params }: PublicOrgViewProps) {
  const { public_token } = use(params);
  
  // For public viewing, we'll use a special API key or the token itself
  // This would need to be implemented on the backend to validate public tokens
  const apiKey = public_token; // This might need to be adjusted based on your backend implementation

  // API data fetching
  const { data: orgResponse, isLoading: isLoadingOrg } = useOrganizationNodes(apiKey);
  const { data: statsResponse, isLoading: isLoadingStats } = useOrganizationStatistics(apiKey);

  // Transform API data
  const orgData: OrganizationNode[] = useMemo(() => {
    if (orgResponse?.success && orgResponse?.data?.nodes) {
      return orgResponse.data.nodes.map((node: any) => ({
        ...node,
        parentId: node.parent_id,
        children: [],
        isExpanded: true
      }));
    }
    return [];
  }, [orgResponse]);

  const statistics = useMemo(() => {
    if (statsResponse?.success && statsResponse?.data) {
      return statsResponse.data;
    }
    return {
      total_employees: 0,
      departments_count: 0,
      max_level: 0,
      managers_count: 0,
      by_department: {},
      by_level: {}
    };
  }, [statsResponse]);


  const [departments] = useState<Department[]>([
    { id: "executive", name: "Executive", color: "bg-purple-900/50 text-purple-200 border-purple-600" },
    { id: "technology", name: "Technology", color: "bg-blue-900/50 text-blue-200 border-blue-600" },
    { id: "hr", name: "Human Resources", color: "bg-green-900/50 text-green-200 border-green-600" },
    { id: "marketing", name: "Marketing", color: "bg-pink-900/50 text-pink-200 border-pink-600" },
    { id: "sales", name: "Sales", color: "bg-orange-900/50 text-orange-200 border-orange-600" },
    { id: "finance", name: "Finance", color: "bg-yellow-900/50 text-yellow-200 border-yellow-600" }
  ]);

  // State for organization data with hierarchy info
  const [orgDataWithExpansion, setOrgDataWithExpansion] = useState<OrgNode[]>([]);

  // Build hierarchical structure
  const buildHierarchy = useCallback((nodes: OrgNode[]): OrgNode[] => {
    const nodeMap = new Map<string, OrgNode>();
    const roots: OrgNode[] = [];

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
  }, []);

  // Update orgDataWithExpansion when orgData changes
  useEffect(() => {
    if (orgData.length > 0) {
      const expandedData = orgData.map(node => ({
        ...node,
        children: [],
        isExpanded: true
      }));
      setOrgDataWithExpansion(expandedData);
    }
  }, [orgData]);

  const hierarchy = buildHierarchy(orgDataWithExpansion);

  // Loading state
  if (isLoadingOrg || isLoadingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-400 font-medium">Loading organizational structure...</p>
        </div>
      </div>
    );
  }

  const getDepartmentColor = (departmentId: string) => {
    return departments.find(d => d.id === departmentId)?.color || "bg-gray-700 text-gray-200 border-gray-600";
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 0: return <Crown className="w-4 h-4 text-purple-400" />;
      case 1: return <Building2 className="w-4 h-4 text-blue-400" />;
      default: return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderOrgChart = () => {
    // Organize nodes by level for proper positioning
    const nodesByLevel: { [level: number]: OrgNode[] } = {};
    const allNodes = [...orgDataWithExpansion];
    
    // Group nodes by their level
    allNodes.forEach(node => {
      if (!nodesByLevel[node.level]) {
        nodesByLevel[node.level] = [];
      }
      nodesByLevel[node.level].push(node);
    });

    const maxLevel = Math.max(...Object.keys(nodesByLevel).map(Number));

    const renderOrgNode = (node: OrgNode) => {
      const children = allNodes.filter(n => n.parent_id === node.id);
      const hasChildren = children.length > 0;

      return (
        <div key={node.id} className="flex flex-col items-center">
          {/* Node Card */}
          <div className="relative group">
            <div className={`
              bg-gray-800 border-2 rounded-xl p-4 shadow-lg hover:shadow-xl 
              transition-all duration-300 transform hover:scale-105 cursor-pointer
              min-w-[240px] max-w-[280px]
              ${node.level === 0 ? 'border-purple-500 bg-gradient-to-br from-purple-900/50 to-indigo-900/50' : 
                node.level === 1 ? 'border-blue-500 bg-gradient-to-br from-blue-900/50 to-cyan-900/50' :
                'border-gray-600 bg-gray-800'}
            `}>
              {/* Header with icon and department */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getLevelIcon(node.level)}
                  <Badge className={`text-xs ${getDepartmentColor(node.department)}`}>
                    {departments.find(d => d.id === node.department)?.name}
                  </Badge>
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center">
                <div className={`
                  w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white font-bold text-lg
                  ${node.level === 0 ? 'bg-gradient-to-br from-purple-600 to-indigo-700' :
                    node.level === 1 ? 'bg-gradient-to-br from-blue-600 to-cyan-700' :
                    'bg-gradient-to-br from-gray-600 to-gray-700'}
                `}>
                  {node.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-100 text-sm mb-1">
                  {node.name}
                </h3>
                <p className="text-xs text-gray-300 mb-2">
                  {node.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {node.email}
                </p>
              </div>
            </div>

            {/* Connection line down (if has children) */}
            {hasChildren && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-600"></div>
            )}
          </div>

          {/* Children */}
          {hasChildren && (
            <div className="mt-6 relative">
              {/* Horizontal line */}
              {children.length > 1 && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600 transform -translate-y-6"></div>
              )}
              
              {/* Children container */}
              <div className="flex items-start justify-center gap-8">
                {children.map((child, index) => (
                  <div key={child.id} className="relative">
                    {/* Vertical line up to horizontal line */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-600"></div>
                    {renderOrgNode(child)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };

    // Find root nodes (level 0)
    const rootNodes = allNodes.filter(node => node.level === 0);

    return (
      <div className="p-8 overflow-auto">
        <div className="flex flex-col items-center space-y-12">
          {rootNodes.map(rootNode => renderOrgNode(rootNode))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header with Company Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-100">
              Organizational Structure
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore our company&apos;s organizational hierarchy and team structure
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{statistics.total_employees}</div>
                  <div className="text-sm text-gray-300">Total Employees</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{statistics.departments_count}</div>
                  <div className="text-sm text-gray-300">Departments</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {statistics.max_level + 1}
                  </div>
                  <div className="text-sm text-gray-300">Org Levels</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-900/50 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">
                    {statistics.managers_count}
                  </div>
                  <div className="text-sm text-gray-300">Managers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Organizational Chart */}
        <Card className="bg-gray-800/90 backdrop-blur-sm shadow-xl border-gray-700">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-100">
              <Eye className="w-6 h-6 text-blue-400" />
              Organizational Chart
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {renderOrgChart()}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm mt-8">
          <p>This organizational structure is shared publicly via secure link</p>
        </div>
      </div>
    </div>
  );
}
