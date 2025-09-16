"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Crown, 
  User, 
  Building2,
  ChevronDown,
  ChevronRight,
  Save,
  Eye,
  Sparkles,
  Network,
  Share2,
  Copy,
  ExternalLink
} from "lucide-react";
import { 
  useOrganizationNodes,
  useOrganizationStatistics,
  useDepartments,
  useCreateOrganizationNode,
  useUpdateOrganizationNode,
  useDeleteOrganizationNode,
  buildHierarchyFromFlat,
  OrganizationNode,
  CreateOrganizationNodeData,
  UpdateOrganizationNodeData
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

export default function OrganizationalStructurePage() {
  const params = useParams();
  const apiKey = params.api_key as string;

  // API data fetching
  const { data: orgResponse, isLoading: isLoadingOrg } = useOrganizationNodes(apiKey);
  const { data: statsResponse, isLoading: isLoadingStats } = useOrganizationStatistics(apiKey);
  const { data: deptResponse, isLoading: isLoadingDepts } = useDepartments(apiKey);
  
  // API mutations
  const createNodeMutation = useCreateOrganizationNode(apiKey);
  const updateNodeMutation = useUpdateOrganizationNode(apiKey);
  const deleteNodeMutation = useDeleteOrganizationNode(apiKey);

  // Transform API data
  const orgData: OrganizationNode[] = useMemo(() => {
    if (orgResponse?.success && orgResponse?.data?.nodes) {
      return orgResponse.data.nodes.map((node: any) => ({
        ...node,
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
    { id: "executive", name: "Executive", color: "bg-purple-100 text-purple-800 border-purple-200" },
    { id: "technology", name: "Technology", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { id: "hr", name: "Human Resources", color: "bg-green-100 text-green-800 border-green-200" },
    { id: "marketing", name: "Marketing", color: "bg-pink-100 text-pink-800 border-pink-200" },
    { id: "sales", name: "Sales", color: "bg-orange-100 text-orange-800 border-orange-200" },
    { id: "finance", name: "Finance", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
  ]);

  const [viewMode, setViewMode] = useState<'tree' | 'chart'>('chart');
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [publicLink, setPublicLink] = useState<string | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [newNode, setNewNode] = useState({
    name: '',
    title: '',
    email: '',
    department: '',
    parent_id: ''
  });
  const [editNode, setEditNode] = useState({
    id: '',
    name: '',
    title: '',
    email: '',
    department: '',
    parent_id: ''
  });

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading organizational structure...</p>
        </div>
      </div>
    );
  }

  const getDepartmentColor = (departmentId: string) => {
    return departments.find(d => d.id === departmentId)?.color || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 0: return <Crown className="w-4 h-4 text-purple-600" />;
      case 1: return <Building2 className="w-4 h-4 text-blue-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const toggleNodeExpansion = (nodeId: string) => {
    setOrgDataWithExpansion(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, isExpanded: !node.isExpanded }
        : node
    ));
  };

  const addNewNode = async () => {
    if (!newNode.name || !newNode.title || !newNode.email || !newNode.department) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      console.log('=== addNewNode Form Submission ===');
      console.log('Form data (newNode):', newNode);
      console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'No API key');
      
      const nodeData: CreateOrganizationNodeData = {
        name: newNode.name,
        title: newNode.title,
        email: newNode.email,
        department: newNode.department,
        parent_id: newNode.parent_id === '__none__' ? null : newNode.parent_id || null
      };

      console.log('Processed nodeData:', nodeData);
      
      const result = await createNodeMutation.mutateAsync(nodeData);
      console.log('Node creation result:', result);
      
      setNewNode({ name: '', title: '', email: '', department: '', parent_id: '' });
      setIsAddingNode(false);
    } catch (error) {
      console.error('Failed to create node - Full error:', error);
      console.error('Error message:', (error as Error)?.message);
      console.error('Error stack:', (error as Error)?.stack);
      alert(`Failed to create person: ${(error as Error)?.message || 'Unknown error'}`);
    }
  };

  const startEditNode = (nodeId: string) => {
    console.log('Starting edit for node:', nodeId); // Debug log
    const node = orgDataWithExpansion.find(n => n.id === nodeId);
    console.log('Found node:', node); // Debug log
    if (node) {
      setEditNode({
        id: node.id,
        name: node.name,
        title: node.title,
        email: node.email,
        department: node.department,
        parent_id: node.parent_id ? node.parent_id : '__none__'
      });
      setEditingNode(nodeId);
      console.log('Set editingNode to:', nodeId); // Debug log
    }
  };

  const saveEditNode = async () => {
    if (!editNode.name || !editNode.title || !editNode.email || !editNode.department) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const nodeData: UpdateOrganizationNodeData = {
        id: editNode.id,
        name: editNode.name,
        title: editNode.title,
        email: editNode.email,
        department: editNode.department,
        parent_id: editNode.parent_id === '__none__' ? null : editNode.parent_id || null
      };

      await updateNodeMutation.mutateAsync(nodeData);
      setEditingNode(null);
      setEditNode({ id: '', name: '', title: '', email: '', department: '', parent_id: '' });
    } catch (error) {
      console.error('Failed to update node:', error);
      alert('Failed to update person. Please try again.');
    }
  };

  const cancelEdit = () => {
    setEditingNode(null);
    setEditNode({ id: '', name: '', title: '', email: '', department: '', parent_id: '' });
  };

  const generatePublicLink = async () => {
    setIsGeneratingLink(true);
    try {
      // For now, we'll generate a simple public token based on the API key
      // In a real implementation, this would call a backend API to generate a proper public token
      const publicToken = btoa(apiKey).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      const link = `${window.location.origin}/org/${publicToken}`;
      
      setPublicLink(link);
      setShowLinkDialog(true);
    } catch (error) {
      console.error('Failed to generate public link:', error);
      alert('Failed to generate public link. Please try again.');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = async () => {
    if (publicLink) {
      try {
        await navigator.clipboard.writeText(publicLink);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link:', error);
        alert('Failed to copy link. Please copy manually.');
      }
    }
  };

  const openPublicLink = () => {
    if (publicLink) {
      window.open(publicLink, '_blank');
    }
  };

  const deleteNode = async (nodeId: string) => {
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this person? This will also remove all their direct reports.')) {
      try {
        await deleteNodeMutation.mutateAsync(nodeId);
      } catch (error) {
        console.error('Failed to delete node:', error);
        alert('Failed to delete person. Please try again.');
      }
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
              bg-white dark:bg-gray-800 border-2 rounded-xl p-4 shadow-lg hover:shadow-xl 
              transition-all duration-300 transform hover:scale-105 cursor-pointer
              min-w-[240px] max-w-[280px]
              ${node.level === 0 ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30' : 
                node.level === 1 ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30' :
                'border-gray-200 dark:border-gray-600'}
            `}>
              {/* Header with icon and actions */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getLevelIcon(node.level)}
                  <Badge className={`text-xs ${getDepartmentColor(node.department)}`}>
                    {departments.find(d => d.id === node.department)?.name}
                  </Badge>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditNode(node.id)}
                    className="h-6 w-6 p-0 hover:bg-blue-100"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNode(node.id)}
                    className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center">
                <div className={`
                  w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white font-bold text-lg
                  ${node.level === 0 ? 'bg-gradient-to-br from-purple-500 to-indigo-600' :
                    node.level === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                    'bg-gradient-to-br from-gray-500 to-gray-600'}
                `}>
                  {node.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
                  {node.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {node.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                  {node.email}
                </p>
              </div>
            </div>

            {/* Connection line down (if has children) */}
            {hasChildren && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-300 dark:bg-gray-600"></div>
            )}
          </div>

          {/* Children */}
          {hasChildren && (
            <div className="mt-6 relative">
              {/* Horizontal line */}
              {children.length > 1 && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600 transform -translate-y-6"></div>
              )}
              
              {/* Children container */}
              <div className="flex items-start justify-center gap-8">
                {children.map((child, index) => (
                  <div key={child.id} className="relative">
                    {/* Vertical line up to horizontal line */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-300 dark:bg-gray-600"></div>
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

  const renderTreeNode = (node: OrgNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const paddingLeft = depth * 24;

    return (
      <div key={node.id} className="select-none">
        <div 
          className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleNodeExpansion(node.id)}
              className="mr-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {node.isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6 mr-2" />}
          
          <div className="flex items-center gap-2 mr-3">
            {getLevelIcon(node.level)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {node.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {node.title}
                </p>
              </div>
              <Badge className={`text-xs ${getDepartmentColor(node.department)}`}>
                {departments.find(d => d.id === node.department)?.name}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEditNode(node.id)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteNode(node.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {hasChildren && node.isExpanded && node.children && (
          <div>
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Organizational Structure
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage your company&apos;s organizational hierarchy
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={viewMode === 'chart' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('chart')}
              className="h-8"
            >
              <Network className="w-4 h-4 mr-1" />
              Chart
            </Button>
            <Button
              variant={viewMode === 'tree' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tree')}
              className="h-8"
            >
              <Users className="w-4 h-4 mr-1" />
              Tree
            </Button>
          </div>
          
          <Button 
            onClick={generatePublicLink}
            disabled={isGeneratingLink}
            variant="outline"
            className="mr-3"
          >
            {isGeneratingLink ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            {isGeneratingLink ? 'Generating...' : 'Share Public Link'}
          </Button>
          
          <Dialog open={isAddingNode} onOpenChange={setIsAddingNode}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Person
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newNode.name}
                    onChange={(e) => setNewNode(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={newNode.title}
                    onChange={(e) => setNewNode(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter job title"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newNode.email}
                    onChange={(e) => setNewNode(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={newNode.department} 
                    onValueChange={(value) => setNewNode(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="parent">Reports To</Label>
                  <Select 
                    value={newNode.parent_id} 
                    onValueChange={(value) => setNewNode(prev => ({ ...prev, parent_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No Manager (Top Level)</SelectItem>
                      {orgDataWithExpansion.map(person => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name} - {person.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={addNewNode} 
                    className="flex-1"
                    disabled={createNodeMutation.isPending}
                  >
                    {createNodeMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {createNodeMutation.isPending ? 'Adding...' : 'Add Person'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingNode(false)}
                    disabled={createNodeMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Person Dialog */}
          <Dialog open={!!editingNode} onOpenChange={(open) => !open && cancelEdit()}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editNode.name}
                    onChange={(e) => setEditNode(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-title">Job Title</Label>
                  <Input
                    id="edit-title"
                    value={editNode.title}
                    onChange={(e) => setEditNode(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter job title"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editNode.email}
                    onChange={(e) => setEditNode(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Select 
                    value={editNode.department} 
                    onValueChange={(value) => setEditNode(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-parent">Reports To</Label>
                  <Select 
                    value={editNode.parent_id} 
                    onValueChange={(value) => setEditNode(prev => ({ ...prev, parent_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No Manager (Top Level)</SelectItem>
                      {orgDataWithExpansion
                        .filter(person => person.id !== editNode.id) // Don't allow self-reporting
                        .map(person => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.name} - {person.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={saveEditNode} 
                    className="flex-1"
                    disabled={updateNodeMutation.isPending}
                  >
                    {updateNodeMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {updateNodeMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={cancelEdit}
                    disabled={updateNodeMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Public Link Dialog */}
          <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  Public Viewing Link Generated
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="public-link">Share this link to allow public viewing of your organizational structure:</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="public-link"
                      value={publicLink || ''}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="px-3"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Anyone with this link can view your organizational structure. 
                    The public view shows the chart layout with company branding.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={openPublicLink}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview Public View
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLinkDialog(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{statistics.total_employees}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Employees</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{statistics.departments_count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Departments</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.max_level + 1}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Org Levels</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {statistics.managers_count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Managers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {viewMode === 'chart' ? 'Organizational Chart' : 'Organizational Tree'}
          </CardTitle>
        </CardHeader>
        <CardContent className={viewMode === 'chart' ? 'p-0' : ''}>
          {viewMode === 'chart' ? (
            renderOrgChart()
          ) : (
            <div className="space-y-1">
              {hierarchy.map(node => renderTreeNode(node))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
