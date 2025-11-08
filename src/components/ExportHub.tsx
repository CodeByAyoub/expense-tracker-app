import React, { useState } from 'react';
import {
  X,
  Cloud,
  Mail,
  FileSpreadsheet,
  Calendar,
  Share2,
  Download,
  Clock,
  Zap,
  CheckCircle2,
  Settings,
  TrendingUp,
  FileText,
  Database,
  Smartphone,
  Link2,
  QrCode,
  History,
  Star,
} from 'lucide-react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/expenseUtils';

interface ExportHubProps {
  expenses: Expense[];
  onClose: () => void;
}

interface CloudService {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  status: 'active' | 'syncing' | 'error' | 'disconnected';
  lastSync?: string;
  color: string;
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  format: string;
  icon: React.ReactNode;
  popular?: boolean;
}

interface ExportHistoryItem {
  id: string;
  template: string;
  destination: string;
  date: string;
  size: string;
  status: 'success' | 'failed' | 'pending';
}

const ExportHub: React.FC<ExportHubProps> = ({ expenses, onClose }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'cloud' | 'schedule' | 'share' | 'history'>('quick');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [showQR, setShowQR] = useState(false);

  const cloudServices: CloudService[] = [
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      icon: '📊',
      connected: true,
      status: 'active',
      lastSync: '2 mins ago',
      color: 'bg-green-50 border-green-200',
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: '💾',
      connected: true,
      status: 'syncing',
      lastSync: 'Syncing now...',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: '📦',
      connected: false,
      status: 'disconnected',
      color: 'bg-gray-50 border-gray-200',
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: '☁️',
      connected: true,
      status: 'active',
      lastSync: '1 hour ago',
      color: 'bg-indigo-50 border-indigo-200',
    },
    {
      id: 'notion',
      name: 'Notion',
      icon: '📝',
      connected: false,
      status: 'disconnected',
      color: 'bg-gray-50 border-gray-200',
    },
    {
      id: 'airtable',
      name: 'Airtable',
      icon: '🗂️',
      connected: false,
      status: 'disconnected',
      color: 'bg-gray-50 border-gray-200',
    },
  ];

  const exportTemplates: ExportTemplate[] = [
    {
      id: 'tax-report',
      name: 'Tax Report',
      description: 'IRS-friendly format with categorized deductions',
      format: 'PDF + Excel',
      icon: <FileText className="text-purple-600" size={24} />,
      popular: true,
    },
    {
      id: 'monthly-summary',
      name: 'Monthly Summary',
      description: 'Executive summary with charts and insights',
      format: 'PDF',
      icon: <TrendingUp className="text-blue-600" size={24} />,
      popular: true,
    },
    {
      id: 'category-analysis',
      name: 'Category Analysis',
      description: 'Detailed breakdown by category and subcategory',
      format: 'Excel',
      icon: <Database className="text-green-600" size={24} />,
    },
    {
      id: 'receipt-backup',
      name: 'Receipt Backup',
      description: 'Complete archive for record keeping',
      format: 'ZIP',
      icon: <Download className="text-orange-600" size={24} />,
    },
    {
      id: 'mobile-friendly',
      name: 'Mobile View',
      description: 'Optimized for viewing on smartphone',
      format: 'HTML',
      icon: <Smartphone className="text-pink-600" size={24} />,
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks Format',
      description: 'Import-ready for accounting software',
      format: 'CSV',
      icon: <FileSpreadsheet className="text-teal-600" size={24} />,
    },
  ];

  const exportHistory: ExportHistoryItem[] = [
    {
      id: '1',
      template: 'Monthly Summary',
      destination: 'Google Sheets',
      date: '2 hours ago',
      size: '245 KB',
      status: 'success',
    },
    {
      id: '2',
      template: 'Tax Report',
      destination: 'Email (user@example.com)',
      date: 'Yesterday',
      size: '1.2 MB',
      status: 'success',
    },
    {
      id: '3',
      template: 'Category Analysis',
      destination: 'OneDrive',
      date: '3 days ago',
      size: '892 KB',
      status: 'success',
    },
    {
      id: '4',
      template: 'Receipt Backup',
      destination: 'Google Drive',
      date: '1 week ago',
      size: '4.5 MB',
      status: 'success',
    },
  ];

  const handleQuickExport = (templateId: string) => {
    alert(`📤 Exporting with template: ${exportTemplates.find(t => t.id === templateId)?.name}\n\nIn a real app, this would:\n✓ Generate the export file\n✓ Download to your device\n✓ Add to export history`);
  };

  const handleCloudExport = (serviceId: string, templateId: string) => {
    const service = cloudServices.find(s => s.id === serviceId);
    const template = exportTemplates.find(t => t.id === templateId);

    if (!service?.connected) {
      alert(`🔌 Connect to ${service?.name}\n\nYou'll be redirected to authenticate with ${service?.name}.\n\nIn a real app, this would:\n✓ Open OAuth flow\n✓ Request permissions\n✓ Store access tokens securely`);
      return;
    }

    alert(`☁️ Exporting to ${service.name}\n\nTemplate: ${template?.name}\n\nIn a real app, this would:\n✓ Upload to cloud service\n✓ Show progress indicator\n✓ Provide link when complete\n✓ Enable auto-sync if configured`);
  };

  const handleEmailExport = () => {
    if (!emailAddress) {
      alert('Please enter an email address');
      return;
    }

    alert(`📧 Email Export Initiated\n\nSending to: ${emailAddress}\n\nIn a real app, this would:\n✓ Generate formatted report\n✓ Attach files\n✓ Send via email service API\n✓ Send confirmation notification\n\nEmail would include:\n• PDF summary\n• Excel spreadsheet\n• Interactive charts\n• Secure download links`);
  };

  const handleScheduleBackup = () => {
    alert(`🔄 Automatic Backup Scheduled\n\nIn a real app, this would:\n✓ Set up recurring exports\n✓ Configure destinations\n✓ Set frequency (daily/weekly/monthly)\n✓ Choose templates\n✓ Enable notifications\n\nYou could configure:\n• Backup frequency\n• Cloud destinations\n• Export formats\n• Retention policies`);
  };

  const handleGenerateShareLink = () => {
    const link = `https://expense-tracker.app/share/${Math.random().toString(36).substr(2, 9)}`;
    setShareLink(link);

    alert(`🔗 Shareable Link Generated!\n\n${link}\n\nIn a real app, this would:\n✓ Create secure, time-limited link\n✓ Set permissions (view/download)\n✓ Track access analytics\n✓ Allow expiration dates\n✓ Password protection option`);
  };

  const handleGenerateQR = () => {
    setShowQR(true);
    alert(`📱 QR Code Generated!\n\nIn a real app, this would:\n✓ Generate actual QR code image\n✓ Embed link to data\n✓ Allow customization (colors, logo)\n✓ Download as PNG/SVG\n✓ Print-friendly format`);
  };

  const tabs = [
    { id: 'quick' as const, label: 'Quick Export', icon: Zap },
    { id: 'cloud' as const, label: 'Cloud Services', icon: Cloud },
    { id: 'schedule' as const, label: 'Auto Backup', icon: Calendar },
    { id: 'share' as const, label: 'Share', icon: Share2 },
    { id: 'history' as const, label: 'History', icon: History },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Cloud size={32} />
                Export Hub
              </h2>
              <p className="text-blue-100 mt-1">
                Export, sync, and share your expense data across platforms
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm text-blue-100">Ready to Export</div>
              <div className="text-2xl font-bold">{expenses.length} expenses</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm text-blue-100">Total Value</div>
              <div className="text-2xl font-bold">
                {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-sm text-blue-100">Connected Services</div>
              <div className="text-2xl font-bold">
                {cloudServices.filter(s => s.connected).length}/{cloudServices.length}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2 px-6">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                  activeTab === id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {label}
                {activeTab === id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Quick Export Tab */}
          {activeTab === 'quick' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Export Templates</h3>
                <p className="text-gray-600">
                  Choose a pre-configured template optimized for specific use cases
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative"
                    onClick={() => handleQuickExport(template.id)}
                  >
                    {template.popular && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Star size={12} />
                        Popular
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">{template.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {template.format}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="text-green-600" size={24} />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">Email Me a Copy</h4>
                    <p className="text-sm text-gray-600">Send the export directly to your inbox</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmailExport();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cloud Services Tab */}
          {activeTab === 'cloud' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cloud Integrations</h3>
                <p className="text-gray-600">
                  Connect your favorite cloud services for seamless data sync
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cloudServices.map((service) => (
                  <div
                    key={service.id}
                    className={`border-2 rounded-xl p-4 transition-all ${service.color} ${
                      service.connected ? 'hover:shadow-md cursor-pointer' : 'opacity-75'
                    }`}
                    onClick={() => service.connected && setSelectedService(service.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{service.icon}</div>
                        <div>
                          <h4 className="font-bold text-gray-900">{service.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {service.connected ? (
                              <>
                                <div className={`w-2 h-2 rounded-full ${
                                  service.status === 'active' ? 'bg-green-500' :
                                  service.status === 'syncing' ? 'bg-blue-500 animate-pulse' :
                                  'bg-red-500'
                                }`} />
                                <span className="text-xs text-gray-600">
                                  {service.status === 'active' ? 'Connected' :
                                   service.status === 'syncing' ? 'Syncing...' :
                                   'Error'}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">Not connected</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {service.connected && (
                        <CheckCircle2 className="text-green-600" size={20} />
                      )}
                    </div>

                    {service.connected && service.lastSync && (
                      <div className="text-xs text-gray-600 mb-3">
                        Last sync: {service.lastSync}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (service.connected) {
                          handleCloudExport(service.id, 'monthly-summary');
                        } else {
                          handleCloudExport(service.id, 'monthly-summary');
                        }
                      }}
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        service.connected
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      {service.connected ? 'Export Now' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>

              {selectedService && (
                <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-4">
                    Export to {cloudServices.find(s => s.id === selectedService)?.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {exportTemplates.slice(0, 4).map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleCloudExport(selectedService, template.id)}
                        className="p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
                      >
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{template.format}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Automatic Backups</h3>
                <p className="text-gray-600">
                  Set up recurring exports to never lose your data
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Calendar className="text-purple-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">Daily Backup</h4>
                      <p className="text-sm text-gray-600">Automatically export every day at 11:00 PM</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Daily</option>
                      <option>Weekly (Monday)</option>
                      <option>Monthly (1st)</option>
                      <option>Custom</option>
                    </select>
                    <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Monthly Summary</option>
                      <option>Tax Report</option>
                      <option>Category Analysis</option>
                      <option>All Templates</option>
                    </select>
                    <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Google Drive</option>
                      <option>OneDrive</option>
                      <option>Email</option>
                      <option>All Services</option>
                    </select>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <Clock className="text-gray-400 mx-auto mb-3" size={32} />
                  <h4 className="font-bold text-gray-900 mb-2">Create New Schedule</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Set up additional automatic exports with custom schedules
                  </p>
                  <button
                    onClick={handleScheduleBackup}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Configure Backup Schedule
                  </button>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Zap className="text-yellow-600 mt-0.5" size={20} />
                    <div>
                      <h5 className="font-bold text-gray-900 mb-1">Smart Backup Recommendations</h5>
                      <p className="text-sm text-gray-700">
                        Based on your usage patterns, we recommend:
                      </p>
                      <ul className="text-sm text-gray-700 mt-2 space-y-1">
                        <li>• <strong>Weekly</strong> backups to Google Drive (you add ~50 expenses/week)</li>
                        <li>• <strong>Monthly</strong> tax reports to email (tax season is approaching)</li>
                        <li>• <strong>Daily</strong> sync to Google Sheets for real-time tracking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Share Tab */}
          {activeTab === 'share' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your Data</h3>
                <p className="text-gray-600">
                  Generate secure links or QR codes to share with others
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Link2 className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Shareable Link</h4>
                      <p className="text-sm text-gray-600">Create a secure link to your data</p>
                    </div>
                  </div>

                  {shareLink ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Your shareable link:</div>
                        <div className="text-sm font-mono text-blue-600 break-all">{shareLink}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Copy Link
                        </button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                          Reset
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-3 mb-4">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm text-gray-700">Allow downloads</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-gray-700">Require password</span>
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                          <option>Expires in 7 days</option>
                          <option>Expires in 30 days</option>
                          <option>Expires in 90 days</option>
                          <option>Never expires</option>
                        </select>
                      </div>
                      <button
                        onClick={handleGenerateShareLink}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Generate Share Link
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <QrCode className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">QR Code</h4>
                      <p className="text-sm text-gray-600">Share via mobile device</p>
                    </div>
                  </div>

                  {showQR ? (
                    <div className="space-y-3">
                      <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                        <div className="w-48 h-48 bg-white border-4 border-gray-300 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <QrCode className="text-gray-400 mx-auto mb-2" size={48} />
                            <div className="text-xs text-gray-500">QR Code Preview</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                          Download PNG
                        </button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                          Print
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-3 mb-4">
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                          <option>Standard Quality</option>
                          <option>High Quality</option>
                          <option>Print Quality</option>
                        </select>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                          <option>Black & White</option>
                          <option>Colored</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      <button
                        onClick={handleGenerateQR}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Generate QR Code
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Share2 className="text-pink-600 mt-0.5" size={24} />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2">Collaboration Features</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Share with your accountant, business partner, or team members
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="p-3 bg-white border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors text-sm font-medium">
                        📧 Email Invite
                      </button>
                      <button className="p-3 bg-white border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors text-sm font-medium">
                        👥 Team Access
                      </button>
                      <button className="p-3 bg-white border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors text-sm font-medium">
                        🔒 Set Permissions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Export History</h3>
                <p className="text-gray-600">
                  Track all your previous exports and downloads
                </p>
              </div>

              <div className="space-y-3">
                {exportHistory.map((item) => (
                  <div
                    key={item.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          item.status === 'success' ? 'bg-green-100' :
                          item.status === 'failed' ? 'bg-red-100' :
                          'bg-yellow-100'
                        }`}>
                          {item.status === 'success' ? (
                            <CheckCircle2 className="text-green-600" size={24} />
                          ) : item.status === 'failed' ? (
                            <X className="text-red-600" size={24} />
                          ) : (
                            <Clock className="text-yellow-600" size={24} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{item.template}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-600">{item.destination}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{item.date}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{item.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                          Re-export
                        </button>
                        <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="text-blue-600" size={20} />
                    <div>
                      <h5 className="font-bold text-gray-900">Export Analytics</h5>
                      <p className="text-sm text-gray-600">View detailed statistics about your exports</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Cloud size={16} />
              <span>All exports are encrypted and secure</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportHub;
