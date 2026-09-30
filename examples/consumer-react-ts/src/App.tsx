import React, { useState } from 'react';
import { Button } from './components/ui/Button.tsx';
import { Badge } from './components/ui/Badge.tsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/Card.tsx';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [dealStatus, setDealStatus] = useState<'pending' | 'signed'>('pending');

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0F172A', margin: '0 0 8px 0' }}>
          Consumer React + TypeScript App
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Demonstrates integration via: (1) Manual Copy, (2) CLI Installer, and (3) AI Agent Prompt.
        </p>
      </header>

      {/* Integration Method 3: Card from AI Agent Prompt */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <CardTitle>Enterprise CRM Deal #4092</CardTitle>
            {/* Integration Method 2: Badge from CLI Installer */}
            {dealStatus === 'signed' ? (
              <Badge variant="success" dot>Contract Active</Badge>
            ) : (
              <Badge variant="warning" dot>Pending Review</Badge>
            )}
          </div>
          <CardDescription>
            Acme Technology Inc. · Annual Contract Value: $64,000 · Lead Owner: Sarah Chen
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px 0' }}>
            This customer view successfully validates that all three Tech Inject design library integration
            methods work seamlessly in an independent React + TypeScript application with no shared bundle dependencies.
          </p>
          <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '6px', fontSize: '13px', color: '#475569' }}>
            ✔ <strong>Method 1:</strong> <code>Button.tsx</code> copied manually from the Code tab.<br />
            ✔ <strong>Method 2:</strong> <code>Badge.tsx</code> installed via <code>npx @tech-inject/cli add badge</code>.<br />
            ✔ <strong>Method 3:</strong> <code>Card.tsx</code> integrated using the AI Agent Prompt generator.
          </div>
        </CardContent>

        <CardFooter>
          {/* Integration Method 1: Button copied manually */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {dealStatus === 'pending' ? (
              <Button
                variant="primary"
                onClick={() => setDealStatus('signed')}
                rightIcon={<ArrowRight style={{ width: '16px', height: '16px' }} />}
              >
                Approve & Sign Deal
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setDealStatus('pending')}
                leftIcon={<CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669' }} />}
              >
                Reset to Pending
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
