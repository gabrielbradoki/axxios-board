import Head from 'next/head';
import { useState } from 'react';
import styles from "./styles.module.scss";

import { PayPalButtons } from '@paypal/react-paypal-js';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { db } from '../../services/firebaseConnection';


interface DonateProps{
  user: {
    nome: string;
    id: string;
    image: string;
  }
}

export default function Donate({ user }: DonateProps) {

  const [vip, setVip] = useState(false);

  async function handleDonateSave() {
    await db.collection('vip-users')
    .doc(user.id)
    .set({
      donate: true,
      lastDonate: new Date(),
      image: user.image
    }).then(() => {
      setVip(true);
    })
  }

  return (
    <>
      <Head>
        <title>Ajude a plataforma board ficar online!</title>
      </Head>
      <main className={styles.container}>
        <Image src="/images/rocket.svg" alt="Seja Apoiador" />

        {vip && (
        <div className={styles.vip}>
          <Image src={user.image} width={50} height={50} alt="Foto apoiador" />
          <span>Parabéns {user.nome} você é um novo apoiador!</span>
        </div>
        )}

        <h1>Seja um apoiador desse projeto <Image src="/images/trophy.svg" alt='Trofeu apoiador' width={65}/></h1>
        <h3>
          Contribua com apenas <span>R$ 1,00</span>
        </h3>
        <strong>
          Apareça na nossa home, tenha funcionalidades exclusivas!
        </strong>

        <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: "1",
              }
            }]
          })
        }}
        onApprove={ (data, actions) => {
          return actions.order.capture().then(function(details){
            console.log('Compra aprovada: ' + details.payer.name?.given_name);
            handleDonateSave();
          })
        }}
        />

      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

  const session = await getSession({ req });

  if (!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = {
    nome: session?.user.name,
    id: session?.id,
    image: session?.user.image,
  }

  return {
    props: {
      user
    }
  }
}