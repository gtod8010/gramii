"use client";
import React from "react";
import OrdaHomePage from "@/components/rootPage/OrdaHomePage";
import GramiiHomePage from "@/components/rootPage/GramiiHomePage";

const RootPage = () => {
  const siteVariant = process.env.NEXT_PUBLIC_SITE_VARIANT;

  if (siteVariant === 'gramii') {
    return <GramiiHomePage />;
  }
  
  if (siteVariant === 'orda') {
    return <OrdaHomePage />;
  }

  // Fallback for safety
  return <GramiiHomePage />;
};

export default RootPage; 
