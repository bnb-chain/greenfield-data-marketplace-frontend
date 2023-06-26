import { Icon, IconProps } from '@totejs/icons';

export const CollectionLogo = (props: IconProps) => {
  return (
    <Icon
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <rect width="10" height="10" fill="url(#patternColl)" />
      <defs>
        <pattern
          id="patternColl"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_555_132748" transform="scale(0.0384615)" />
        </pattern>
        <image
          id="image0_555_132748"
          width="26"
          height="26"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB+UlEQVR4nN2VPWsVURCGF/GjtpA7s4E0KqiNWNhIBIUUir8gBPz8A/6OIBY24h8QrES4+FlE884iASEIImnSGEMEUcn1g2Tn6JE5yTneza4W190mA1Oc2WGf3ffdncmyHRda9C4o6L0DLZRFfspqG0V+woH7Cl5zwo8U+WTqRz7pQI/tmgrd9eBxq/vnY4cdqFDQsoLO10GgZSfsYyr4w/A51YW+WNbq4J8KWlHwr6Hed02gxaYb/08q+G0N5JBfjQ1RulGiBE8kGOhSrcG/yvYoeGANo0JibL3Nmp/NdvuCjzjwfPLMPzy0T4W/tgga2MM78PWKZ67Ir8RCGyBnOcdTHuP7FfQjeebAL1oHCT0LZ9CD5JkKfW4bpKBPdlbwTPSsa9DN6JldnO1OOu5Hz0zHi+2DeHrzjeh7Avs3x/a2/B8NglTbpezghx00gpz0LqcRBJ4YFVIKn/4zgvia1VR4NUnXzVClxQAC306e1daE0MfmNcHfLP+2Qlz1HNaEgm4lKW3gBRio8C/pqDV4OXBQhe+FxQd6onN0zvtsl6X1O6GnwVdwvyzo5OZNe2ec0GuDWP+WdEvDnlVCpXd2A2PHR/4i/uFZJWwA2tYMK1z4hhO6r0LrQ7Kshxp4xmaZgsv4ZanwnSCX8FKTZ9tA3XlWiS49y3ZU/AZbs0GZYgyojgAAAABJRU5ErkJggg=="
        />
      </defs>
    </Icon>
  );
};
