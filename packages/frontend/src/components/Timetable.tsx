import { DateTime, Zone, type WeekdayNumbers } from "luxon";
import type React from "react";

export type Event = {
  startTime: Date;
  endTime: Date;
  label: string;
}

type EventsMap<DayLabel extends string> = {
  [day in DayLabel]: Event[];
}

type Props<DayLabel extends string> = {
  events: EventsMap<DayLabel>;
  daysOrder: DayLabel[];
  timeColumnHeader?: string;
  style: React.CSSProperties;
}

function range(upTo: number): number[] {
  return new Array(upTo).fill(void 0).map((_, index) => index);
}

function getWeekday(date: Date): WeekdayNumbers {
  return DateTime.fromJSDate(date, { zone: 'UTC+3' }).weekday as WeekdayNumbers;
}

function computeProportionsForEvents(minTime: number, maxTime: number, timeValues: [number, number][]): number[] {
  if (timeValues.length === 0) {
    throw new TypeError('time spans can not be empty');
  }
  const span = maxTime - minTime;
  const result: number[] = [];
  const sortedTimeValues = timeValues.toSorted(([start1], [start2]) => start1 - start2);

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

export default function Timetable<DayLabel extends string>({ style, events, daysOrder, timeColumnHeader = 'TIME' }: Props<DayLabel>) {
  const MIN_TIME = 7
  const MAX_TIME = 18
  const MIN_DATE_TIME = DateTime.fromObject({ hour: MIN_TIME, minute: 0, second: 0, millisecond: 0, }, { locale: 'ru-RU', zone: 'UTC+3' })
  const MAX_DATE_TIME = DateTime.fromObject({ hour: MAX_TIME, minute: 0, second: 0, millisecond: 0, }, { locale: 'ru-RU', zone: 'UTC+3' })
  const columnsCount = daysOrder.length + 1;
  const rowsCount = (MAX_TIME - MIN_TIME) * 2 + 1;
  const timeValues = range(rowsCount - 1).map((shiftValue) => {
    return MIN_DATE_TIME.plus({ hour: shiftValue/2 });
  });

  return (
    <div style={{
      ...style,
      display: 'grid',
      gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
      gridTemplateRows: `repeat(${rowsCount}, 1fr)`,
    }}>
      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          zIndex: 5,
        }}
        className="border-b-2 border-r-2 border-slate-800 text-center"
      >
        { timeColumnHeader }
      </div>
      {
        timeValues.map((timeValue, rowIndex) => (
          <div 
            key={`time-values-${rowIndex}`}
            style={{
              gridColumn: 1,
              gridRow: rowIndex + 2,
              zIndex: 5,
            }}
            className="border-r-2 border-slate-800 text-center"
          >
            { timeValue.setLocale('ru').toLocaleString(DateTime.TIME_SIMPLE) }
          </div>
        ))
      }
      {
        range(rowsCount).map((rowIndex) => (
          <div 
            key={`tone-${rowIndex}`}
            style={{
              gridColumn: `1 / span ${columnsCount}`,
              gridRow: rowIndex + 1,
              zIndex: 1,
            }}
            className={ rowIndex % 2 === 1 ?  "bg-slate-300" : "bg-slate-50" }
          >
          </div>
        ))
      }
      {
        range(columnsCount - 1).map((columnIndex) => (
          <div 
            key={`events-labels-${columnIndex}`}
            style={{
              gridColumn: columnIndex + 2,
              gridRow: 1,
              zIndex: 5,
            }}
            className="border-b-2 border-slate-800 text-center"
          >
            { daysOrder[columnIndex] }
          </div>
        ))
      }
      {
        range(columnsCount - 1).map((columnIndex) => {
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
            )
          }
          const weekday = getWeekday((todaysEvents.at(0)!).startTime);
          const gridTemplateRowsProportions = computeProportionsForEvents(
            MIN_DATE_TIME.set({ weekday }).toMillis(),
            MAX_DATE_TIME.set({ weekday }).toMillis(),
            todaysEvents.map(({ startTime, endTime }) => [startTime.getTime(), endTime.getTime()])
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
                gridTemplateRows: gridTemplateRowsProportions.map((proportion) => `${proportion}fr`).join(' '),
              }}
            >
              {
                todaysEvents.map(({ label, startTime, endTime }, eventIndex) => (
                  <div
                    key={`event-${eventIndex}`}
                    style={{
                      gridColumn: 1,
                      gridRow: 2 * eventIndex + 2
                    }}
                    className="bg-orange-400 bg-opacity-80 text-center overflow-y-auto"
                  >
                    <span>{ label }</span>
                    <br />
                    <span>
                      { DateTime.fromJSDate(startTime, { zone: 'UTC+3' }).setLocale('ru').toLocaleString(DateTime.TIME_SIMPLE) } -
                      { DateTime.fromJSDate(endTime, { zone: 'UTC+3' }).setLocale('ru').toLocaleString(DateTime.TIME_SIMPLE) }
                    </span>
                  </div>
                ))
              }
            </div>
          )
        })
      }
      <div 
        style={{
          gridColumn: `2 / span ${columnsCount - 1}`,
          gridRow: `2 / span ${rowsCount - 1}`,
        }}
      >
      </div>
    </div>
  )
}