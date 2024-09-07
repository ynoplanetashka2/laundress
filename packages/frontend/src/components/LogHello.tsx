'use client';
import { useEffect } from "react";
import { getHello } from "@/api/getHello";

export function LogHello() {
  useEffect(() => {
    getHello().then((hello) => {
      console.log(`hello value: ${hello}`);
    });
  })

  return <></>
}