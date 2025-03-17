import Footer from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import { ReactNode } from "react";
import StoreProvider from "./StoreProvider";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <StoreProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </StoreProvider>
    </>
  );
}
