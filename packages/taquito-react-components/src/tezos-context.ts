import { TezosToolkit } from "@taquito/taquito";
import React from "react";

export const TezosContext = React.createContext(new TezosToolkit());
