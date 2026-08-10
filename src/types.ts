export interface DocumentSignatureItem {
  signer_name: string;
  signer_role?: string;
  status: string;
  signed_at?: string | null;
  signature_hash?: string;
  is_current_scanned?: boolean;
  is_manual?: boolean;
}

export interface DocumentItem {
  docstore_key?: string;
  id?: string | number;
  type: string;
  number: string;
  status?: string;
  content: Record<string, any>;
}

export interface VerificationResult {
  is_valid: boolean;
  verification_status?: string;
  verification_detail?: string;
  cryptographic_error?: string;
  message?: string;
  is_manual?: boolean;
  manual_signers?: DocumentSignatureItem[];
  scanned_signature?: DocumentSignatureItem;
  document?: DocumentItem;
  signatures?: DocumentSignatureItem[];
  all_signatures?: DocumentSignatureItem[];
  byte_counter?: {
    file_size_bytes?: number;
    byte_counter_hash?: string;
    match?: boolean;
  };
}
