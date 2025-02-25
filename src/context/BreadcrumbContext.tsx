"use client"

import React, { createContext, useReducer, useContext, ReactNode } from "react";


interface BreadcrumbItem {
  title: string;
  url?: string;
}

interface BreadcrumbContextType {
  items: BreadcrumbItem[];    
}

type BreadcrumbAction = { type: "SET_BREADCRUMB"; items: BreadcrumbItem[] }

const BreadcrumbContext = createContext<{
    state: BreadcrumbContextType;
    dispatch: React.Dispatch<BreadcrumbAction>;
} | undefined>(undefined);


const BreadcrumbReducer = (state: BreadcrumbContextType, action: BreadcrumbAction): BreadcrumbContextType =>{
    switch (action.type) {
        case "SET_BREADCRUMB":
            return { items: action.items };
        default:
            return state;
    }
};

export const BreadcrumbProvider = ({children}: {children: ReactNode}) => {
    const [state, dispatcher] = useReducer(BreadcrumbReducer, {items: []});
    return(
        <BreadcrumbContext.Provider value={{state, dispatch: dispatcher}}>
            {children}
        </BreadcrumbContext.Provider>
    )
}

export const useBreadcrumb = () => {
    const context = useContext(BreadcrumbContext);
    if(context === undefined){
        throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
    }
    return context;
}
