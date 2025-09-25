// src/lib/password.ts
export type PasswordScore = 0 | 1 | 2 | 3 | 4;

function countCategories(pw: string): number {
  return (
    (/[a-z]/.test(pw) ? 1 : 0) +           // 小文字
    (/[A-Z]/.test(pw) ? 1 : 0) +           // 大文字
    (/\d/.test(pw) ? 1 : 0) +              // 数字
    (/[^a-zA-Z0-9]/.test(pw) ? 1 : 0)      // 記号
  );
}

/** 0〜4 の強度スコア（シンプル版：signupと同ロジック） */
export function scorePassword(pw: string): PasswordScore {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return Math.max(0, Math.min(4, score)) as PasswordScore;
}

/** ルールに満たない場合のエラーメッセージ（満たせば null） */
export function passwordPolicyError(pw: string): string | null {
  if (!pw) return null; // 入力前は表示しない用
  if (pw.length < 8) return '8文字以上にしてください。';
  if (countCategories(pw) < 3) {
    return '大文字・小文字・数字・記号のうち3種類以上を含めてください。';
  }
  return null;
}
