import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { MotiView } from 'moti';
import { LoanTheme } from '@/constants/loan-theme';
import { useCountUp } from '@/hooks/use-count-up';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = { progress: number; amountLeftLabel?: string };

const ANCHORS = [
  { p: 0, x: 20, y: 190 },
  { p: 25, x: 60, y: 110 },
  { p: 50, x: 110, y: 60 },
  { p: 75, x: 180, y: 100 },
  { p: 100, x: 260, y: 80 },
];

function getWalkerPosition(progress: number) {
  const clamped = Math.max(0, Math.min(100, progress));
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const a = ANCHORS[i];
    const b = ANCHORS[i + 1];
    if (clamped >= a.p && clamped <= b.p) {
      const t = (clamped - a.p) / (b.p - a.p);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  return { x: ANCHORS[0].x, y: ANCHORS[0].y };
}

export function ProgressTrail({ progress, amountLeftLabel }: Props) {
  const walker = getWalkerPosition(progress);
  const displayed = useCountUp(progress);

  const cx = useSharedValue(walker.x);
  const cy = useSharedValue(walker.y);

  useEffect(() => {
    cx.value = withTiming(walker.x, { duration: 900 });
    cy.value = withTiming(walker.y, { duration: 900 });
  }, [walker.x, walker.y]);

  const animatedProps = useAnimatedProps(() => ({ cx: cx.value, cy: cy.value }));

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={styles.card}
    >
      <Svg viewBox="0 0 300 220" style={styles.svg}>
        <Path
          d="M 20 190 Q 70 150 60 110 Q 50 70 110 60 Q 170 50 180 100 Q 190 150 250 130 Q 280 118 270 90"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="1 14"
          opacity={0.5}
        />
        {ANCHORS.slice(1, -1).map((a) => (
          <React.Fragment key={a.p}>
            <Circle
              cx={a.x}
              cy={a.y}
              r={a.p <= progress ? 8 : 6}
              fill="#FFFFFF"
              opacity={a.p <= progress ? 1 : 0.5}
            />
            <SvgText x={a.x} y={a.y - 14} fontSize={11} fill="#FFFFFF" opacity={a.p <= progress ? 1 : 0.6} textAnchor="middle">
              {a.p}%
            </SvgText>
          </React.Fragment>
        ))}

        <Path
          d={`M ${ANCHORS[4].x - 15} ${ANCHORS[4].y + 22} l 15 -14 l 15 14 v 18 h -30 z`}
          fill="#FFFFFF"
          opacity={progress >= 100 ? 1 : 0.5}
        />

        <AnimatedCircle animatedProps={animatedProps} r={10} fill="#FFFFFF" />
      </Svg>

      <Text style={styles.percent}>{displayed}% of the way there</Text>
      {amountLeftLabel ? <Text style={styles.subtitle}>{amountLeftLabel}</Text> : null}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: LoanTheme.primary, borderRadius: 20, padding: 20, alignItems: 'center' },
  svg: { width: '100%', height: 180 },
  percent: { color: '#FFFFFF', fontSize: 26, fontWeight: '600', marginTop: 8 },
  subtitle: { color: '#FFFFFF', opacity: 0.85, fontSize: 13, marginTop: 2 },
});