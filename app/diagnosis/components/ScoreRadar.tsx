'use client';

import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts';

/** 対になる3軸（知識↔直感 / リスク↔安定 / 共同↔個別） */
type AxisPairs = {
  /** 0–28で「知識」への寄り（直感は自動で MAX-値） */
  knowledge?: number;
  /** 0–28で「リスク」への寄り（安定は自動で MAX-値） */
  risk?: number;
  /** 0–28で「共同」への寄り（個別は自動で MAX-値） */
  cooperative?: number;
};

export type RadarPoint = { key: string; label: string; value: number };

const MAX = 28;

function clampToMax(v: number) {
  if (Number.isNaN(v)) return 0;
  return Math.min(MAX, Math.max(0, v));
}

/** 3つのペア値から、反対側を自動補完して6軸に展開 */
function toSixAxes(axes: Required<AxisPairs>): RadarPoint[] {
  const K = clampToMax(axes.knowledge);
  const R = clampToMax(axes.risk);
  const C = clampToMax(axes.cooperative);

  // [A, B, C, Aの反対, Bの反対, Cの反対] → 180度で向かい合う配置
  return [
    { key: 'knowledge',  label: '知識', value: K },
    { key: 'risk',       label: 'リスク', value: R },
    { key: 'cooperative',label: '共同', value: C },
    { key: 'intuition',  label: '直感', value: MAX - K },
    { key: 'stability',  label: '安定', value: MAX - R },
    { key: 'individual', label: '個別', value: MAX - C },
  ];
}

const defaultPairs: Required<AxisPairs> = {
  knowledge: 18,
  risk: 10,
  cooperative: 14,
};

export default function ScoreRadar(
  props: { data?: RadarPoint[]; axes?: AxisPairs }
) {
  const chartData =
    props.data?.length
      ? props.data
      : toSixAxes({ ...defaultPairs, ...(props.axes ?? {}) });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chartData} outerRadius="82%">
        <PolarGrid stroke="var(--color-gray-300, #e5e7eb)" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fill: 'var(--color-gray-500, #6b7280)', fontSize: 12 }}
        />
        <PolarRadiusAxis domain={[0, MAX]} tick={false} axisLine={false} />
        <Radar
          name="スコア"
          dataKey="value"
          stroke="var(--color-primary-600, #FF6B00)"
          fill="var(--color-primary-600, #FF6B00)"
          fillOpacity={0.20}
          strokeWidth={2}
          dot={false}
        />
        {/* ★ ツールチップ：上段はラベル、下段は数値のみ */}
        <Tooltip
          separator=""                                  // 「名前: 値」の区切りを消す
          labelFormatter={(label: unknown) => String(label)} // 上段タイトル（例：知識）
          formatter={(val: unknown) => {
            const v = typeof val === 'number' ? val : Number(val);
            return [String(v), ""];                    // 下段は「18」だけ、名前は空
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
