'use client';

import type { Booking, BookingSerializable } from "@/schemas/Booking";
import { Button, FormLabel, Input } from "@mui/material";
import { useTranslations } from "next-intl";
import { useId, useState, type CSSProperties, type FormEvent } from "react";

type Props = {
  onSubmit?: (booking: Omit<Booking, 'bookedUserEmail'>) => void;
  style?: CSSProperties;
}

export function BookingForm({ style, onSubmit }: Props) {
  const t = useTranslations('Booking');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const id = useId();
  const firstnameInputId = `firstname-input-${id}`;
  const lastnameInputId = `lastname-input-${id}`;
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        firstname,
        lastname,
        fromTime: new Date(Date.now() + 1e4),
        upToTime: new Date(Date.now() + 2e4),
        roomNumber: '666',
        washingMachineId: '1',
      })
    }
  }
  return (
    <div style={{...style, position: 'relative' }}>
      <form className='top-0 left-0 right-0 bottom-0 relative' onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <FormLabel htmlFor={firstnameInputId}>{ t('firstname') }</FormLabel>
          <Input id={firstnameInputId} value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        </div>
        <div className="flex justify-between">
          <FormLabel htmlFor={lastnameInputId}>{ t('lastname') }</FormLabel>
          <Input id={lastnameInputId} value={lastname} onChange={(e) => setLastname(e.target.value)} />
        </div>
        <Button type="submit">{ t('reserve') }</Button>
      </form>
    </div>
  )
}