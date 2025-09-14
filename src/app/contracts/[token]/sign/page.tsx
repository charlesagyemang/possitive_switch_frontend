'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, Clock, User } from 'lucide-react';
import LoadingSpinner from '@/components/built/loaders/loading-state';
import SignaturePad from '@/components/contract-signing/SignaturePad';

interface Signature {
  id: string;
  signer_name: string;
  signer_email: string;
  signed_at: string;
}

interface Contract {
  id: string;
  name: string;
  candidate: {
    name: string;
    email: string;
  };
  company: {
    name: string;
  };
  signing_status: string;
  signing_progress: number;
  required_signers: string[];
  remaining_signers: string[];
  rendered_html: string;
  signatures: Signature[];
}

export default function PublicContractSigningPage() {
  const { token } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signing, setSigning] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);

  useEffect(() => {
    loadContract();
  }, [token]);

  const loadContract = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if this is a test token (contract or template)
      if (typeof token === 'string' && (token.startsWith('test-') || token.startsWith('test-template-'))) {
        // Load mock data for testing
        setTimeout(() => {
          const isTemplateTest = token.includes('test-template-');
          const isContractTest = token.startsWith('test-') && !isTemplateTest;
          
          // Check if we have stored contract data for this test token
          if (isContractTest) {
            try {
              const contractDataString = localStorage.getItem(`contract-${token}`);
              if (contractDataString) {
                const contractData = JSON.parse(contractDataString);
                console.log('Retrieved contract data:', contractData);
                
                // Render the contract HTML with filled-in variables
                if (contractData.rendered_html && contractData.contract_data) {
                  let renderedHtml = contractData.rendered_html;
                  
                  // Replace template variables with actual data
                  Object.entries(contractData.contract_data).forEach(([key, value]) => {
                    const placeholder = `{{${key}}}`;
                    renderedHtml = renderedHtml.replace(new RegExp(placeholder, 'g'), String(value));
                  });
                  
                  contractData.rendered_html = renderedHtml;
                }
                
                setContract(contractData);
                setLoading(false);
                
                // Clean up localStorage after use
                localStorage.removeItem(`contract-${token}`);
                return;
              }
            } catch (error) {
              console.error('Failed to load contract data:', error);
            }
          }
          
          let contractName = 'Employment Agreement - Test Mode';
          let renderedHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333; text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 10px;">Employment Agreement</h1>
              
              <p style="margin: 20px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              
              <p style="margin: 20px 0;">This Employment Agreement (the "Agreement") is entered into between:</p>
              
              <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #007bff;">
                <p><strong>Company:</strong> Acme Corporation<br>
                <strong>Address:</strong> 123 Business Street, City, State 12345</p>
              </div>
              
              <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #007bff;">
                <p><strong>Employee:</strong> John Doe<br>
                <strong>Email:</strong> john.doe@example.com<br>
                <strong>Position:</strong> Software Engineer</p>
              </div>
              
              <h2 style="color: #333; margin-top: 30px;">Terms and Conditions</h2>
              
              <h3 style="color: #555;">1. Position and Duties</h3>
              <p>The Employee agrees to serve as Software Engineer and perform duties as assigned by the Company.</p>
              
              <h3 style="color: #555;">2. Compensation</h3>
              <p>The Company agrees to pay the Employee a salary of $75,000 per year, payable in accordance with the Company's standard payroll practices.</p>
              
              <h3 style="color: #555;">3. Benefits</h3>
              <p>Employee will be eligible for health insurance, dental insurance, and 15 days of paid vacation per year.</p>
              
              <h3 style="color: #555;">4. Start Date</h3>
              <p>Employment will commence on the start date agreed upon by both parties.</p>
              
              <h3 style="color: #555;">5. Confidentiality</h3>
              <p>Employee agrees to maintain the confidentiality of all Company proprietary information and trade secrets.</p>
              
              <div style="margin: 40px 0; padding: 20px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px;">
                <p style="margin: 0; color: #856404;"><strong>Note:</strong> This is a test contract for demonstration purposes. Signatures collected here are for testing only.</p>
              </div>
              
              <p style="margin: 30px 0; font-style: italic;">By signing below, both parties agree to the terms and conditions set forth in this Agreement.</p>
            </div>
          `;
          
          // If this is a template test, try to get the actual template data
          if (isTemplateTest) {
            try {
              const templateDataString = localStorage.getItem(`template-${token}`);
              if (templateDataString) {
                const templateData = JSON.parse(templateDataString);
                console.log('Retrieved template data:', templateData);
                
                contractName = `${templateData.name} - Test Mode`;
                
                // Use the actual template HTML content - keep document white, darken interface
                if (templateData.raw_html && templateData.raw_html.trim()) {
                  renderedHtml = `
                    <div class="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[400px] overflow-hidden">
                      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 -mx-6 -mt-6 mb-6">
                        <h3 class="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 m-0">
                          📄 ${templateData.name || "Contract Template"}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-0">
                          Contract Preview - Scroll to see full contract
                        </p>
                      </div>
                      <div class="bg-gray-100 dark:bg-gray-900 p-6 max-h-[600px] overflow-auto -mx-6 -mb-6">
                        <div class="bg-white rounded-lg shadow-lg mx-auto max-w-4xl">
                          <div class="p-12 text-gray-900 leading-relaxed contract-content" style="font-family: 'Times New Roman', Times, serif; font-size: 14px; line-height: 1.6; min-height: 11in; background-color: white; color: #111827;">
                            <div class="contract-html-content" style="background-color: white; color: #111827;">
                              ${templateData.raw_html}
                            </div>
                            
                            <div class="mt-10 p-5 bg-yellow-50 border border-yellow-200 rounded" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; background-color: #fef3c7; color: #92400e;">
                              <p class="m-0" style="color: #92400e;"><strong>Note:</strong> This is a test of the contract template "${templateData.name}". Signatures collected here are for testing only.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  `;
                } else if (templateData.description) {
                  // Fallback to description if no raw_html - keep document white
                  renderedHtml = `
                    <div class="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[400px] overflow-hidden">
                      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 -mx-6 -mt-6 mb-6">
                        <h3 class="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 m-0">
                          📄 ${templateData.name || "Contract Template"}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-0">
                          Contract Preview - Content from description field
                        </p>
                      </div>
                      <div class="bg-gray-100 dark:bg-gray-900 p-6 max-h-[600px] overflow-auto -mx-6 -mb-6">
                        <div class="bg-white rounded-lg shadow-lg mx-auto max-w-4xl">
                          <div class="p-12 text-gray-900 leading-relaxed contract-content" style="font-family: 'Times New Roman', Times, serif; font-size: 14px; line-height: 1.6; min-height: 11in; background-color: white; color: #111827;">
                            <h1 style="color: #333; text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 10px; font-family: 'Times New Roman', Times, serif;">${templateData.name}</h1>
                            
                            <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
                              ${templateData.description.replace(/\n/g, '<br>')}
                            </div>
                            
                            <div style="margin: 40px 0; padding: 20px; background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #92400e;">
                              <p style="margin: 0; color: #92400e;"><strong>Note:</strong> This is a test of the contract template "${templateData.name}". The template may need more content in the raw_html field for full display. Signatures collected here are for testing only.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  `;
                }
                
                // Clean up localStorage after use
                localStorage.removeItem(`template-${token}`);
              }
            } catch (error) {
              console.error('Failed to load template data:', error);
            }
          }
            
          setContract({
            id: 'test-contract-123',
            name: contractName,
            candidate: {
              name: 'John Doe',
              email: 'john.doe@example.com'
            },
            company: {
              name: 'Acme Corporation'
            },
            signing_status: 'open_for_signing',
            signing_progress: 0,
            required_signers: ['john.doe@example.com', 'hr@acme.com'],
            remaining_signers: ['john.doe@example.com', 'hr@acme.com'],
            rendered_html: renderedHtml,
            signatures: []
          });
          setLoading(false);
        }, 500); // Simulate loading time
        return;
      }
      
      // Real API call for production
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6070/api/v1';
      const fullUrl = `${apiBaseUrl}/public/contracts/${token}`;
      
      console.log('=== CONTRACT SIGNING API CALL ===');
      console.log('API Base URL:', apiBaseUrl);
      console.log('Full URL:', fullUrl);
      console.log('Token:', token);
      
      const response = await fetch(fullUrl);
      const data = await response.json();
      
      console.log('=== API RESPONSE ===');
      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('Full Response Data:', data);
      console.log('Response Type:', typeof data);
      console.log('Response Keys:', data ? Object.keys(data) : 'No data');
      
      if (data && data.data) {
        console.log('=== CONTRACT DATA ===');
        console.log('Contract Data:', data.data);
        console.log('Contract Keys:', Object.keys(data.data));
        
        if (data.data.contract) {
          console.log('=== CONTRACT OBJECT ===');
          console.log('Contract Object:', data.data.contract);
          console.log('Contract Keys:', Object.keys(data.data.contract));
          
          // Log each contract property
          Object.keys(data.data.contract).forEach(key => {
            console.log(`  ${key}:`, data.data.contract[key], typeof data.data.contract[key]);
          });
        }
      }
      
      console.log('=== END API RESPONSE ===');
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load contract');
      }
      
      // The contract data is nested under data.contract
      setContract(data.data.contract);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (signatureData: { signature_svg: string; signature_image: string }) => {
    if (!signerName.trim() || !signerEmail.trim()) {
      alert('Please enter your name and email address');
      return;
    }

    try {
      setSigning(true);
      
      // Handle test mode (both contract and template tests)
      if (typeof token === 'string' && (token.startsWith('test-') || token.startsWith('test-template-'))) {
        // Simulate signing process
        setTimeout(() => {
          const newSignature = {
            id: `sig-${Date.now()}`,
            signer_name: signerName.trim(),
            signer_email: signerEmail.trim(),
            signed_at: new Date().toISOString()
          };
          
          if (contract) {
            const updatedSignatures = [...contract.signatures, newSignature];
            const progress = Math.round((updatedSignatures.length / contract.required_signers.length) * 100);
            const remaining = contract.required_signers.filter(email => 
              !updatedSignatures.some(sig => sig.signer_email === email)
            );
            
            setContract({
              ...contract,
              signatures: updatedSignatures,
              signing_progress: progress,
              remaining_signers: remaining,
              signing_status: remaining.length === 0 ? 'fully_signed' : 'partially_signed'
            });
          }
          
          setSignSuccess(true);
          setSignerName('');
          setSignerEmail('');
          setSigning(false);
          setIsSigningModalOpen(false);
          
          alert('Test signature added successfully! This was a demo - no real contract was signed.');
        }, 1000); // Simulate API delay
        return;
      }
      
      // Real API call for production
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6070/api/v1';
      const response = await fetch(`${apiBaseUrl}/public/contracts/${token}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signer_name: signerName.trim(),
          signer_email: signerEmail.trim(),
          signature_data: signatureData
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign contract');
      }
      
      // Reload contract to show new signature
      await loadContract();
      setSignSuccess(true);
      setSignerName('');
      setSignerEmail('');
      setIsSigningModalOpen(false);
      
      // Show success message with contract status
      if (result.data.fully_signed) {
        alert('🎉 Contract fully signed! All parties have completed their signatures.');
      } else {
        alert(`✅ Signature added successfully! ${result.data.remaining_signers?.length || 0} more signature(s) needed.`);
      }
      
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to sign contract');
    } finally {
      setSigning(false);
    }
  };

  const getStatusColor = (status: string, progress: number) => {
    // Override color if progress is 100%
    if (progress >= 100) {
      return 'bg-green-100 text-green-800';
    }
    
    switch (status) {
      case 'fully_signed': return 'bg-green-100 text-green-800';
      case 'partially_signed': return 'bg-yellow-100 text-yellow-800';
      case 'open_for_signing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string, progress: number) => {
    // Override status if progress is 100%
    if (progress >= 100) {
      return 'Fully Signed';
    }
    
    switch (status) {
      case 'fully_signed': return 'Fully Signed';
      case 'partially_signed': return 'Partially Signed';
      case 'open_for_signing': return 'Open for Signing';
      default: return status.replace('_', ' ');
    }
  };

  const hasUserSigned = contract?.signatures.some(sig => 
    sig.signer_email.toLowerCase() === signerEmail.toLowerCase()
  );

  // Debug logging for email matching
  console.log('=== EMAIL MATCHING DEBUG ===');
  console.log('Required signers:', contract?.required_signers);
  console.log('Signatures:', contract?.signatures);
  console.log('Signing progress:', contract?.signing_progress);
  console.log('Signing status:', contract?.signing_status);
  
  if (contract?.signatures) {
    contract.signatures.forEach((sig, index) => {
      console.log(`Signature ${index}:`, {
        email: sig.signer_email,
        name: sig.signer_name,
        signed_at: sig.signed_at
      });
    });
  }
  
  if (contract?.required_signers) {
    contract.required_signers.forEach((email, index) => {
      const hasSignature = contract.signatures?.some(sig => 
        sig.signer_email.toLowerCase() === email.toLowerCase()
      );
      console.log(`Required signer ${index}: ${email} - Has signature: ${hasSignature}`);
    });
  }
  console.log('=== END EMAIL MATCHING DEBUG ===');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Unable to Load Contract</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadContract} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Contract Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              The signing link you followed is invalid or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {/* Test Mode Banner */}
          {typeof token === 'string' && (token.startsWith('test-') || token.startsWith('test-template-')) && (
            <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-lg">
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 mr-3">
                  TEST MODE
                </span>
                <span className="text-sm text-orange-700 dark:text-orange-300">
                  This is a demonstration of the contract signing interface. No real signatures will be stored.
                </span>
              </div>
            </div>
          )}
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {contract.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {contract.company.name} ↔ {contract.candidate.name}
              </p>
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(contract.signing_status, contract.signing_progress)}>
                  {getStatusText(contract.signing_status, contract.signing_progress)}
                </Badge>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  Progress: {contract.signing_progress}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contract Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: contract.rendered_html }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Signatures Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <User className="h-5 w-5 mr-2" />
                  Signatures ({contract.signatures.length}/{contract.required_signers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contract.required_signers.map((email, index) => {
                    const signature = contract.signatures.find(sig => 
                      sig.signer_email.toLowerCase() === email.toLowerCase()
                    );
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{email}</p>
                          {signature && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Signed as: {signature.signer_name}
                            </p>
                          )}
                        </div>
                        <div>
                          {signature ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {contract.signatures.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">Signing History</h4>
                    <div className="space-y-2">
                      {contract.signatures.map((sig, index) => (
                        <div key={sig.id} className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{sig.signer_name}</span> signed on{' '}
                          {new Date(sig.signed_at).toLocaleDateString()} at{' '}
                          {new Date(sig.signed_at).toLocaleTimeString()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Signing Form */}
            {contract.signing_status !== 'fully_signed' && contract.signing_progress < 100 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Sign this Contract</CardTitle>
                </CardHeader>
                <CardContent>
                  {signSuccess && (
                    <Alert className="mb-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Contract signed successfully! 
                        {contract.remaining_signers.length > 0 && 
                          ` Waiting for ${contract.remaining_signers.length} more signature(s).`
                        }
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signerName" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                      <Input
                        id="signerName"
                        type="text"
                        placeholder="Enter your full name"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        disabled={signing}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="signerEmail" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                      <Input
                        id="signerEmail"
                        type="email"
                        placeholder="Enter your email address"
                        value={signerEmail}
                        onChange={(e) => setSignerEmail(e.target.value)}
                        disabled={signing}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    {hasUserSigned ? (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          You have already signed this contract with this email address.
                        </AlertDescription>
                      </Alert>
                    ) : signerEmail && !contract.required_signers.includes(signerEmail.toLowerCase()) ? (
                      <Alert>
                        <AlertDescription>
                          Note: This email address is not in the required signers list, but you can still sign the contract.
                        </AlertDescription>
                      </Alert>
                    ) : null}

                    {(!hasUserSigned && signerName.trim() && signerEmail.trim()) && (
                      <div className="border-t pt-4">
                        <Dialog open={isSigningModalOpen} onOpenChange={setIsSigningModalOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full py-3 text-lg" 
                              size="lg"
                              disabled={signing}
                            >
                              📝 Open Signature Pad
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl">
                                Sign Contract: {contract.name}
                              </DialogTitle>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Signing as: <strong>{signerName}</strong> ({signerEmail})
                              </p>
                            </DialogHeader>
                            <div className="mt-6">
                              <SignaturePad 
                                onSign={handleSign}
                                disabled={signing}
                                loading={signing}
                                candidateName={signerName}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completion Message */}
            {contract.signing_status === 'fully_signed' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">
                      Contract Fully Signed!
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      All required parties have signed this contract. 
                      Notifications have been sent to all parties.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
