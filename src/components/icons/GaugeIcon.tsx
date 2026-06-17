import Svg, { Circle, Path, type SvgProps } from "react-native-svg";

export function GaugeIcon(props: SvgProps) {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="M15.6 2.7a10 10 0 1 0 5.7 5.7" />
      <Circle cx="12" cy="12" r="2" />
      <Path d="M13.4 10.6 19 5" />
    </Svg>
  );
}
