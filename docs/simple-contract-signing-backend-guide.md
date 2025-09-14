# Simple Contract Signing - Backend Implementation Guide

## 🎯 Overview

Implement **public contract signing** functionality in your existing Rails API. This allows multiple parties (candidate + company representatives) to sign the same contract via a shared public link.

**Key Concept**: Extend existing `contracts` table with signing capabilities. No new complex tables or relationships needed.

---

## 🗄️ Database Migration

### **Single Migration - Add Signing to Contracts**
```ruby
# db/migrate/20241201000001_add_signing_to_contracts.rb
class AddSigningToContracts < ActiveRecord::Migration[7.1]
  def change
    add_column :contracts, :signing_token, :uuid, default: -> { "gen_random_uuid()" }
    add_column :contracts, :signatures, :jsonb, default: []
    add_column :contracts, :signing_status, :string, default: 'draft'
    add_column :contracts, :public_signing_enabled, :boolean, default: false
    add_column :contracts, :rendered_html, :text
    add_column :contracts, :required_signers, :jsonb, default: []
    
    add_index :contracts, :signing_token, unique: true
    add_index :contracts, :signing_status
    add_index :contracts, :public_signing_enabled
  end
end
```

**What this adds:**
- `signing_token`: Unique UUID for public access
- `signatures`: Array of signature objects (JSON)
- `signing_status`: Current signing state
- `public_signing_enabled`: Whether contract accepts signatures
- `rendered_html`: Final contract HTML with variables filled
- `required_signers`: Who needs to sign (emails)

---

## 🏗️ Model Updates

### **Extend Existing Contract Model**
```ruby
# app/models/contract.rb (extend existing model)
class Contract < ApplicationRecord
  belongs_to :candidate
  belongs_to :contract_template
  has_many :contract_logs, dependent: :destroy
  
  # Existing validations...
  validates :signing_token, presence: true, uniqueness: true
  
  # Signing status enum
  enum signing_status: {
    draft: 'draft',
    open_for_signing: 'open_for_signing',
    partially_signed: 'partially_signed', 
    fully_signed: 'fully_signed',
    signing_disabled: 'signing_disabled'
  }
  
  # Callbacks
  before_create :ensure_signing_token
  before_update :check_signing_completion, if: :saved_change_to_signatures?
  
  # Public signing URL
  def signing_url
    "#{Rails.application.credentials.frontend_url}/contracts/#{signing_token}/sign"
  end
  
  # Enable public signing
  def enable_public_signing!(signers: nil)
    # Default required signers: candidate + first company user
    default_signers = [
      candidate.email,
      candidate.company.users.first&.email
    ].compact
    
    # Render contract HTML with current data
    render_contract_html!
    
    update!(
      public_signing_enabled: true,
      signing_status: 'open_for_signing',
      required_signers: signers || default_signers
    )
    
    # Log the action
    contract_logs.create!(
      event_type: 'signing_enabled',
      payload: { 
        required_signers: required_signers,
        signing_url: signing_url 
      }
    )
  end
  
  # Disable public signing
  def disable_public_signing!
    update!(
      public_signing_enabled: false,
      signing_status: 'signing_disabled'
    )
    
    contract_logs.create!(
      event_type: 'signing_disabled',
      payload: { disabled_at: Time.current }
    )
  end
  
  # Add a signature
  def add_signature!(signer_name, signer_email, signature_data, request_info = {})
    # Validate signing is enabled
    raise 'Signing not enabled' unless public_signing_enabled?
    raise 'Contract already fully signed' if fully_signed?
    
    # Check if already signed
    if has_signed?(signer_email)
      raise "#{signer_email} has already signed this contract"
    end
    
    # Create signature object
    new_signature = {
      id: SecureRandom.uuid,
      signer_name: signer_name.strip,
      signer_email: signer_email.downcase.strip,
      signature_svg: signature_data[:signature_svg],
      signature_image: signature_data[:signature_image],
      signed_at: Time.current.iso8601,
      ip_address: request_info[:ip_address],
      user_agent: request_info[:user_agent]
    }
    
    # Add to signatures array
    updated_signatures = signatures + [new_signature]
    
    update!(signatures: updated_signatures)
    
    # Log the signature
    contract_logs.create!(
      event_type: 'signature_added',
      payload: {
        signer_name: signer_name,
        signer_email: signer_email,
        signature_id: new_signature[:id],
        total_signatures: updated_signatures.length,
        request_info: request_info
      }
    )
    
    new_signature
  end
  
  # Check if email has signed
  def has_signed?(email)
    signatures.any? { |sig| sig['signer_email'] == email.downcase.strip }
  end
  
  # Get remaining signers
  def remaining_signers
    signed_emails = signatures.map { |s| s['signer_email'] }
    required_signers.reject { |email| signed_emails.include?(email.downcase.strip) }
  end
  
  # Get signature by email
  def signature_by_email(email)
    signatures.find { |sig| sig['signer_email'] == email.downcase.strip }
  end
  
  # Render contract HTML with data
  def render_contract_html!
    return unless contract_template&.raw_html
    
    html = contract_template.raw_html.dup
    
    # Replace contract data variables
    data.each do |key, value|
      html.gsub!("{{#{key}}}", value.to_s)
    end
    
    # Replace standard variables
    html.gsub!("{{CANDIDATE_NAME}}", candidate.name || '')
    html.gsub!("{{CANDIDATE_EMAIL}}", candidate.email || '')
    html.gsub!("{{COMPANY_NAME}}", candidate.company.name || '')
    html.gsub!("{{CONTRACT_DATE}}", Date.current.strftime('%B %d, %Y'))
    html.gsub!("{{JOB_TITLE}}", candidate.job_title || '')
    html.gsub!("{{SALARY}}", candidate.salary || '')
    html.gsub!("{{REPORTING_DATE}}", candidate.reporting_date&.strftime('%B %d, %Y') || '')
    
    # Replace any additional candidate data
    candidate.other.each do |key, value|
      html.gsub!("{{#{key.upcase}}}", value.to_s)
    end
    
    update!(rendered_html: html)
  end
  
  # Check if contract is signable
  def signable?
    public_signing_enabled? && 
    (open_for_signing? || partially_signed?) &&
    rendered_html.present?
  end
  
  # Get signing progress
  def signing_progress
    return 0 if required_signers.empty?
    
    signed_count = signatures.length
    total_required = required_signers.length
    
    (signed_count.to_f / total_required * 100).round
  end
  
  private
  
  def ensure_signing_token
    self.signing_token ||= SecureRandom.uuid
  end
  
  def check_signing_completion
    return unless public_signing_enabled? && required_signers.present?
    
    signed_emails = signatures.map { |s| s['signer_email'] }
    remaining = required_signers.reject { |email| signed_emails.include?(email.downcase.strip) }
    
    new_status = if remaining.empty?
      'fully_signed'
    elsif signatures.any?
      'partially_signed'
    else
      'open_for_signing'
    end
    
    if new_status != signing_status
      self.signing_status = new_status
      
      # Send notifications if fully signed
      schedule_completion_notifications if new_status == 'fully_signed'
    end
  end
  
  def schedule_completion_notifications
    ContractSigningNotificationJob.perform_later(id)
  end
end
```

---

## 🛣️ Routes

### **Add to Existing Routes**
```ruby
# config/routes.rb (extend existing routes)
Rails.application.routes.draw do
  # ... existing routes ...
  
  namespace :api do
    namespace :v1 do
      # ... existing API routes ...
      
      # Authenticated contract management
      resources :contracts, only: [] do
        member do
          post :enable_signing      # Enable public signing
          delete :disable_signing   # Disable public signing
          get :signing_status       # Get signing status and signatures
          post :update_required_signers  # Update who needs to sign
        end
      end
      
      # Public contract signing (no authentication required)
      namespace :public do
        get 'contracts/:token', to: 'contract_signing#show'
        post 'contracts/:token/sign', to: 'contract_signing#sign'
        get 'contracts/:token/status', to: 'contract_signing#status'
      end
    end
  end
end
```

---

## 🎮 Controllers

### **1. Extend Existing Contracts Controller**
```ruby
# app/controllers/api/v1/contracts_controller.rb (add methods to existing controller)
class Api::V1::ContractsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_contract, only: [:enable_signing, :disable_signing, :signing_status, :update_required_signers]
  
  # ... existing methods ...
  
  # POST /api/v1/contracts/:id/enable_signing
  def enable_signing
    required_signers = params[:required_signers] || [
      @contract.candidate.email,
      current_user.email
    ]
    
    @contract.enable_public_signing!(signers: required_signers)
    
    render json: {
      success: true,
      message: 'Public signing enabled',
      data: {
        signing_url: @contract.signing_url,
        signing_token: @contract.signing_token,
        required_signers: @contract.required_signers,
        signing_status: @contract.signing_status
      }
    }
  rescue => e
    render json: {
      success: false,
      error: e.message
    }, status: :unprocessable_entity
  end
  
  # DELETE /api/v1/contracts/:id/disable_signing
  def disable_signing
    @contract.disable_public_signing!
    
    render json: {
      success: true,
      message: 'Public signing disabled',
      data: {
        signing_status: @contract.signing_status
      }
    }
  end
  
  # GET /api/v1/contracts/:id/signing_status
  def signing_status
    render json: {
      contract: {
        id: @contract.id,
        signing_status: @contract.signing_status,
        public_signing_enabled: @contract.public_signing_enabled,
        signing_url: @contract.signing_url,
        signing_progress: @contract.signing_progress,
        required_signers: @contract.required_signers,
        remaining_signers: @contract.remaining_signers,
        signatures: @contract.signatures.map do |sig|
          sig.except('signature_svg', 'signature_image') # Don't expose signature data in list
        end
      }
    }
  end
  
  # POST /api/v1/contracts/:id/update_required_signers
  def update_required_signers
    signers = params.require(:required_signers)
    
    @contract.update!(required_signers: signers)
    
    render json: {
      success: true,
      message: 'Required signers updated',
      data: {
        required_signers: @contract.required_signers,
        remaining_signers: @contract.remaining_signers
      }
    }
  end
  
  private
  
  def find_contract
    @contract = current_user.company.contracts
                           .joins(:candidate)
                           .find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Contract not found' }, status: :not_found
  end
end
```

### **2. New Public Contract Signing Controller**
```ruby
# app/controllers/api/v1/public/contract_signing_controller.rb (NEW)
class Api::V1::Public::ContractSigningController < ApplicationController
  skip_before_action :authenticate_user!  # No authentication required
  before_action :find_contract
  
  # GET /api/v1/public/contracts/:token
  def show
    unless @contract.signable?
      return render json: {
        error: 'Contract is not available for signing',
        details: {
          public_signing_enabled: @contract.public_signing_enabled?,
          signing_status: @contract.signing_status
        }
      }, status: :forbidden
    end
    
    render json: {
      contract: {
        id: @contract.id,
        name: @contract.contract_template.name,
        candidate: {
          name: @contract.candidate.name,
          email: @contract.candidate.email
        },
        company: {
          name: @contract.candidate.company.name
        },
        signing_status: @contract.signing_status,
        signing_progress: @contract.signing_progress,
        required_signers: @contract.required_signers,
        remaining_signers: @contract.remaining_signers,
        rendered_html: @contract.rendered_html,
        signatures: @contract.signatures.map do |sig|
          {
            id: sig['id'],
            signer_name: sig['signer_name'],
            signer_email: sig['signer_email'],
            signed_at: sig['signed_at']
          }
        end
      }
    }
  end
  
  # POST /api/v1/public/contracts/:token/sign
  def sign
    unless @contract.signable?
      return render json: {
        error: 'Contract is not available for signing'
      }, status: :forbidden
    end
    
    # Extract parameters
    signer_name = params.require(:signer_name).strip
    signer_email = params.require(:signer_email).strip.downcase
    signature_data = params.require(:signature_data).permit(:signature_svg, :signature_image)
    
    # Validate signature data
    if signature_data[:signature_svg].blank?
      return render json: {
        error: 'Signature is required'
      }, status: :unprocessable_entity
    end
    
    # Validate signer info
    if signer_name.blank? || signer_email.blank?
      return render json: {
        error: 'Signer name and email are required'
      }, status: :unprocessable_entity
    end
    
    # Add request info
    request_info = {
      ip_address: request.remote_ip,
      user_agent: request.user_agent,
      referrer: request.referrer
    }
    
    begin
      # Add signature
      signature = @contract.add_signature!(
        signer_name,
        signer_email,
        signature_data.to_h.symbolize_keys,
        request_info
      )
      
      render json: {
        success: true,
        message: 'Contract signed successfully',
        data: {
          signature: signature.except('signature_svg', 'signature_image'),
          contract_status: @contract.signing_status,
          signing_progress: @contract.signing_progress,
          fully_signed: @contract.fully_signed?,
          remaining_signers: @contract.remaining_signers
        }
      }
      
    rescue => e
      render json: {
        success: false,
        error: e.message
      }, status: :unprocessable_entity
    end
  end
  
  # GET /api/v1/public/contracts/:token/status
  def status
    render json: {
      signing_status: @contract.signing_status,
      public_signing_enabled: @contract.public_signing_enabled?,
      signing_progress: @contract.signing_progress,
      signatures_count: @contract.signatures.length,
      required_signers_count: @contract.required_signers.length,
      fully_signed: @contract.fully_signed?
    }
  end
  
  private
  
  def find_contract
    @contract = Contract.find_by!(signing_token: params[:token])
  rescue ActiveRecord::RecordNotFound
    render json: {
      error: 'Invalid signing link'
    }, status: :not_found
  end
end
```

---

## 📧 Background Jobs & Notifications

### **Notification Job**
```ruby
# app/jobs/contract_signing_notification_job.rb (NEW)
class ContractSigningNotificationJob < ApplicationJob
  queue_as :default
  
  def perform(contract_id)
    contract = Contract.find(contract_id)
    
    return unless contract.fully_signed?
    
    # Send email to candidate
    ContractSigningMailer.fully_signed_notification(
      contract, 
      contract.candidate.email,
      'candidate'
    ).deliver_now
    
    # Send email to company users
    contract.candidate.company.users.each do |user|
      ContractSigningMailer.fully_signed_notification(
        contract,
        user.email,
        'company'
      ).deliver_now
    end
    
    # Log completion
    contract.contract_logs.create!(
      event_type: 'signing_completed',
      payload: {
        completed_at: Time.current,
        total_signatures: contract.signatures.length,
        signers: contract.signatures.map { |s| s['signer_email'] }
      }
    )
  end
end
```

### **Mailer**
```ruby
# app/mailers/contract_signing_mailer.rb (NEW)
class ContractSigningMailer < ApplicationMailer
  def fully_signed_notification(contract, recipient_email, recipient_type)
    @contract = contract
    @candidate = contract.candidate
    @company = contract.candidate.company
    @recipient_type = recipient_type
    @signatures = contract.signatures
    
    subject = case recipient_type
    when 'candidate'
      "✅ Your contract has been fully signed - #{@contract.contract_template.name}"
    when 'company'
      "✅ Contract fully signed by #{@candidate.name} - #{@contract.contract_template.name}"
    else
      "✅ Contract fully signed - #{@contract.contract_template.name}"
    end
    
    mail(
      to: recipient_email,
      subject: subject,
      from: @company.email || 'noreply@yourapp.com'
    )
  end
  
  def signature_added_notification(contract, new_signature, recipient_email)
    @contract = contract
    @candidate = contract.candidate
    @company = contract.candidate.company
    @new_signature = new_signature
    @remaining_count = contract.remaining_signers.length
    
    mail(
      to: recipient_email,
      subject: "📝 Contract signed by #{new_signature['signer_name']} - #{@contract.contract_template.name}",
      from: @company.email || 'noreply@yourapp.com'
    )
  end
end
```

---

## 🧪 API Testing Examples

### **Enable Public Signing**
```bash
curl -X POST "http://localhost:3000/api/v1/contracts/CONTRACT_ID/enable_signing" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "required_signers": [
      "candidate@example.com",
      "hr@company.com"
    ]
  }'

# Response:
{
  "success": true,
  "message": "Public signing enabled",
  "data": {
    "signing_url": "https://yourapp.com/contracts/abc-123-def/sign",
    "signing_token": "abc-123-def-456",
    "required_signers": ["candidate@example.com", "hr@company.com"],
    "signing_status": "open_for_signing"
  }
}
```

### **Get Contract for Signing (Public)**
```bash
curl -X GET "http://localhost:3000/api/v1/public/contracts/abc-123-def"

# Response:
{
  "contract": {
    "id": "contract-uuid",
    "name": "Employment Agreement",
    "candidate": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "company": {
      "name": "ACME Corp"
    },
    "signing_status": "open_for_signing",
    "signing_progress": 0,
    "required_signers": ["john@example.com", "hr@acme.com"],
    "remaining_signers": ["john@example.com", "hr@acme.com"],
    "rendered_html": "<h1>Employment Contract</h1><p>Employee: John Doe</p>...",
    "signatures": []
  }
}
```

### **Sign Contract (Public)**
```bash
curl -X POST "http://localhost:3000/api/v1/public/contracts/abc-123-def/sign" \
  -H "Content-Type: application/json" \
  -d '{
    "signer_name": "John Doe",
    "signer_email": "john@example.com",
    "signature_data": {
      "signature_svg": "<svg>...</svg>",
      "signature_image": "data:image/png;base64,..."
    }
  }'

# Response:
{
  "success": true,
  "message": "Contract signed successfully",
  "data": {
    "signature": {
      "id": "signature-uuid",
      "signer_name": "John Doe",
      "signer_email": "john@example.com",
      "signed_at": "2024-01-15T10:30:00Z"
    },
    "contract_status": "partially_signed",
    "signing_progress": 50,
    "fully_signed": false,
    "remaining_signers": ["hr@acme.com"]
  }
}
```

### **Get Signing Status**
```bash
curl -X GET "http://localhost:3000/api/v1/contracts/CONTRACT_ID/signing_status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response:
{
  "contract": {
    "id": "contract-uuid",
    "signing_status": "partially_signed",
    "public_signing_enabled": true,
    "signing_url": "https://yourapp.com/contracts/abc-123-def/sign",
    "signing_progress": 50,
    "required_signers": ["john@example.com", "hr@acme.com"],
    "remaining_signers": ["hr@acme.com"],
    "signatures": [
      {
        "id": "signature-uuid",
        "signer_name": "John Doe",
        "signer_email": "john@example.com",
        "signed_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

## 🔧 Configuration

### **Environment Variables**
```bash
# Add to your .env or credentials
FRONTEND_URL=https://yourapp.com  # Your Next.js app URL
```

### **Credentials Setup**
```yaml
# config/credentials.yml.enc
production:
  frontend_url: https://yourapp.com

development:
  frontend_url: http://localhost:3000
```

---

## 📋 Implementation Checklist

### **Phase 1: Database & Models (Day 1)**
- [ ] Run the migration to add signing fields
- [ ] Update the Contract model with signing methods
- [ ] Test in Rails console that signing works
- [ ] Verify existing functionality still works

### **Phase 2: API Endpoints (Day 2)**
- [ ] Add methods to existing ContractsController
- [ ] Create new Public::ContractSigningController
- [ ] Add routes for public signing
- [ ] Test all endpoints with curl

### **Phase 3: Background Jobs & Emails (Day 3)**
- [ ] Create ContractSigningNotificationJob
- [ ] Create ContractSigningMailer with templates
- [ ] Test email notifications work
- [ ] Test job processing

### **Phase 4: Testing & Documentation (Day 4)**
- [ ] Write unit tests for Contract model methods
- [ ] Write controller tests
- [ ] Test complete signing flow
- [ ] Update API documentation

---

## ⚡ Key Features Delivered

✅ **Multi-party signing** - Multiple people can sign same contract  
✅ **Public access** - No authentication required for signing  
✅ **Progress tracking** - See who has signed and who's remaining  
✅ **Automatic completion** - Notifications when fully signed  
✅ **Signature storage** - SVG and image formats stored  
✅ **Audit trail** - All actions logged in contract_logs  
✅ **Flexible signers** - Configure who needs to sign  
✅ **Real-time status** - Check signing progress anytime  

This implementation provides a **complete contract signing solution** that integrates seamlessly with your existing Rails application!
