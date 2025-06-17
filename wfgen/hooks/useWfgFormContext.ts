import { createContext, useContext } from "react";
import type { WfgFormContext } from "@wfgen/types";

export const FormContext = createContext<WfgFormContext | null>(null);
export const useWfgFormContext = () => useContext(FormContext)!;