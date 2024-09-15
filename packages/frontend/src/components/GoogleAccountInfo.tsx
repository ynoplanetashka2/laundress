'use client';
import { Skeleton } from "@mui/material";
import { isNil } from "lodash";
import { useSession } from "next-auth/react";
import Image from "next/image";

function InlineSkeleton({ width }: { width: string }) {
  return <Skeleton style={{ display: 'inline-block' }} width={width} />;
}

export default function GoogleAccountInfo() {
  const { status, data } = useSession();
  if (status === 'unauthenticated' ) {
    return <span> unauthenticated </span>
  }
  if (status === 'loading') {
    return (<>
      <span> <InlineSkeleton width="300px" /> <br /> <InlineSkeleton width="300px" /> </span>
      <Skeleton variant="circular" width="100px" height="100px" />
    </>);
  }
  if (!data?.user) {
    console.error('unreachable');
    return null;
  }
  const { user } = data;
  if (!user) {
    return <span> not user data </span>
  }
  const { email, image, name } = user;
  
  return (
    <>
      <span> { email } <br /> { name } </span>
      {
        !isNil(image) 
        ? <Image src={image} alt="Your account icon" width="100" height="100" style={{ borderRadius: '50%' }} />
        : <span> no image </span>
      }
    </>
  );
}