'use client';

import type { Booking, BookingSerializable } from '@/schemas/Booking';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Button, FormLabel, Input, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useId, useState, type CSSProperties, type FormEvent } from 'react';
import { DateTime } from 'luxon';
import { inRange } from 'lodash';
import { isStringNumber } from '@mui/x-date-pickers/internals/hooks/useField/useField.utils';

type Props = {
  onSubmit?: (booking: Omit<Booking, 'bookedUserEmail' | '_id'>) => void;
  washingMachineId: string;
  style?: CSSProperties;
};

export function BookingForm({ style, onSubmit, washingMachineId }: Props) {
  const t = useTranslations('Booking');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [fromTime, setFromTime] = useState(DateTime.now().plus({ minutes: 5 }));
  const DEFAULT_ADVANCE_HOURS = 1;
  const [upToTime, setUpToTime] = useState(
    DateTime.now().plus({ minutes: 5 }).plus({ hour: DEFAULT_ADVANCE_HOURS }),
  );
  const [roomNumber, setRoomNumber] = useState('000');
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  const washingMachineInputId = `washing-machine-input-${id}`;
  const firstnameInputId = `firstname-input-${id}`;
  const lastnameInputId = `lastname-input-${id}`;
  const roomNumberInputId = `room-number-input-${id}`;
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const FIRSTNAME_MIN_LENGTH = 1;
    const FIRSTNAME_MAX_LENGTH = 20;
    const LASTNAME_MIN_LENGTH = 1;
    const LASTNAME_MAX_LENGTH = 20;
    const ROOM_NUMBER_LENGTH = 3;
    if (
      !inRange(firstname.length, FIRSTNAME_MIN_LENGTH, FIRSTNAME_MAX_LENGTH + 1)
    ) {
      setError(t('firstnameLengthError'));
      return;
    }
    if (
      !inRange(lastname.length, LASTNAME_MIN_LENGTH, LASTNAME_MAX_LENGTH + 1)
    ) {
      setError(t('lastnameLengthError'));
      return;
    }
    if (
      roomNumber.length !== ROOM_NUMBER_LENGTH ||
      !roomNumber.split('').every((digit) => !isNaN(Number(digit)))
    ) {
      setError(t('roomNumberError'));
      return;
    }
    if (upToTime.toMillis() < fromTime.toMillis()) {
      setError(t('bookEndTimeLessThanBookStartTimeError'));
      return;
    }
    const HALF_AN_HOUR = 30 * 60 * 1_000;
    if (upToTime.diff(fromTime).toMillis() <= HALF_AN_HOUR) {
      setError(t('bookTooShortError'));
      return;
    }
    const FIVE_HOURS = 5 * 60 * 60 * 1_000;
    if (upToTime.diff(fromTime).toMillis() > FIVE_HOURS) {
      setError(t('bookTooLongError'));
      return;
    }
    const ONE_DAY = 24 * 60 * 60 * 1_000;
    if (upToTime.diffNow().toMillis() > ONE_DAY) {
      setError(t('bookInTooAdvanceError'));
      return;
    }
    if (fromTime.toMillis() < DateTime.now().toMillis()) {
      setError(t('bookInThePastError'));
      return;
    }
    if (
      inRange(fromTime.setZone('UTC+3').hour, 0, 7) ||
      inRange(upToTime.setZone('UTC+3').hour, 0, 7)
    ) {
      setError(t('bookInNotWorkingIntervalError'));
      return;
    }
    setError(null);
    if (onSubmit) {
      onSubmit({
        firstname,
        lastname,
        fromTime: fromTime.toJSDate(),
        upToTime: upToTime.toJSDate(),
        roomNumber,
        washingMachineId: washingMachineId,
      });
    }
  }
  function handleFromTimeChange(newFromTime: DateTime<true>) {
    if (newFromTime.toMillis() > upToTime.toMillis()) {
      setUpToTime(newFromTime);
    }
    setFromTime(newFromTime);
  }
  return (
    <div style={{ ...style, position: 'relative' }}>
      <form
        className="top-0 left-0 right-0 bottom-0 relative"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between m-1">
          <FormLabel htmlFor={washingMachineInputId}>
            {t('washingMachine')}
          </FormLabel>
          <Input id={washingMachineInputId} value={washingMachineId} disabled />
        </div>
        <div className="flex justify-between m-1">
          <FormLabel htmlFor={firstnameInputId}>{t('firstname')}</FormLabel>
          <Input
            id={firstnameInputId}
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="flex justify-between m-1">
          <FormLabel htmlFor={lastnameInputId}>{t('lastname')}</FormLabel>
          <Input
            id={lastnameInputId}
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="flex justify-between m-1">
          <FormLabel htmlFor={roomNumberInputId}>{t('roomNumber')}</FormLabel>
          <Input
            id={roomNumberInputId}
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        </div>
        <div className="flex justify-between my-3">
          <DateTimePicker
            label={t('fromTime')}
            value={fromTime}
            onChange={(newFromTime) =>
              newFromTime && handleFromTimeChange(newFromTime)
            }
            minDateTime={DateTime.now()}
            maxDateTime={DateTime.now().plus({ day: 1 })}
          />
          <DateTimePicker
            label={t('upToTime')}
            value={upToTime}
            onChange={(newUpToTime) => newUpToTime && setUpToTime(newUpToTime)}
            minDateTime={fromTime}
            maxDateTime={DateTime.now().plus({ day: 1 })}
          />
        </div>
        {error ? (
          <Typography variant="body1" className="text-red-500">
            {error}
          </Typography>
        ) : null}
        <Button variant="contained" type="submit">
          {t('reserve')}
        </Button>
      </form>
    </div>
  );
}
