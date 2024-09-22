'use client';

import { Box, Button, FormControl, FormHelperText, FormLabel, TextareaAutosize } from "@mui/material";
import { useId, useRef, type ChangeEvent, type CSSProperties, type FormEvent } from "react";

type Props = {
  tags: string[];
  label: string;
  onChange?: (newTags: string[]) => void;
  onSave?: (tags: string[]) => void;
}

export default function TagsEditList({ tags, onSave, label }: Props) {
  const concatenatedTags = tags.join('\n');
  function handleSubmit(event: FormEvent<HTMLDivElement>) {
    event.preventDefault();
    const newConcatenatedTags: string = textareaRef.current!.value;
    const newSplittedTags = newConcatenatedTags.split('\n');
    if (onSave) {
      onSave(newSplittedTags);
    }
  }
  const id = useId();
  const textareaId = `textarea-${id}`;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  return (
    <FormControl onSubmit={handleSubmit}>
      <Box>
        <FormLabel htmlFor={textareaId}>{ label }</FormLabel>
        <TextareaAutosize ref={textareaRef} id={textareaId} defaultValue={concatenatedTags} className='w-2/3 block resize mb-3' placeholder={label} />
        <Button type='submit' color='primary' variant='contained' onClick={() => onSave && onSave(tags)}>save</Button>
        <FormHelperText>{ label }</FormHelperText>
      </Box>
    </FormControl>
  )
}