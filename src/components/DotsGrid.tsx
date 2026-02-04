import {DotStyle, rainbowColors} from "../lib/lifeDotsData";

type DotsGridProps = {
  total: number;
  filled: number;
  dotStyle: DotStyle;
  perRow: number;
  dotSize: number;
  gap: number;
};

const AXIS_OFFSET = 18;
const COLUMN_STEP = 13;
const ROW_STEP = 5;

export default function DotsGrid({
  total,
  filled,
  dotStyle,
  perRow,
  dotSize,
  gap
}: DotsGridProps) {
  const rows = Math.ceil(total / perRow);
  const cell = dotSize + gap;

  return (
    <div className="relative w-fit">
      <div className="relative group" style={{paddingTop: AXIS_OFFSET, paddingLeft: AXIS_OFFSET}}>
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
          {Array.from({length: perRow}).map((_, index) =>
            index === 0 || (index + 1) % COLUMN_STEP === 0 || index === perRow - 1 ? (
              <span
                key={`col-${index}`}
                className="absolute select-none text-[10px] text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-neutral-500"
                style={{
                  top: 0,
                  left: AXIS_OFFSET + index * cell + dotSize / 2,
                  transform: "translateX(-50%)"
                }}
              >
                {index + 1}
              </span>
            ) : null
          )}
          {Array.from({length: rows}).map((_, index) =>
            index === 0 || (index + 1) % ROW_STEP === 0 || index === rows - 1 ? (
              <span
                key={`row-${index}`}
                className="absolute select-none text-[10px] text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-neutral-500"
                style={{
                  left: 0,
                  top: AXIS_OFFSET + index * cell + dotSize / 2,
                  transform: "translateY(-50%)"
                }}
              >
                {index + 1}
              </span>
            ) : null
          )}
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${perRow}, ${dotSize}px)`,
            gap: `${gap}px`
          }}
        >
          {Array.from({length: total}).map((_, index) => (
            <span
              key={index}
              style={{height: dotSize, width: dotSize}}
              className={`${
                dotStyle === "classic" ? "rounded-full" : "rounded-sm"
              } ${
                index < filled
                  ? dotStyle === "classic"
                    ? "bg-neutral-900 dark:bg-white"
                    : rainbowColors[index % rainbowColors.length]
                  : "bg-neutral-200 dark:bg-neutral-800"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
