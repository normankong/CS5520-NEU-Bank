import * as React from 'react';
import Input from "./Input";

export default function Screen(navigation) {
  return (
    <>
     <Input navigation={navigation.navigation}></Input>
    </>
  );
}