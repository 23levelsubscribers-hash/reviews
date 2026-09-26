import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, ArrowLeft, Image as ImageIcon, Lock, ShieldCheck } from 'lucide-react';

interface UploadPageProps {
  onNavigateHome: () => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onNavigateHome }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [serviceName, setServiceName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('September 24, 2026');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles(selected);
      setError('');

      // Generate instant preview URLs
      const urls = selected.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError('Please select at least one original screenshot image file from your device.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('screenshots', file);
      });
      formData.append('serviceName', serviceName || 'Digital Subscription Fulfillment');
      formData.append('customerId', customerId || `TC-${Math.floor(1000 + Math.random() * 9000)}`);
      if (customerName) formData.append('customerName', customerName);
      if (deliveryDate) formData.append('deliveryDate', deliveryDate);
      if (notes) formData.append('notes', notes);

      const response = await fetch('/api/public/add-proof', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload screenshot');
      }

      setSuccess(true);
      setTimeout(() => {
        onNavigateHome();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error uploading original screenshot.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {/* Back Link */}
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#4ADE80] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Showcase</span>
        </button>

        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-[#4ADE80]/15 border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80]">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Upload Exact Original Screenshot</h1>
              <p className="text-xs text-slate-400">
                100% untouched file upload directly to your server (no AI, no modification)
              </p>
            </div>
          </div>

          {success ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Uploaded Successfully!</h3>
              <p className="text-xs text-slate-400 mb-4">
                The exact original file is now saved and posted to the showcase gallery.
              </p>
              <button
                onClick={onNavigateHome}
                className="px-6 py-2.5 rounded-xl bg-[#4ADE80] text-slate-950 font-bold text-sm cursor-pointer shadow-lg hover:bg-white transition-colors"
              >
                View in Showcase Now
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* File Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Select Original Screenshot(s) from your Phone or Computer *
                </label>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-[#4ADE80] transition-colors rounded-2xl p-6 text-center bg-slate-950/40 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm font-semibold text-slate-200">
                      {files.length > 0
                        ? `${files.length} file(s) selected: ${files.map((f) => f.name).join(', ')}`
                        : 'Tap here to browse & choose image files'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Supports JPG, JPEG, PNG, WEBP (Original Quality Maintained)
                    </span>
                  </div>
                </div>
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {previews.map((url, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-[9/16]">
                      <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-contain" />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                        Original File
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Service Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Service / Tool Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. NordVPN (12 Months) or Capcut Pro"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#4ADE80]"
                />
              </div>

              {/* Customer ID & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Customer / Order ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TC-7823 (or leave blank for random)"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#4ADE80]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Customer Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verified Customer"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#4ADE80]"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Delivery Date
                </label>
                <input
                  type="text"
                  placeholder="September 24, 2026"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#4ADE80]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Customer delivery completed. All details verified."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#4ADE80]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading || files.length === 0}
                className="w-full py-3.5 rounded-xl bg-[#4ADE80] hover:bg-white text-slate-950 font-black text-sm transition-all shadow-lg shadow-[#4ADE80]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Uploading Original File(s)...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload &amp; Post Exact Original File</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center pt-2">
                <Lock className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Uploaded files are stored as-is without any modifications or recompression.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
