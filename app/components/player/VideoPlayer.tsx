'use client';

import * as React from 'react';
import styles from './VideoPlayer.module.css';

type Props = {
  title: string;
  /** VimeoページURL / 埋め込みURL / 数字IDのみ */
  src?: string;
  posterText?: string;
  /** 視聴完了（または98%以上視聴）時に呼ばれる */
  onEnded?: () => void;
};

type TimeUpdatePayload = { seconds?: number; duration?: number; percent?: number };
type VimeoPlayer = {
  on(event: 'ended', cb: () => void): void;
  on(event: 'timeupdate', cb: (data: TimeUpdatePayload) => void): void;
  destroy(): Promise<void> | void;
};
type PlayerCtor = new (element: HTMLIFrameElement) => VimeoPlayer;

/* ------------------------------
   1) URL 正規化 + 埋め込みURL生成
-------------------------------- */
function cleanInput(v?: string) {
  if (!v) return '';
  // 前後空白と、CSV由来の両端ダブルクォートを除去
  return String(v).trim().replace(/^"+|"+$/g, '');
}

function toVimeoEmbed(urlOrId?: string): string | null {
  const input = cleanInput(urlOrId);
  if (!input) return null;

  const baseParams = () =>
    new URLSearchParams({ title: '0', byline: '0', portrait: '0', dnt: '1' }).toString();

  // 1) 数字IDだけ
  if (/^\d{6,12}$/.test(input)) {
    return `https://player.vimeo.com/video/${input}?${baseParams()}`;
  }

  // 2) URL解析（http/https必須）
  //    もし protocol 無しで "vimeo.com/123..." のように入ってきたら補完
  const urlStr = /^[a-z]+:\/\//i.test(input) ? input : `https://${input}`;

  try {
    const u = new URL(urlStr);

    // すでに player.vimeo.com なら id と h を尊重して組み直す
    if (u.hostname.includes('player.vimeo.com')) {
      const idMatch = u.pathname.match(/\/video\/(\d{6,12})/);
      const id = idMatch?.[1];
      const h = u.searchParams.get('h') ?? undefined;
      if (id) {
        const params = new URLSearchParams({ title: '0', byline: '0', portrait: '0', dnt: '1' });
        if (h) params.set('h', h);
        return `https://player.vimeo.com/video/${id}?${params.toString()}`;
      }
      return urlStr; // そのまま
    }

    // vimeo.com 各種パターン → id + hash を抽出
    const segs = u.pathname.split('/').filter(Boolean);
    const id = segs.find((s) => /^\d{6,12}$/.test(s));
    const i = id ? segs.indexOf(id) : -1;
    let hash = u.searchParams.get('h') || undefined;
    if (!hash && i >= 0 && segs[i + 1] && /^[A-Za-z0-9_-]{8,}$/.test(segs[i + 1])) {
      hash = segs[i + 1];
    }
    if (id) {
      const params = new URLSearchParams({ title: '0', byline: '0', portrait: '0', dnt: '1' });
      if (hash) params.set('h', hash); // リンク限定は h が必須
      return `https://player.vimeo.com/video/${id}?${params.toString()}`;
    }

    // 連続数字から最大長を採用（保険）
    const all = input.match(/\d{6,12}/g);
    if (all?.length) {
      const best = all.sort((a, b) => b.length - a.length)[0];
      return `https://player.vimeo.com/video/${best}?${baseParams()}`;
    }
  } catch {
    // noop
  }

  return null;
}

/* ------------------------------
   2) プレイヤー本体
-------------------------------- */
export default function VideoPlayer({ title, src, posterText, onEnded }: Props) {
  const embed = React.useMemo(() => toVimeoEmbed(src), [src]);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  // 最新の onEnded を保持（依存に入れずに参照）
  const onEndedRef = React.useRef<(() => void) | undefined>(undefined);
  React.useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  // 視聴完了検知（※依存は embed のみ。親の state 変更で destroy されないように）
  React.useEffect(() => {
    if (!iframeRef.current || !embed) return;

    let player: VimeoPlayer | null = null;
    let completed = false;

    (async () => {
      try {
        const mod = await import('@vimeo/player');
        const Player = (mod as unknown as { default: PlayerCtor }).default;
        player = new Player(iframeRef.current!);

        player.on('ended', () => {
          if (!completed) {
            completed = true;
            onEndedRef.current?.();
          }
        });

        player.on('timeupdate', (e: TimeUpdatePayload) => {
          if (!completed && (e.percent ?? 0) >= 0.98) {
            completed = true;
            onEndedRef.current?.();
          }
        });
      } catch {
        // SDK読み込み失敗時もUIは維持（ログは出さない）
      }
    })();

    // 埋め込みURL変更 or アンマウント時のみ破棄
    return () => {
      try { player?.destroy(); } catch {}
      player = null;
    };
  }, [embed]);

  return (
    <div className={styles.player}>
      <div className={styles.frame} aria-label={title}>
        {embed ? (
          <iframe
            ref={iframeRef}
            className={styles.iframe}
            src={embed}
            title={title}
            /* fullscreen は allow から外し、allowFullScreen を残す（警告回避） */
            allow="autoplay; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}>
            {posterText && <span className={styles.badge}>{posterText}</span>}
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
