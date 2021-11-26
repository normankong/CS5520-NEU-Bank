import * as React from 'react';
import AccountSum from "./AccountSum";

export default function Screen(navigation) {
  return (
    <>
     <AccountSum navigation={navigation}></AccountSum>
    </>
  );
}