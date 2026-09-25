import React, { useEffect, useState, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  LogOut,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Check,
  Upload,
  X,
  FileText,
  Calendar,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '../services/api';
import { AdminStats, AdminUser, ProofItem } from '../types';

interface AdminPageProps {
  onNavigateHome: () => void;
  onNavigateToProof: (customerId: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onNavigateHome,
  onNavigateToProof,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  // Login form state
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('DeliverProof2026!');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [proofs, setProofs] = useState<ProofItem[]>([]);
  const [stats, setStats] = useState<AdminStats>({ total: 0, active: 0, inactive: 0 });
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Copy toast state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProof, setEditingProof] = useState<ProofItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [proofToDelete, setProofToDelete] = useState<ProofItem | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form inputs for Add/Edit
  const [formCustomerId, setFormCustomerId] = useState('');
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formServiceName, setFormServiceName] = useState('');
  const [formDeliveryDate, setFormDeliveryDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formScreenshots, setFormScreenshots] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Change password inputs
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check auth on mount
  useEffect(() => {
    const verifyAuth = async () => {
      setLoadingAuth(true);
      const res = await api.getAdminMe();
      if (res && res.user) {
        setIsAuthenticated(true);
        setCurrentUser(res.user);
        loadProofsData();
      } else {
        setIsAuthenticated(false);
      }
      setLoadingAuth(false);
    };
    verifyAuth();
  }, []);

  const loadProofsData = async () => {
    setLoadingData(true);
    try {
      const data = await api.getAdminProofs();
      setProofs(data.proofs);
      setStats(data.stats);
    } catch (err: any) {
      showToast(err.message || 'Error loading dashboard data');
    } finally {
      setLoadingData(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await api.login(usernameInput, passwordInput);
      setIsAuthenticated(true);
      setCurrentUser(res.user);
      loadProofsData();
      showToast('Admin logged in successfully');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    api.removeToken();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Open modal for new proof
  const handleOpenAddModal = () => {
    setEditingProof(null);
    setFormCustomerId('');
    setFormCustomerName('');
    setFormServiceName('');
    // Default to today's date formatted nicely
    const today = new Date();
    setFormDeliveryDate(
      today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    );
    setFormNotes('');
    setFormStatus('active');
    setFormScreenshots([]);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for edit proof
  const handleOpenEditModal = (proof: ProofItem) => {
    setEditingProof(proof);
    setFormCustomerId(proof.customerId);
    setFormCustomerName(proof.customerName || '');
    setFormServiceName(proof.serviceName);
    setFormDeliveryDate(proof.deliveryDate);
    setFormNotes(proof.notes || '');
    setFormStatus(proof.status);
    setFormScreenshots([...proof.screenshots]);
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setFormError('');
    try {
      const fileList = Array.from(files);
      const uploadedUrls = await api.uploadScreenshots(fileList);
      setFormScreenshots((prev) => [...prev, ...uploadedUrls]);
      showToast(`Uploaded ${uploadedUrls.length} screenshot(s)`);
    } catch (err: any) {
      setFormError(err.message || 'Upload failed. Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Remove screenshot
  const handleRemoveScreenshot = (indexToRemove: number) => {
    setFormScreenshots((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Add sample screenshot quick button
  const handleAddSampleScreenshot = (samplePath: string) => {
    if (!formScreenshots.includes(samplePath)) {
      setFormScreenshots((prev) => [...prev, samplePath]);
    }
  };

  // Submit Add / Edit Form
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = formCustomerId.trim().toUpperCase();
    if (!cleanId) {
      setFormError('Customer ID / Order ID is required');
      return;
    }
    if (!formServiceName.trim()) {
      setFormError('Service name is required');
      return;
    }
    if (!formDeliveryDate.trim()) {
      setFormError('Delivery date is required');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const payload = {
      customerId: cleanId,
      customerName: formCustomerName.trim() || undefined,
      serviceName: formServiceName.trim(),
      deliveryDate: formDeliveryDate.trim(),
      notes: formNotes.trim() || undefined,
      screenshots: formScreenshots,
      status: formStatus,
    };

    try {
      if (editingProof) {
        await api.updateProof(editingProof.id, payload);
        showToast(`Proof for ${cleanId} successfully updated`);
      } else {
        await api.createProof(payload);
        showToast(`New proof created for ${cleanId}`);
      }
      setIsModalOpen(false);
      loadProofsData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save proof');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Proof
  const handleConfirmDelete = async () => {
    if (!proofToDelete) return;
    try {
      await api.deleteProof(proofToDelete.id);
      showToast(`Deleted proof for ${proofToDelete.customerId}`);
      setIsDeleteModalOpen(false);
      setProofToDelete(null);
      loadProofsData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete proof');
    }
  };

  // Copy customer proof link
  const handleCopyLink = (customerId: string) => {
    const origin = window.location.origin;
    const url = `${origin}/proof/${encodeURIComponent(customerId)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(customerId);
    showToast(`Copied unique URL for ${customerId}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    if (!currPassword || !newPassword) {
      setPwdError('Both fields are required');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters');
      return;
    }
    try {
      await api.changePassword(currPassword, newPassword);
      setPwdSuccess('Admin password changed successfully!');
      setCurrPassword('');
      setNewPassword('');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPwdSuccess('');
      }, 1500);
    } catch (err: any) {
      setPwdError(err.message || 'Failed to change password');
    }
  };

  // Filtered proofs
  const filteredProofs = proofs.filter((p) => {
    const matchesSearch =
      p.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.customerName && p.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ? true : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center animate-pulse mb-3">
          <ShieldAlert className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-sm text-slate-400">Authenticating Admin Session...</p>
      </div>
    );
  }

  // --- UNAUTHENTICATED: LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Brand header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <button
              onClick={onNavigateHome}
              className="mb-3 hover:scale-105 transition-transform duration-300 focus:outline-none cursor-pointer"
              aria-label="Back to Home"
            >
              <img
                src="/toolclubpk-admin-logo.svg"
                alt="Toolclubpk Admin Portal"
                className="h-14 sm:h-16 w-auto object-contain drop-shadow-xl"
                referrerPolicy="no-referrer"
              />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Delivery Proofs &amp; Activations Management
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            {loginError && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                    placeholder="Enter admin username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                    placeholder="Enter admin password"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>Authenticate to Console</span>
                </button>
              </div>
            </form>

            {/* Quick credentials reminder badge */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 block">
                Default Credentials: <code className="text-emerald-400 font-mono">admin</code> / <code className="text-emerald-400 font-mono">DeliverProof2026!</code>
              </span>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Return to Public Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED: ADMIN DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="flex items-center group focus:outline-none cursor-pointer py-1"
            aria-label="Toolclubpk Admin"
          >
            <img
              src="/toolclubpk-admin-logo.svg"
              alt="Toolclubpk Admin - Proofs & Activations"
              className="h-10 sm:h-11 w-auto object-contain hover:scale-[1.02] transition-transform duration-300 drop-shadow-md"
              referrerPolicy="no-referrer"
            />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors"
              title="Change Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>Password</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Portal</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-300 border border-rose-500/30 transition-colors"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Title & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Customer Delivery Proofs
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Add and manage customer tool activation screenshots
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Proof</span>
          </button>
        </div>

        {/* Proofs Management Table Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Table Controls (Search & Counter) */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID or Service..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300 font-bold px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
                {proofs.length} Proofs Total
              </span>
              <button
                onClick={loadProofsData}
                className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Customer / Order ID</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Delivery Date</th>
                  <th className="py-3.5 px-4">Screenshots</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProofs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500">
                      {searchQuery
                        ? 'No proofs match your search query.'
                        : 'No delivery proofs registered yet. Click "Add New Proof" to upload screenshots.'}
                    </td>
                  </tr>
                ) : (
                  filteredProofs.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Customer ID */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            {p.customerId}
                          </span>
                          <button
                            onClick={() => handleCopyLink(p.customerId)}
                            className="p-1 text-slate-500 hover:text-white transition-colors"
                            title="Copy customer link"
                          >
                            {copiedId === p.customerId ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {p.customerName && (
                          <div className="text-xs text-slate-400 mt-0.5">
                            {p.customerName}
                          </div>
                        )}
                      </td>

                      {/* Service */}
                      <td className="py-4 px-4 font-medium text-slate-200">
                        {p.serviceName}
                      </td>

                      {/* Delivery Date */}
                      <td className="py-4 px-4 text-slate-300">
                        {p.deliveryDate}
                      </td>

                      {/* Screenshots */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                            <ImageIcon className="w-3 h-3 text-slate-400" />
                            <span>{p.screenshots.length}</span>
                          </span>
                          {p.screenshots.length > 0 && (
                            <div className="flex -space-x-2 overflow-hidden ml-1">
                              {p.screenshots.slice(0, 3).map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt=""
                                  className="w-6 h-6 rounded-full border border-slate-800 object-cover inline-block"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View public proof */}
                          <button
                            onClick={() => onNavigateToProof(p.customerId)}
                            className="px-2.5 py-1 text-xs text-slate-300 hover:text-emerald-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                            title="View Public Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">View</span>
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                            title="Edit Proof"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              setProofToDelete(p);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Proof"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- ADD / EDIT PROOF MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div className="max-w-xl w-full my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>{editingProof ? 'Edit Delivery Proof' : 'Add New Delivery Proof'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitProof} className="p-6 overflow-y-auto space-y-4 flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Customer ID & Service Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer / Order ID <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TC-1025"
                    value={formCustomerId}
                    onChange={(e) => setFormCustomerId(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Service Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Canva Pro, Netflix 4K"
                    value={formServiceName}
                    onChange={(e) => setFormServiceName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Delivery Date & Customer Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Delivery Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. September 26, 2026"
                    value={formDeliveryDate}
                    onChange={(e) => setFormDeliveryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Name <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Marcus Vance"
                    value={formCustomerName}
                    onChange={(e) => setFormCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Delivery Notes <span className="text-slate-500">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Delivered 1 Year private credentials."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Upload Screenshots Section */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Screenshots ({formScreenshots.length} uploaded)
                </label>

                {/* Dropzone */}
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950 text-center transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="screenshot-file-input"
                  />
                  <label
                    htmlFor="screenshot-file-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-300">
                      {isUploading
                        ? 'Uploading Screenshots...'
                        : 'Click to Upload or Drag Screenshots Here'}
                    </span>
                  </label>
                </div>

                {/* Attached Screenshot Previews */}
                {formScreenshots.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                    {formScreenshots.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3]"
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-md transition-colors"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  )}
                  <span>{editingProof ? 'Save Changes' : 'Save Proof'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && proofToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Delivery Proof?</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Are you sure you want to permanently delete the proof record for{' '}
              <strong className="text-white font-mono">{proofToDelete.customerId}</strong> ({proofToDelete.serviceName})?
              The unique link <code className="text-slate-300">/proof/{proofToDelete.customerId}</code> will immediately return a 404 Not Found error.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProofToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-600/20"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CHANGE PASSWORD MODAL --- */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Change Admin Password</span>
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pwdError && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {pwdSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
