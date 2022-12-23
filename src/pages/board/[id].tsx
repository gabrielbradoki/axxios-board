import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { getSession } from "next-auth/react";
import { db } from '../../services/firebaseConnection';

import Head from 'next/head';
import { FiCalendar } from 'react-icons/fi';
import styles from "./task.module.scss";


type Task = {
  id: string;
  created: string | Date;
  createdFormatted?: string;
  tarefa: string;
  userId: string;
  nome: string;
}



interface TaskListProps {
  data: string;
}

export default function Task({ data }: TaskListProps) {
  const task = JSON.parse(data) as Task;

  return (
  <>
  <Head>
    <title>
      Detalhes da tarefa
    </title>
  </Head>
    <article className={styles.container}>
      <div className={styles.actions}>
        <div>
          <FiCalendar size={30} color="#FFFFFF" />
          <span>Tarefa criada: </span>
          <time>{task.createdFormatted}</time>
        </div>
      </div>
      <p>{task.tarefa}</p>
    </article>
  </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const { id } = params;
  const session = await getSession({ req });

  if (!session?.vip) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const data = await db.collection('tarefas').doc(String(id)).get().then((snapshot) => {
    const data = {
      id: snapshot.id,
      created: snapshot.data().created,
      createdFormatted: format(snapshot.data().created.toDate(), 'dd mmmm yyyy'),
      tarefa: snapshot.data().tarefa,
      userId: snapshot.data().userId,
      nome: snapshot.data().nome,
    }

    return JSON.stringify(data);
  })
  .catch(() => {
    return {}
  });

  if(Object.keys(data).length === 0) {
    return {
      redirect: {
        destination: '/board',
        permanent: false,
      },
    };
  }

  return {
    props: { data },
  };
};
