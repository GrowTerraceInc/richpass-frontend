'use client';

import EmailSent from '../components/EmailSent';
import { resendVerification } from '@/lib/useAuth';

export default function EmailSentScreen() {
  async function onResend() {
    await resendVerification();
    // ここでトースト等を表示する場合はお好みで
  }
  return <EmailSent onResend={onResend} />;
}
