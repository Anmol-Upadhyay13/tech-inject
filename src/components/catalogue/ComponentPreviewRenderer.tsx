import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Input,
  SearchInput,
  Badge,
  StatusIndicator,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  Breadcrumbs,
  Table,
  Modal,
  Drawer,
  FilterControl,
  Toggle,
  Checkbox,
  RadioGroup,
  Select,
} from '../../../packages/ui/index.ts';
import { Lock, ArrowRight, ShieldCheck, Mail, Sparkles, Plus, Trash2, Eye } from 'lucide-react';

interface PreviewRendererProps {
  slug: string;
  variant: string;
  size: 'sm' | 'md' | 'lg';
  isDisabled: boolean;
  isLoading: boolean;
  isLocked?: boolean;
  onOpenLoginModal?: () => void;
}

export function ComponentPreviewRenderer({
  slug,
  variant,
  size,
  isDisabled,
  isLoading,
  isLocked,
  onOpenLoginModal,
}: PreviewRendererProps) {
  // Local state for interactive preview controls
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [toggleState, setToggleState] = useState(true);
  const [checkboxState, setCheckboxState] = useState(true);
  const [radioState, setRadioState] = useState('enterprise');
  const [selectState, setSelectState] = useState('closed_won');

  // If locked (premium component without active premium subscription)
  if (isLocked) {
    return (
      <div className="relative w-full py-16 px-6 flex flex-col items-center justify-center text-center bg-slate-50/80 rounded-lg border border-dashed border-slate-300">
        <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 mb-4 shadow-xs">
          <Lock className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-900 mb-1">
          Tech Inject Pro Component
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          Live preview, source code inspection, CLI bundle installation, and AI-agent prompt generation for this component are reserved for active Tech Inject Premium subscribers.
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={onOpenLoginModal}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Sign In with Pro Account
          </Button>
        </div>
      </div>
    );
  }

  // Live Component Renderers matching actual component source:
  switch (slug) {
    case 'button':
      return (
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant={variant as any}
            size={size}
            disabled={isDisabled}
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {variant === 'destructive'
              ? 'Delete Record'
              : variant === 'subtle'
              ? 'View Details'
              : 'Save Changes'}
          </Button>
          <Button
            variant="secondary"
            size={size}
            disabled={isDisabled}
            isLoading={isLoading}
          >
            Cancel
          </Button>
        </div>
      );

    case 'input':
      return (
        <div className="w-full max-w-sm space-y-3">
          <Input
            size={size}
            disabled={isDisabled}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="name@company.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={variant === 'with-error' ? 'Please provide a valid company email' : undefined}
          />
          <SearchInput
            placeholder="Search accounts (⌘K)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onClear={() => setInputValue('')}
          />
        </div>
      );

    case 'card':
      return (
        <div className="w-full max-w-md">
          <Card variant={variant as any}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Enterprise Tier Upgrade</CardTitle>
                <Badge variant="brand">High Value</Badge>
              </div>
              <CardDescription>Acme Global Inc. · Deal Value: $48,000</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Contract passed technical evaluation and compliance sign-off.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <StatusIndicator status="published" label="Active Pipeline" />
                <span>·</span>
                <span>Stage 4 of 5</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="secondary">View Proposal</Button>
              <Button size="sm" variant="primary">Review Terms</Button>
            </CardFooter>
          </Card>
        </div>
      );

    case 'badge':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="success" dot={true}>Contract Signed</Badge>
          <Badge variant="warning" dot={true}>Pending Legal Review</Badge>
          <Badge variant="brand">Tier 1 Account</Badge>
          <Badge variant="premium">Enterprise License</Badge>
          <Badge variant="error" dot={true}>Payment Overdue</Badge>
        </div>
      );

    case 'tabs':
      return (
        <div className="w-full max-w-md space-y-4">
          <Tabs
            variant={variant === 'underline' ? 'underline' : 'segmented'}
            size={size === 'lg' ? 'md' : size}
            activeId={activeTab}
            onChange={setActiveTab}
            items={[
              { id: 'overview', label: 'Pipeline', count: 14 },
              { id: 'deals', label: 'Closed Won', count: 38 },
              { id: 'leads', label: 'Inbound Leads', count: 9 },
            ]}
          />
          <div className="p-4 rounded border border-slate-200 bg-white text-xs text-slate-600">
            Active Tab View: <strong className="text-slate-900 capitalize">{activeTab}</strong>
          </div>
        </div>
      );

    case 'alert':
      return (
        <div className="w-full max-w-lg space-y-3">
          <div className="w-full">
            <span className="text-xs font-semibold text-slate-500 mb-1 block uppercase">Interactive Alert</span>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs sm:text-sm">
              <strong className="block font-semibold">Deal Approved & Logged</strong>
              Acme Corporation successfully moved to Contract Finalized stage.
            </div>
          </div>
        </div>
      );

    case 'breadcrumbs':
      return (
        <div className="p-4 bg-white rounded-lg border border-slate-200 w-full max-w-md">
          <Breadcrumbs
            items={[
              { label: 'Sales CRM' },
              { label: 'Enterprise Accounts' },
              { label: 'Acme Corporation' },
            ]}
          />
        </div>
      );

    // PREMIUM COMPONENTS (RENDERED FOR AUTHORIZED PRO USERS)
    case 'table':
      return (
        <div className="w-full max-w-2xl space-y-3">
          <Table
            keyField="id"
            isLoading={isLoading || variant === 'loading'}
            columns={[
              { key: 'company', header: 'Company' },
              { key: 'stage', header: 'Sales Stage' },
              {
                key: 'amount',
                header: 'Deal Value',
                align: 'right',
                render: (r: any) => (
                  <span className="font-mono font-semibold text-slate-900">
                    ${r.amount.toLocaleString()}
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (r: any) => (
                  <Badge variant={r.status === 'Won' ? 'success' : 'brand'} dot>
                    {r.status}
                  </Badge>
                ),
              },
            ]}
            data={[
              { id: '1', company: 'Acme Corp', stage: 'Contract Negotiation', amount: 48000, status: 'Active' },
              { id: '2', company: 'Starlight Media', stage: 'Closed Won', amount: 120000, status: 'Won' },
              { id: '3', company: 'Apex Logistics', stage: 'Technical Review', amount: 35000, status: 'Active' },
              { id: '4', company: 'Nova Health', stage: 'Closed Won', amount: 89000, status: 'Won' },
            ]}
          />
        </div>
      );

    case 'modal':
      return (
        <div className="flex flex-col items-center gap-3">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Demo Modal Dialog
          </Button>
          <span className="text-xs text-slate-500">Supports keyboard Escape & focus trap</span>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Assign Opportunity Owner"
            description="Select a sales representative from your team to manage this deal."
            footer={
              <>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>Assign Owner</Button>
              </>
            }
          >
            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <p>Assigning this opportunity grants full CRM read/write permissions to the selected representative.</p>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-medium text-slate-900 block mb-1">Selected Account:</span>
                <span>Acme Corporation · $48,000 Annual Value</span>
              </div>
            </div>
          </Modal>
        </div>
      );

    case 'drawer':
      return (
        <div className="flex flex-col items-center gap-3">
          <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
            Slide Out Lead Inspection Panel
          </Button>
          <span className="text-xs text-slate-500">Smooth slide-over drawer from right</span>
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            title="Lead Inspector: Acme Corp"
            description="Complete activity log and stakeholder contacts."
            footer={
              <Button variant="primary" size="sm" onClick={() => setIsDrawerOpen(false)}>
                Done Inspecting
              </Button>
            }
          >
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Contact Information</span>
                <p className="font-medium text-slate-900">Sarah Chen · Chief Technology Officer</p>
                <p className="text-slate-500">sarah.chen@acme.corp</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">Recent Touchpoints</span>
                <p className="text-xs">✔ NDA executed (2 days ago)</p>
                <p className="text-xs">✔ Security audit approved (Yesterday)</p>
                <p className="text-xs text-indigo-600 font-medium">⏳ Contract sign-off scheduled for 2:00 PM</p>
              </div>
            </div>
          </Drawer>
        </div>
      );

    case 'filter-control':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <FilterControl
            label="Deal Stage"
            activeCount={filterActive ? 2 : 0}
            onClick={() => setFilterActive(!filterActive)}
            onClear={() => setFilterActive(false)}
          />
          <FilterControl
            label="Sales Owner"
            activeCount={0}
            onClick={() => {}}
          />
          <FilterControl
            label="Date Range"
            activeCount={1}
            onClick={() => {}}
          />
        </div>
      );

    default:
      return (
        <div className="p-8 text-center text-slate-500 text-sm">
          Interactive preview rendered for <strong>{slug}</strong>.
        </div>
      );
  }
}
