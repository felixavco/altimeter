import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export interface SpinAnimationProps extends PropsWithChildren {
  duration?: number;
  isSpinning: boolean;
}
export function SpinAnimation({
  children,
  duration,
  isSpinning,
}: SpinAnimationProps) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (isSpinning) {
      animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: duration || 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      animation.start();
    } else {
      spinValue.setValue(0);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isSpinning, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      {children}
    </Animated.View>
  );
}
