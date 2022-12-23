import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { db } from '../services/firebaseConnection';
import styles from '../styles/styles.module.scss';

import boardUser from '../../public/images/board-user.svg';

type Data = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string;
}

interface HomeProps {
  data: string;
}

export default function Home({ data }: HomeProps) {

  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data));

  return (
    <>
      <Head>
        <title>Board - Organizando </title>
      </Head>
      <main className={styles.contentContainer}>
        <Image src={boardUser} alt='Ferramenta board'/>
        <section className={styles.callToAction}>
          <h1>Uma ferramenta para seu dia a dia Escreva, planeje e organize-se..</h1>
          <p>
            <span>100% Gratuita</span> e online
          </p>

            {donaters.length !== 0 && <h3>Apoiadores:</h3>}
            <div className={styles.donaters}>
              {donaters.map(photo => (
                <Image key={photo.image} src={photo.image} width={65} height={65} alt="Usuarios" />
             ) )}
             </div>
        </section>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const donaters = await db.collection('vip-users').get();

  const data = JSON.stringify(donaters.docs.map( u => {
    return {
      id: u.id,
      ...u.data(),
    }
  }))

  return {
    props: {
      data,
    },
    revalidate: 60 * 60
  }
}
