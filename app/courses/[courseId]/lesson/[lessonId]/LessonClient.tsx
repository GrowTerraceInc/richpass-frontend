'use client';

import Breadcrumbs from '@/app/components/breadcrumbs/Breadcrumbs';
import VideoPlayer from '@/app/components/player/VideoPlayer';
import styles from './LessonPage.module.css';
import clsx from 'clsx';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import React from 'react';
import BookmarkButton from '@/app/components/bookmarks/BookmarkButton';

type ClientLesson = {
  id: string;
  title: string;
  summary: string;
  videoUrl: string;
  testId: string;
};

export default function LessonClient({
  courseId,
  courseTitle,
  lesson,
}: {
  courseId: string;
  courseTitle: string;
  lesson: ClientLesson;
}) {
  const router = useRouter();
  const [canProceed, setCanProceed] = React.useState(false);
  const [showGateTip, setShowGateTip] = React.useState(false);

  function handleOverlayKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowGateTip(true);
    }
  }

  return (
    <div className={clsx(styles.content)}>
      <div className={styles.header}>
        <Breadcrumbs
          items={[
            { label: 'コース一覧', href: '/courses' },
            { label: courseTitle, href: `/courses/${courseId}` },
            { label: lesson.title },
          ]}
        />
      </div>

      {/* タイトル行 + ブックマーク */}
      <div className={styles.titleRow}>
        <h1 className={styles.h1}>{lesson.title}</h1>
        <BookmarkButton lessonId={lesson.id} />
      </div>

      <div className={styles.player}>
        <VideoPlayer
          title={lesson.title}
          posterText="リッチパス"
          src={lesson.videoUrl}
          onEnded={() => setCanProceed(true)}
        />
      </div>

      <section className={styles.summary}>
        <h2 className={styles.subTitle}>レッスン概要</h2>
        <p>{lesson.summary || 'このレッスンの概要は準備中です。'}</p>
      </section>

      <div className={styles.cta}>
        {lesson.testId && (
          <div className={styles.ctaWrap}>
            <Button
              variant="primary"
              size="large"
              aria-label="理解度チェックテストに進む"
              onClick={() => router.push(`/courses/${courseId}/test/${lesson.testId}`)}
              disabled={!canProceed}
              aria-disabled={!canProceed}
              title={!canProceed ? '最後まで視聴すると進めます' : undefined}
            >
              理解度チェックテストに進む
            </Button>

            {!canProceed && (
              <button
                type="button"
                className={styles.ctaOverlay}
                onClick={() => setShowGateTip(true)}
                onKeyDown={handleOverlayKeyDown}
                aria-label="動画の視聴完了後にテストを受けることができます"
              />
            )}
          </div>
        )}
      </div>

      {showGateTip && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="gateTitle">
          <div className={styles.modal} role="document">
            <h3 id="gateTitle" className={styles.modalTitle}>テストはまだ受けられません</h3>
            <p className={styles.modalBody}>
              動画の視聴完了後にテストを受けることができます。
            </p>
            <div className={styles.modalActions}>
              <Button variant="primary" size="medium" onClick={() => setShowGateTip(false)}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
