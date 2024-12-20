import { Typography } from '@mui/material';
import { mapValues } from 'lodash';
import { DateTime } from 'luxon';
import type React from 'react';

export type Event = {
  startTime: Date;
  endTime: Date;
  isRemovable: boolean;
  label: string;
  id: string;
};

type EventsMap<DayLabel extends string> = {
  [day in DayLabel]: Event[];
};

type Props<DayLabel extends string> = {
  events: EventsMap<DayLabel>;
  daysOrder: DayLabel[];
  daysLabels?: Record<DayLabel, string>;
  timeColumnHeader?: string;
  onDeleteEventClick?: (eventId: string) => void;
  style: React.CSSProperties;
};

function range(upTo: number): number[] {
  return new Array(upTo).fill(void 0).map((_, index) => index);
}

function computeProportionsForEvents(
  minTime: number,
  maxTime: number,
  timeValues: [number, number][],
): number[] {
  if (timeValues.length === 0) {
    return [1];
  }
  const span = maxTime - minTime;
  const result: number[] = [];
  const sortedTimeValues = timeValues.toSorted(
    ([start1], [start2]) => start1 - start2,
  );

  function normalize(value: number): number {
    return value / span;
  }

  let lastRecorded = minTime;
  for (const [currentStart, currentEnd] of sortedTimeValues) {
    result.push(currentStart - lastRecorded);
    result.push(currentEnd - currentStart);
    lastRecorded = currentEnd;
  }
  result.push(maxTime - lastRecorded);

  return result.map(normalize);
}

export default function Timetable<DayLabel extends string>({
  style,
  events,
  daysOrder,
  daysLabels,
  timeColumnHeader = 'TIME',
  onDeleteEventClick,
}: Props<DayLabel>) {
  events = mapValues(events, (eventsOfDay) => {
    return eventsOfDay.toSorted(({ startTime: time1 }, { startTime: time2 }) => time1.getTime() - time2.getTime());
  })
  const MIN_TIME = 7;
  const MAX_TIME = 24;
  const MIN_DATE_TIME = DateTime.fromObject(
    { hour: MIN_TIME, minute: 0, second: 0, millisecond: 0 },
    { locale: 'ru-RU', zone: 'UTC+3' },
  );
  const columnsCount = daysOrder.length + 1;
  const rowsCount = (MAX_TIME - MIN_TIME) * 2 + 1;
  const timeValues = range(rowsCount - 1).map((shiftValue) => {
    return MIN_DATE_TIME.plus({ hour: shiftValue / 2 });
  });

  return (
    <div
      style={{
        ...style,
        display: 'grid',
        gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
        gridTemplateRows: `repeat(${rowsCount}, 1fr)`,
      }}
    >
      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          zIndex: 5,
        }}
        className="border-b-2 border-r-2 border-slate-800 text-center"
      >
        {timeColumnHeader}
      </div>
      {timeValues.map((timeValue, rowIndex) => (
        <div
          key={`time-values-${rowIndex}`}
          style={{
            gridColumn: 1,
            gridRow: rowIndex + 2,
            zIndex: 5,
          }}
          className="border-r-2 border-slate-800 text-center"
        >
          {timeValue.setLocale('ru').toLocaleString(DateTime.TIME_SIMPLE)}
        </div>
      ))}
      {range(rowsCount).map((rowIndex) => (
        <div
          key={`tone-${rowIndex}`}
          style={{
            gridColumn: `1 / span ${columnsCount}`,
            gridRow: rowIndex + 1,
            zIndex: 1,
          }}
          className={rowIndex % 2 === 1 ? 'bg-slate-300' : 'bg-slate-50'}
        ></div>
      ))}
      {range(columnsCount - 1).map((columnIndex) => (
        <div
          key={`events-labels-${columnIndex}`}
          style={{
            gridColumn: columnIndex + 2,
            gridRow: 1,
            zIndex: 5,
          }}
          className="border-b-2 border-slate-800 text-center"
        >
          {daysLabels !== undefined && daysOrder[columnIndex] in daysLabels
            ? daysLabels[daysOrder[columnIndex]]
            : daysOrder[columnIndex]}
        </div>
      ))}
      {range(columnsCount - 1).map((columnIndex) => {
        const todaysEvents = events[daysOrder[columnIndex]];
        if (todaysEvents.length === 0) {
          return (
            <div
              key={`events-column-${columnIndex}`}
              style={{
                gridColumn: columnIndex + 2,
                gridRow: `2 / span ${rowsCount - 1}`,
                zIndex: 10,
              }}
            >
              no events
            </div>
          );
        }
        const theEvent = todaysEvents.at(0)!;
        const theStartTime = DateTime.fromJSDate(theEvent.startTime).setZone('UTC+3');
        const gridTemplateRowsProportions = computeProportionsForEvents(
          theStartTime.set({ hour: 7, minute: 0, second: 0, millisecond: 0, }).toMillis(),
          theStartTime.set({ hour: 23, minute: 59, second: 59, millisecond: 999, }).toMillis(),
          todaysEvents.map(({ startTime, endTime }) => [
            startTime.getTime(),
            endTime.getTime(),
          ]),
        );
        return (
          <div
            key={`events-column-${columnIndex}`}
            style={{
              gridColumn: columnIndex + 2,
              gridRow: `2 / span ${rowsCount - 1}`,
              zIndex: 10,
              display: 'grid',
              gridTemplateColumns: '1fr',
              gridTemplateRows: gridTemplateRowsProportions
                .map((proportion) => `${proportion}fr`)
                .join(' '),
            }}
          >
            {todaysEvents.map(({ label, startTime, endTime, isRemovable, id,  }, eventIndex) => (
              <div
                key={`event-${id}`}
                style={{
                  gridColumn: 1,
                  gridRow: 2 * eventIndex + 2,
                }}
                className={`${isRemovable ? 'bg-green-300' : 'bg-orange-400' } bg-opacity-80 text-center overflow-y-auto relative`}
              >
                {
                  isRemovable ? (
                    <button className="absolute top-0 right-1 cursor-pointer bg-slate-100 bg-opacity-75 rounded-md" onClick={() => onDeleteEventClick && onDeleteEventClick(id)}>
                      <Typography variant='button'>X</Typography>
                    </button>
                  ) : null
                }
                <span>{label}</span>
                <br />
                <span>
                  {DateTime.fromJSDate(startTime, { zone: 'UTC+3' })
                    .setLocale('ru')
                    .toLocaleString(DateTime.TIME_SIMPLE)}{' '}
                  -
                  {DateTime.fromJSDate(endTime, { zone: 'UTC+3' })
                    .setLocale('ru')
                    .toLocaleString(DateTime.TIME_SIMPLE)}
                </span>
              </div>
            ))}
          </div>
        );
      })}
      <div
        style={{
          gridColumn: `2 / span ${columnsCount - 1}`,
          gridRow: `2 / span ${rowsCount - 1}`,
        }}
      ></div>
    </div>
  );
}
