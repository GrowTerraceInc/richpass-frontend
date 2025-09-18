'use client';

const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

export default function PortalAction() {
  const go = () => { window.location.href = `${API}/api/billing/portal/redirect`; };
  return (
    <button onClick={go} style={{ padding:'10px 16px', fontSize:16 }}>
      お支払い方法・請求の管理
    </button>
  );
}
