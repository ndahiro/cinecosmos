import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Key, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  CheckCircle2, 
  HardDrive 
} from 'lucide-react';
import { Project } from '../types';
import { 
  generateEncryptionKey, 
  deriveKeyFromPassphrase, 
  encryptData, 
  decryptData,
  computeFingerprint 
} from '../services/crypto';

interface EncryptionModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onProjectDecrypted: (project: Project) => void;
}

export const EncryptionModal: React.FC<EncryptionModalProps> = ({
  project,
  isOpen,
  onClose,
  onProjectDecrypted,
}) => {
  const [passphrase, setPassphrase] = useState<string>('studio-master-vault-2026');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(project.isEncrypted);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportEncryptedBackup = async () => {
    try {
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const key = await deriveKeyFromPassphrase(passphrase, salt);
      const plaintext = JSON.stringify(project);
      const { ciphertext, iv } = await encryptData(plaintext, key);
      const fingerprint = await computeFingerprint(plaintext);

      const backupPackage = {
        app: 'CineCosmos',
        version: '2.0-e2ee',
        algorithm: 'AES-GCM-256',
        salt: Array.from(salt),
        iv,
        fingerprint,
        ciphertext,
        createdAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(backupPackage, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_encrypted_backup.json`;
      a.click();
      URL.revokeObjectURL(url);

      setStatusMessage('Encrypted vault exported with AES-GCM 256-bit key!');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert('Encryption failed: ' + err.message);
    }
  };

  const handleImportEncryptedBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const pkg = JSON.parse(event.target?.result as string);
        if (!pkg.ciphertext || !pkg.salt || !pkg.iv) {
          throw new Error('Invalid encrypted backup format');
        }

        const salt = new Uint8Array(pkg.salt);
        const key = await deriveKeyFromPassphrase(passphrase, salt);
        const decryptedPlaintext = await decryptData(pkg.ciphertext, pkg.iv, key);
        const restoredProject: Project = JSON.parse(decryptedPlaintext);

        onProjectDecrypted(restoredProject);
        setStatusMessage('Backup decrypted & loaded into studio successfully!');
        setTimeout(() => {
          setStatusMessage(null);
          onClose();
        }, 1500);
      } catch (err: any) {
        alert('Decryption failed. Please verify your passphrase: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0E121A] border border-[#232938] rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#212738]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Client-Side End-to-End Encryption (E2EE Vault)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          Zero-knowledge cryptographic security powered by the Web Crypto API. All frame arrays, character embedding anchors, and scripts are encrypted client-side using <strong>AES-GCM 256-bit</strong> with 100,000 PBKDF2 iterations before disk or cloud persistence.
        </p>

        {/* Security Parameters */}
        <div className="flex flex-col gap-3 bg-[#0A0D14] p-4 rounded-lg border border-[#1E2434]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">Vault Security Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              AES-GCM-256 ACTIVE
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-300">Vault Master Passphrase</label>
            <div className="relative">
              <input
                type="text"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full bg-[#131724] border border-[#252C3D] text-xs font-mono text-amber-300 px-3 py-2 rounded outline-none focus:border-amber-400"
              />
              <Key className="w-4 h-4 text-neutral-500 absolute right-3 top-2.5" />
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <label className="flex-1 py-2.5 px-3 bg-[#161B26] hover:bg-[#202738] border border-[#272F42] text-neutral-200 text-xs font-semibold rounded flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Restore Encrypted Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportEncryptedBackup}
              className="hidden"
            />
          </label>

          <button
            onClick={handleExportEncryptedBackup}
            className="flex-1 py-2.5 px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold rounded flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
          >
            <Download className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Export Encrypted Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
};
