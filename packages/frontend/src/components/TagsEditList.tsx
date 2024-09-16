'use client';

import type { ChangeEvent, CSSProperties } from "react";

type Props = {
  tags: string[];
  onChange?: (newTags: string[]) => void;
  onSave?: (tags: string[]) => void;
  style?: CSSProperties;
}

export default function TagsEditList({ tags, onChange, style, onSave }: Props) {
  const concatenatedTags = tags.join('\n');
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const newConcatenatedTags: string = event.target.value;
    const newSplittedTags = newConcatenatedTags.split('\n');
    if (onChange) {
      onChange(newSplittedTags);
    }
  }
  return (
    <div>
      <textarea value={concatenatedTags} onChange={handleChange} style={style}/> <br />
      <button onClick={() => onSave && onSave(tags)}>save</button>
    </div>
  )
}