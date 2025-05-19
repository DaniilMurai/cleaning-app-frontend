import { createContext } from "react";
import { PortalContextType } from "./types";

const PortalContext = createContext<PortalContextType>(undefined!);
export default PortalContext;
