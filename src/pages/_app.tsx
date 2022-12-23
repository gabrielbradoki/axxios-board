import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SessionProvider as NextAuthProvider } from "next-auth/react";
import type { AppProps } from 'next/app';
import { Header } from "../components/Header";
import "../styles/global.scss";

const initialOptions = {
  "client-id": "Ac8jwygpmHDsVe8z3kegCI5oBCBS3m-n99AD2ZQL629fRgvgAg7FG1LQrw9AwlQgRG4T6tbqqU_bdXco",
  currency: "BRL",
  intent: "capture",
}

export default function App({ Component, pageProps}: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <PayPalScriptProvider options={initialOptions}>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </NextAuthProvider>
  )
}
