import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, withRepeat, withSequence, Easing } from 'react-native-reanimated';
import { MotiView } from 'moti';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { LoanTheme } from '@/constants/loan-theme';
import { useCountUp } from '@/hooks/use-count-up';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPulseCircle = Animated.createAnimatedComponent(Circle);

type Props = { progress: number; amountLeftLabel?: string };

const ANCHORS = [
  { p: 0, x: 36, y: 182 },
  { p: 25, x: 96, y: 132 },
  { p: 50, x: 156, y: 86 },
  { p: 75, x: 220, y: 108 },
  { p: 100, x: 286, y: 92 },
];

function buildTrailPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';

  const commands = [`M ${points[0].x} ${points[0].y}`];

  for (let i = 0; i < points.length - 1; i += 1) {
    const previous = points[Math.max(0, i - 1)];
    const current = points[i];
    const next = points[i + 1];
    const following = points[Math.min(points.length - 1, i + 2)];

    const cp1x = current.x + (next.x - previous.x) / 6;
    const cp1y = current.y + (next.y - previous.y) / 6;
    const cp2x = next.x - (following.x - current.x) / 6;
    const cp2y = next.y - (following.y - current.y) / 6;

    commands.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`);
  }

  return commands.join(' ');
}

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
  const trailPath = buildTrailPath(ANCHORS.map((anchor) => ({ x: anchor.x, y: anchor.y })));

  const cx = useSharedValue(walker.x);
  const cy = useSharedValue(walker.y);
  const pulseRadius = useSharedValue(18);
  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    cx.value = withTiming(walker.x, { duration: 900 });
    cy.value = withTiming(walker.y, { duration: 900 });
    pulseRadius.value = withRepeat(
      withSequence(
        withTiming(24, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(14, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.02, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [cx, cy, pulseRadius, pulseOpacity, walker.x, walker.y]);

  const animatedProps = useAnimatedProps(() => ({ cx: cx.value, cy: cy.value }));
  const pulseProps = useAnimatedProps(() => ({ r: pulseRadius.value, opacity: pulseOpacity.value }));

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={styles.card}
    >
      <ExpoLinearGradient
        colors={[LoanTheme.primary, '#4F7D6A']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.badgeRow}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Momentum</Text>
        </View>
        <View style={styles.dot} />
      </View>

      <Svg viewBox="0 0 320 220" style={styles.svg}>
        <Defs>
          <LinearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="100%" stopColor={LoanTheme.accentLight} stopOpacity="0.95" />
          </LinearGradient>
        </Defs>
        <Path
          d={trailPath}
          fill="none"
          stroke="url(#trailGradient)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray="1 14"
          opacity={0.8}
        />

        <Circle cx={ANCHORS[4].x} cy={ANCHORS[4].y} r={20} fill="rgba(255,255,255,0.95)" />
        <Circle cx={ANCHORS[4].x} cy={ANCHORS[4].y} r={13} fill={LoanTheme.primary} />
        <SvgText x={ANCHORS[4].x} y={ANCHORS[4].y + 6} fontSize={13} textAnchor="middle">
          🏠
        </SvgText>

        <AnimatedPulseCircle animatedProps={pulseProps} cx={walker.x} cy={walker.y} fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeOpacity={0.95} />
        <AnimatedCircle animatedProps={animatedProps} r={10} fill={LoanTheme.primary} />
        <Circle cx={walker.x} cy={walker.y} r={18} fill="rgba(255,255,255,0.98)" />
        <SvgText x={walker.x} y={walker.y + 6} fontSize={13} textAnchor="middle">
          🔑
        </SvgText>
      </Svg>

      <Text style={styles.percent}>{displayed}% of the way there</Text>
      {amountLeftLabel ? <Text style={styles.subtitle}>{amountLeftLabel}</Text> : null}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: LoanTheme.primary,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },
  badgeRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    zIndex: 1,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  pillText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: LoanTheme.accentLight,
  },
  svg: { width: '106%', height: 240, zIndex: 1, marginTop: -8, marginBottom: 2, marginLeft: -3, marginRight: -3 },
  pulseRing: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.9)',
    marginLeft: -29,
    marginTop: -29,
    zIndex: 1,
  },
  emojiBubble: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginLeft: -28,
    marginTop: -28,
    zIndex: 2,
  },
  emoji: { fontSize: 24 },
  percent: { color: '#FFFFFF', fontSize: 24, fontWeight: '600', marginTop: 2, zIndex: 1 },
  subtitle: { color: '#FFFFFF', opacity: 0.9, fontSize: 13, marginTop: 3, zIndex: 1 },
});