import { signIn, signOut, useSession } from 'next-auth/react';

import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

export function SignInButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <button
          type="button"
          className={styles.signInButton}
          onClick={() => signOut()}
        >
          <div>
            <Image
              width={35}
              height={35}
              src={session.user?.image}
              alt="Foto do usuário"
            />
          </div>
          Olá {session.user?.name}
          <FiX color="#737380" className={styles.closeIcon} />
        </button>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className={styles.signInButton}
        onClick={() => signIn()}
      >
        <FaGithub color="#FFB800" />
        Entrar com github
      </button>
    </>
  );
}
