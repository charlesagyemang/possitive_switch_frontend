'use client';

import { useState, useEffect } from 'react';
import { PUI_TOKEN } from '@/api/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Share, 
  CheckCircle, 
  Clock, 
  User,
  Link,
  Eye,
  StopCircle
} from 'lucide-react';
// Note: This component is for demo purposes. In production, replace with actual API calls to your Rails backend.

interface SigningStatus {
  id: string;
  signing_status: string;
  public_signing_enabled: boolean;
  signing_url: string;
  signing_progress: number;
  required_signers: string[];
  remaining_signers: string[];
  signatures: Array<{
    id: string;
    signer_name: string;
    signer_email: string;
    signed_at: string;
  }>;
}

interface SigningManagementProps {
  contractId: string;
  contractName: string;
  candidateEmail: string;
  candidateId: string;
  contractData?: any;
}

export default function SigningManagement({ 
  contractId, 
  contractName, 
  candidateEmail,
  candidateId,
  contractData
}: SigningManagementProps) {
  const [signingStatus, setSigningStatus] = useState<SigningStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEnableDialog, setShowEnableDialog] = useState(false);
  const [additionalSigners, setAdditionalSigners] = useState<string>('');

  useEffect(() => {
    loadSigningStatus();
  }, [contractId]);

  const loadSigningStatus = async () => {
    try {
      setLoading(true);
      
      console.log('=== LOADING SIGNING STATUS ===');
      console.log('Contract ID:', contractId);
      console.log('Candidate ID:', candidateId);
      console.log('Contract Data:', contractData);
      
      // First, check if we have contract data with signing information
      if (contractData && (contractData.public_signing_enabled || contractData.signing_token)) {
        console.log('Using existing contract data for signing status');
        console.log('Contract data signatures:', contractData.signatures);
        console.log('Contract data required_signers:', contractData.required_signers);
        console.log('Contract data signing_progress:', contractData.signing_progress);
        
        // Calculate actual signing status based on signatures
        const signatures = contractData.signatures || [];
        const requiredSigners = contractData.required_signers || [candidateEmail];
        const progress = Math.round((signatures.length / requiredSigners.length) * 100);
        
        let calculatedStatus = 'open_for_signing';
        if (progress >= 100) {
          calculatedStatus = 'fully_signed';
        } else if (signatures.length > 0) {
          calculatedStatus = 'partially_signed';
        }
        
        console.log('Calculated status:', calculatedStatus, 'Progress:', progress, 'Signatures:', signatures.length, 'Required:', requiredSigners.length);
        
        setSigningStatus({
          id: contractId,
          signing_status: calculatedStatus,
          public_signing_enabled: contractData.public_signing_enabled || false,
          signing_url: contractData.signing_token ? `${window.location.origin}/contracts/${contractData.signing_token}/sign` : '',
          signing_progress: progress,
          required_signers: requiredSigners,
          remaining_signers: requiredSigners.filter((email: string) => 
            !signatures.some((sig: any) => sig.signer_email.toLowerCase() === email.toLowerCase())
          ),
          signatures: signatures
        });
        setLoading(false);
        return;
      }
      
      // If no contract data, make API call to Rails backend
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6070/api/v1';
      const url = `${apiBaseUrl}/candidates/${candidateId}/contracts/${contractId}/signing_status`;
      
      console.log('No contract data found, making API call to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(PUI_TOKEN) || ''}`
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const result = await response.json();
      console.log('Response data:', result);
      
      if (response.ok && result.success) {
        console.log('Success - setting signing status with data:', result.data);
        
        // Calculate actual signing status based on signatures
        const signatures = result.data.signatures || [];
        const requiredSigners = result.data.required_signers || [];
        const progress = Math.round((signatures.length / requiredSigners.length) * 100);
        
        let calculatedStatus = 'draft';
        if (result.data.public_signing_enabled) {
          if (progress >= 100) {
            calculatedStatus = 'fully_signed';
          } else if (signatures.length > 0) {
            calculatedStatus = 'partially_signed';
          } else {
            calculatedStatus = 'open_for_signing';
          }
        }
        
        console.log('API Calculated status:', calculatedStatus, 'Progress:', progress, 'Signatures:', signatures.length, 'Required:', requiredSigners.length);
        
        // Update state with real backend response
        setSigningStatus({
          id: contractId,
          signing_status: calculatedStatus,
          public_signing_enabled: result.data.public_signing_enabled || false,
          signing_url: result.data.signing_url || '',
          signing_progress: progress,
          required_signers: requiredSigners,
          remaining_signers: requiredSigners.filter((email: string) => 
            !signatures.some((sig: any) => sig.signer_email.toLowerCase() === email.toLowerCase())
          ),
          signatures: signatures
        });
      } else {
        console.log('API call failed or no success - falling back to default state');
        console.log('Response not ok or result.success is false');
        // Fallback to default state if no signing status found
        setSigningStatus({
          id: contractId,
          signing_status: 'draft',
          public_signing_enabled: false,
          signing_url: '',
          signing_progress: 0,
          required_signers: [],
          remaining_signers: [],
          signatures: []
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load signing status:', error);
      console.log('Error occurred - falling back to default state');
      // Fallback to default state on error
      setSigningStatus({
        id: contractId,
        signing_status: 'draft',
        public_signing_enabled: false,
        signing_url: '',
        signing_progress: 0,
        required_signers: [],
        remaining_signers: [],
        signatures: []
      });
      setLoading(false);
    }
  };

  const enableSigning = async () => {
    try {
      setLoading(true);
      
      // Parse additional signers
      const additionalEmails = additionalSigners
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);
      
      const requiredSigners = [candidateEmail, ...additionalEmails];
      
      // Real API call to Rails backend
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6070/api/v1';
      const response = await fetch(`${apiBaseUrl}/candidates/${candidateId}/contracts/${contractId}/enable_signing`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(PUI_TOKEN) || ''}`
        },
        body: JSON.stringify({
          required_signers: requiredSigners
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to enable signing');
      }
      
      // Update state with real backend response
      setSigningStatus({
        id: contractId,
        signing_status: result.data.signing_status,
        public_signing_enabled: true,
        signing_url: result.data.signing_url,
        signing_progress: 0,
        required_signers: result.data.required_signers,
        remaining_signers: result.data.required_signers,
        signatures: []
      });
      
      setShowEnableDialog(false);
      setAdditionalSigners('');
      setLoading(false);
      alert('✅ Public signing enabled successfully!');
      
    } catch (error) {
      console.error('Failed to enable signing:', error);
      alert(`Failed to enable signing: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const disableSigning = async () => {
    if (!confirm('Are you sure you want to disable signing for this contract?')) {
      return;
    }

    try {
      setLoading(true);
      
      // Real API call to Rails backend
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6070/api/v1';
      const response = await fetch(`${apiBaseUrl}/candidates/${candidateId}/contracts/${contractId}/disable_signing`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(PUI_TOKEN) || ''}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to disable signing');
      }
      
      // Update state with real backend response
      setSigningStatus(prev => prev ? {
        ...prev,
        signing_status: 'signing_disabled',
        public_signing_enabled: false
      } : null);
      
      setLoading(false);
      alert('✅ Signing disabled successfully!');
      
    } catch (error) {
      console.error('Failed to disable signing:', error);
      alert(`Failed to disable signing: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const copySigningUrl = async () => {
    if (signingStatus?.signing_url) {
      try {
        await navigator.clipboard.writeText(signingStatus.signing_url);
        alert('Signing URL copied to clipboard!');
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = signingStatus.signing_url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Signing URL copied to clipboard!');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fully_signed': return 'bg-green-100 text-green-800';
      case 'partially_signed': return 'bg-yellow-100 text-yellow-800';
      case 'open_for_signing': return 'bg-blue-100 text-blue-800';
      case 'signing_disabled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'fully_signed': return 'Fully Signed';
      case 'partially_signed': return 'Partially Signed';
      case 'open_for_signing': return 'Open for Signing';
      case 'signing_disabled': return 'Signing Disabled';
      default: return status?.replace('_', ' ') || 'Draft';
    }
  };

  if (loading && !signingStatus) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading signing status...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-h-[600px] overflow-y-auto">
      <CardHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Share className="h-5 w-5 mr-2" />
            Contract Signing
          </span>
          {signingStatus && (
            <Badge className={getStatusColor(signingStatus.signing_status)}>
              {getStatusText(signingStatus.signing_status)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {!signingStatus?.public_signing_enabled ? (
          // Signing not enabled
          <div className="text-center py-6">
            <Share className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Enable Public Signing
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Allow multiple parties to sign this contract via a shared link.
            </p>
            
            <Dialog open={showEnableDialog} onOpenChange={setShowEnableDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Share className="h-4 w-4 mr-2" />
                  Enable Signing
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enable Contract Signing</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      This will create a public signing link that can be shared with all parties who need to sign the contract.
                    </AlertDescription>
                  </Alert>
                  
                  <div>
                    <Label>Primary Signer (Required)</Label>
                    <Input value={candidateEmail} disabled className="bg-gray-50" />
                  </div>
                  
                  <div>
                    <Label htmlFor="additionalSigners">
                      Additional Signers (Optional)
                    </Label>
                    <Input
                      id="additionalSigners"
                      placeholder="hr@company.com, manager@company.com"
                      value={additionalSigners}
                      onChange={(e) => setAdditionalSigners(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate multiple email addresses with commas
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowEnableDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={enableSigning} disabled={loading}>
                      {loading ? 'Enabling...' : 'Enable Signing'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          // Signing enabled
          <div className="space-y-4">
            {/* Progress and Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4 mr-1" />
                  Progress: {signingStatus.signing_progress}%
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <User className="h-4 w-4 mr-1" />
                  {signingStatus.signatures.length}/{signingStatus.required_signers.length} signed
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${signingStatus.signing_progress}%` }}
              />
            </div>

            {/* Signing URL */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-white">Signing Link</Label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copySigningUrl}
                  >
                    <Link className="h-4 w-4 mr-1" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(signingStatus.signing_url, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
              <Input 
                value={signingStatus.signing_url} 
                readOnly 
                className="text-sm font-mono bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            {/* Signers Status */}
            <div>
              <Label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">Required Signers</Label>
              <div className="space-y-2">
                {signingStatus.required_signers.map((email, index) => {
                  const signature = signingStatus.signatures.find(sig => 
                    sig.signer_email.toLowerCase() === email.toLowerCase()
                  );
                  
                  console.log('=== SIGNATURE MATCHING DEBUG ===');
                  console.log('Required signer email:', email);
                  console.log('Available signatures:', signingStatus.signatures);
                  console.log('Found signature:', signature);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{email}</p>
                        {signature && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Signed as: {signature.signer_name} on{' '}
                            {new Date(signature.signed_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div>
                        {signature ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={disableSigning}
                disabled={loading}
                className="text-red-600 hover:text-red-700"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Disable Signing
              </Button>

              <Button onClick={loadSigningStatus} disabled={loading}>
                Refresh Status
              </Button>
            </div>

            {/* Success Message */}
            {signingStatus.signing_status === 'fully_signed' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All parties have signed this contract! Notifications have been sent to all signers.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
