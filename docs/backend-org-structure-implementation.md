# Organizational Structure Backend Implementation Guide

## Overview
This document provides the complete backend implementation for the Organizational Structure feature for your Rails API.

## 1. Database Models & Associations

### Primary Model: `OrganizationNode`

```ruby
# app/models/organization_node.rb
class OrganizationNode < ApplicationRecord
  belongs_to :company
  belongs_to :parent, class_name: 'OrganizationNode', optional: true
  has_many :children, class_name: 'OrganizationNode', foreign_key: 'parent_id', dependent: :destroy
  belongs_to :user, optional: true # If you want to link to actual User records
  
  validates :name, presence: true
  validates :title, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :department, presence: true
  validates :company_id, presence: true
  
  # Prevent circular references
  validate :cannot_be_parent_of_self
  validate :cannot_create_circular_reference
  
  before_save :calculate_level
  after_create :update_children_levels
  after_update :update_children_levels, if: :saved_change_to_parent_id?
  
  scope :roots, -> { where(parent_id: nil) }
  scope :by_department, ->(dept) { where(department: dept) }
  scope :by_level, ->(level) { where(level: level) }
  
  enum department: {
    executive: 0,
    technology: 1,
    hr: 2,
    marketing: 3,
    sales: 4,
    finance: 5
  }
  
  def ancestors
    return [] if parent.nil?
    [parent] + parent.ancestors
  end
  
  def descendants
    children.flat_map { |child| [child] + child.descendants }
  end
  
  def siblings
    return OrganizationNode.none if parent.nil?
    parent.children.where.not(id: id)
  end
  
  def hierarchy_tree
    {
      id: id,
      name: name,
      title: title,
      email: email,
      department: department,
      level: level,
      parent_id: parent_id,
      children: children.map(&:hierarchy_tree)
    }
  end
  
  private
  
  def calculate_level
    self.level = parent ? parent.level + 1 : 0
  end
  
  def update_children_levels
    children.each do |child|
      child.update_column(:level, level + 1)
      child.send(:update_children_levels)
    end
  end
  
  def cannot_be_parent_of_self
    errors.add(:parent_id, "cannot be the same as id") if parent_id == id
  end
  
  def cannot_create_circular_reference
    return unless parent_id
    
    current = OrganizationNode.find_by(id: parent_id)
    while current
      if current.id == id
        errors.add(:parent_id, "would create a circular reference")
        break
      end
      current = current.parent
    end
  end
end
```

## 2. Database Migration

```ruby
# db/migrate/xxx_create_organization_nodes.rb
class CreateOrganizationNodes < ActiveRecord::Migration[7.0]
  def change
    create_table :organization_nodes, id: :uuid do |t|
      t.references :company, null: false, foreign_key: true, type: :uuid
      t.references :parent, null: true, foreign_key: { to_table: :organization_nodes }, type: :uuid
      t.references :user, null: true, foreign_key: true, type: :uuid
      
      t.string :name, null: false
      t.string :title, null: false
      t.string :email, null: false
      t.integer :department, null: false, default: 0
      t.integer :level, null: false, default: 0
      t.boolean :active, default: true
      
      t.timestamps
    end
    
    add_index :organization_nodes, [:company_id, :parent_id]
    add_index :organization_nodes, [:company_id, :department]
    add_index :organization_nodes, [:company_id, :level]
    add_index :organization_nodes, :email
  end
end
```

## 3. API Controller

```ruby
# app/controllers/api/v1/organization_nodes_controller.rb
class Api::V1::OrganizationNodesController < ApplicationController
  before_action :authenticate_company!
  before_action :set_organization_node, only: [:show, :update, :destroy]
  
  # GET /api/v1/organization_nodes
  def index
    @nodes = current_company.organization_nodes.includes(:parent, :children)
    
    case params[:format_type]
    when 'hierarchy'
      render json: {
        success: true,
        data: {
          hierarchy: build_hierarchy(@nodes.roots),
          statistics: calculate_statistics(@nodes)
        }
      }
    when 'flat'
      render json: {
        success: true,
        data: {
          nodes: @nodes.map(&method(:node_json)),
          statistics: calculate_statistics(@nodes)
        }
      }
    else
      render json: {
        success: true,
        data: {
          nodes: @nodes.map(&method(:node_json)),
          hierarchy: build_hierarchy(@nodes.roots),
          statistics: calculate_statistics(@nodes)
        }
      }
    end
  end
  
  # GET /api/v1/organization_nodes/:id
  def show
    render json: {
      success: true,
      data: {
        node: detailed_node_json(@organization_node)
      }
    }
  end
  
  # POST /api/v1/organization_nodes
  def create
    @organization_node = current_company.organization_nodes.build(node_params)
    
    if @organization_node.save
      render json: {
        success: true,
        message: "Organization node created successfully",
        data: {
          node: node_json(@organization_node)
        }
      }, status: :created
    else
      render json: {
        success: false,
        message: "Failed to create organization node",
        errors: @organization_node.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  # PATCH/PUT /api/v1/organization_nodes/:id
  def update
    if @organization_node.update(node_params)
      render json: {
        success: true,
        message: "Organization node updated successfully",
        data: {
          node: node_json(@organization_node)
        }
      }
    else
      render json: {
        success: false,
        message: "Failed to update organization node",
        errors: @organization_node.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/v1/organization_nodes/:id
  def destroy
    descendants_count = @organization_node.descendants.count
    
    if @organization_node.destroy
      render json: {
        success: true,
        message: "Organization node and #{descendants_count} descendants deleted successfully",
        data: {
          deleted_count: descendants_count + 1
        }
      }
    else
      render json: {
        success: false,
        message: "Failed to delete organization node",
        errors: @organization_node.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  # GET /api/v1/organization_nodes/statistics
  def statistics
    @nodes = current_company.organization_nodes
    
    render json: {
      success: true,
      data: calculate_statistics(@nodes)
    }
  end
  
  # GET /api/v1/organization_nodes/departments
  def departments
    departments_data = OrganizationNode.departments.map do |key, value|
      {
        id: key,
        name: key.humanize,
        count: current_company.organization_nodes.where(department: value).count
      }
    end
    
    render json: {
      success: true,
      data: {
        departments: departments_data
      }
    }
  end
  
  private
  
  def set_organization_node
    @organization_node = current_company.organization_nodes.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: {
      success: false,
      message: "Organization node not found"
    }, status: :not_found
  end
  
  def node_params
    params.require(:organization_node).permit(:name, :title, :email, :department, :parent_id, :user_id)
  end
  
  def node_json(node)
    {
      id: node.id,
      name: node.name,
      title: node.title,
      email: node.email,
      department: node.department,
      level: node.level,
      parent_id: node.parent_id,
      created_at: node.created_at,
      updated_at: node.updated_at
    }
  end
  
  def detailed_node_json(node)
    node_json(node).merge({
      parent: node.parent ? node_json(node.parent) : nil,
      children: node.children.map(&method(:node_json)),
      siblings: node.siblings.map(&method(:node_json)),
      ancestors: node.ancestors.map(&method(:node_json)),
      descendants_count: node.descendants.count
    })
  end
  
  def build_hierarchy(roots)
    roots.map do |root|
      {
        id: root.id,
        name: root.name,
        title: root.title,
        email: root.email,
        department: root.department,
        level: root.level,
        parent_id: root.parent_id,
        children: build_hierarchy(root.children),
        isExpanded: true
      }
    end
  end
  
  def calculate_statistics(nodes)
    {
      total_employees: nodes.count,
      departments_count: nodes.distinct.count(:department),
      max_level: nodes.maximum(:level) || 0,
      managers_count: nodes.where('level = ?', 1).count,
      by_department: OrganizationNode.departments.map { |dept, _|
        [dept, nodes.where(department: dept).count]
      }.to_h,
      by_level: (0..(nodes.maximum(:level) || 0)).map { |level|
        [level, nodes.where(level: level).count]
      }.to_h
    }
  end
end
```

## 4. Routes Configuration

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :organization_nodes do
        collection do
          get :statistics
          get :departments
        end
      end
    end
  end
end
```

## 5. Company Model Updates

```ruby
# Add to existing app/models/company.rb
class Company < ApplicationRecord
  # ... existing associations ...
  
  has_many :organization_nodes, dependent: :destroy
  
  def org_chart_roots
    organization_nodes.roots.includes(:children)
  end
  
  def org_chart_hierarchy
    org_chart_roots.map(&:hierarchy_tree)
  end
end
```

## 6. API Endpoints Summary

### Base URL: `/api/v1/organization_nodes`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Get all nodes (flat + hierarchy) | Company JWT |
| `GET` | `/?format_type=hierarchy` | Get hierarchical format only | Company JWT |
| `GET` | `/?format_type=flat` | Get flat format only | Company JWT |
| `GET` | `/:id` | Get single node with details | Company JWT |
| `POST` | `/` | Create new node | Company JWT |
| `PUT/PATCH` | `/:id` | Update existing node | Company JWT |
| `DELETE` | `/:id` | Delete node (cascade) | Company JWT |
| `GET` | `/statistics` | Get org statistics | Company JWT |
| `GET` | `/departments` | Get departments list | Company JWT |

## 7. Request/Response Examples

### Create Node (POST)
```json
{
  "organization_node": {
    "name": "John Doe",
    "title": "Software Engineer",
    "email": "john.doe@company.com",
    "department": "technology",
    "parent_id": "uuid-of-parent"
  }
}
```

### Response
```json
{
  "success": true,
  "message": "Organization node created successfully",
  "data": {
    "node": {
      "id": "uuid",
      "name": "John Doe",
      "title": "Software Engineer",
      "email": "john.doe@company.com",
      "department": "technology",
      "level": 2,
      "parent_id": "uuid-of-parent",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  }
}
```

### Get Hierarchy (GET /)
```json
{
  "success": true,
  "data": {
    "nodes": [...],
    "hierarchy": [
      {
        "id": "uuid",
        "name": "Sarah Johnson",
        "title": "CEO",
        "email": "sarah@company.com",
        "department": "executive",
        "level": 0,
        "parent_id": null,
        "children": [
          {
            "id": "uuid2",
            "name": "Michael Chen",
            "title": "CTO",
            "email": "michael@company.com",
            "department": "technology",
            "level": 1,
            "parent_id": "uuid",
            "children": []
          }
        ],
        "isExpanded": true
      }
    ],
    "statistics": {
      "total_employees": 5,
      "departments_count": 3,
      "max_level": 2,
      "managers_count": 2,
      "by_department": {
        "executive": 1,
        "technology": 2,
        "hr": 2
      },
      "by_level": {
        "0": 1,
        "1": 2,
        "2": 2
      }
    }
  }
}
```

## 8. Validation Rules

1. **Name, Title, Email**: Required
2. **Email**: Must be valid format
3. **Department**: Must be from enum list
4. **Parent**: Cannot be self
5. **Circular Reference**: Prevented by validation
6. **Company**: Must belong to authenticated company

## 9. Database Indexes

- `company_id + parent_id` (for hierarchy queries)
- `company_id + department` (for department filtering)
- `company_id + level` (for level-based queries)
- `email` (for email lookups)

## 10. Security Considerations

1. **Authentication**: All endpoints require company JWT
2. **Authorization**: Users can only access their company's nodes
3. **Input Validation**: Strong params and model validations
4. **SQL Injection**: Prevented by ActiveRecord
5. **Mass Assignment**: Protected by strong params

## 11. Performance Optimizations

1. **Eager Loading**: Include associations in queries
2. **Database Indexes**: On commonly queried fields
3. **Caching**: Consider caching hierarchy for large organizations
4. **Pagination**: For companies with many employees

This implementation provides a robust, scalable organizational structure system that matches your frontend functionality perfectly!
