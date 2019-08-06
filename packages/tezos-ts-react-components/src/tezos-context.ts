import { TezosToolkit } from "@tezos-ts/tezos-ts";
import React from "react";

export const TezosContext = React.createContext(new TezosToolkit());
