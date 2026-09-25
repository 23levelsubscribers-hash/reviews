import { AdminStats, AdminUser, ProofItem, PublicProofData, PublicProofResponse } from '../types';

const TOKEN_KEY = 'deliverproof_admin_token';

export const api = {
  // Token management
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Public: Fetch all active delivery proofs for direct customer viewing
  async getPublicProofs(): Promise<PublicProofData[]> {
    try {
      const res = await fetch('/api/public/proofs');
      const data = await res.json();
      if (!res.ok) {
        return [];
      }
      return data.proofs || [];
    } catch (err) {
      console.error('Error fetching proofs showcase:', err);
      return [];
    }
  },

  // Public: Fetch unique proof for a customer ID
  async getPublicProof(customerId: string): Promise<PublicProofResponse> {
    try {
      const res = await fetch(`/api/public/proof/${encodeURIComponent(customerId)}`);
      const data = await res.json();
      if (!res.ok) {
        return {
          found: false,
          error: data.error || 'Proof record not found',
        };
      }
      return data;
    } catch (err: any) {
      return {
        found: false,
        error: err.message || 'Unable to connect to verification server',
      };
    }
  },

  // Admin Auth
  async login(username: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to authenticate');
    }
    this.setToken(data.token);
    return data;
  },

  async getAdminMe(): Promise<{ user: AdminUser } | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        this.removeToken();
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const token = this.getToken();
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to change password');
    }
  },

  // Admin Proofs Management
  async getAdminProofs(): Promise<{ stats: AdminStats; proofs: ProofItem[] }> {
    const token = this.getToken();
    const res = await fetch('/api/admin/proofs', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load proofs');
    }
    return data;
  },

  async createProof(proofData: Partial<ProofItem>): Promise<{ proof: ProofItem; proofUrl: string }> {
    const token = this.getToken();
    const res = await fetch('/api/admin/proofs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(proofData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create proof');
    }
    return data;
  },

  async updateProof(id: string, proofData: Partial<ProofItem>): Promise<{ proof: ProofItem; proofUrl: string }> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/proofs/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(proofData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update proof');
    }
    return data;
  },

  async deleteProof(id: string): Promise<void> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/proofs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete proof');
    }
  },

  // Upload multiple screenshots
  async uploadScreenshots(files: File[]): Promise<string[]> {
    const token = this.getToken();
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('screenshots', file);
    });

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return (data.files || []).map((f: any) => f.url);
  },
};
