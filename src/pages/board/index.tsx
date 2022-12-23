import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { FormEvent, useState } from 'react';

import { db } from '../../services/firebaseConnection';

import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import {
  FiCalendar,
  FiClock,
  FiEdit2,
  FiPlus,
  FiTrash,
  FiX,
} from 'react-icons/fi';
import { SupportButton } from '../../components/SupportButton';
import styles from './styles.module.scss';

type TaskList = {
  id: string;
  created: string | Date;
  createdFormatted?: string;
  tarefa: string;
  userId: string;
  nome: string;
};

interface BoardProps {
  user: {
    id: string;
    name: string;
    vip: boolean;
    lastDonate: string | Date;
  };
  data: string;
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState('');
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));

  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

  async function handleAddTask(e: FormEvent<HTMLInputElement>) {
    e.preventDefault();

    if (input === '') {
      alert('Insira alguma tarefa');
      return;
    }

    if (taskEdit) {
      await db.collection('tarefas').doc(taskEdit.id).update({
        tarefa: input
      })
      .then (() => {
        console.log('Editado com sucesso!');
        let data = taskList;
        let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
        data[taskIndex].tarefa = input

        setTaskList(data);
        setTaskEdit(null);
        setInput("");
      })
      return
    }

    await db
      .collection('tarefas')
      .add({
        created: new Date(),
        tarefa: input,
        userId: user.id,
        nome: user.nome,
      })
      .then((doc) => {
        console.log('Cadastrado com sucesso!');

        let data = {
          id: doc.id,
          created: new Date(),
          createdFormatted: format(new Date(), 'dd MMMM yyyy'),
          tarefa: input,
          userId: user.id,
          nome: user.nome,
        };

        setTaskList([...taskList, data]);
        setInput('');
      })
      .catch((err) => {
        console.log('Erro ao cadastrar: ' + err.message);
      });
  }

  async function handleDeleteTask(id: string) {
    await db
      .collection('tarefas')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Deletado com sucesso!');

        let taskDeleted = taskList.filter((item) => {
          return item.id !== id;
        });
        setTaskList(taskDeleted);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async function handleEditTask(task: TaskList) {
    setTaskEdit(task);
    setInput(task.tarefa);
  }

  function handleCancelEdit() {
    setInput('');
    setTaskEdit(null);
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warnText}>
              Você está editando uma tarefa!
              <button onClick={handleCancelEdit}>
              <FiX size={30} color="#FF3633" />
            </button>
          </span>
        )}

        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Digite sua tarefa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <FiPlus size={25} color="#17181f" />
          </button>
        </form>

        <h1>
          Você tem {taskList.length}{' '}
          {taskList.length > 1 ? 'Tarefas' : 'Tarefa'}!
        </h1>

        <section>
          {taskList.map((task) => (
            <article className={styles.taskList} key={task.id}>
              <Link href={`board/${task.id}`}>
                <p>{task.tarefa}</p>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#FFB800" />
                    <time>{task.createdFormatted}</time>
                  </div>

                  {user.vip && (
                    <button onClick={() => handleEditTask(task)}>
                      <FiEdit2 size={20} color="#FFFFFF" />
                      <span>Editar</span>
                    </button>
                  )}
                </div>

                <button onClick={() => handleDeleteTask(task.id)}>
                  <FiTrash size={20} color="#FF3636" />
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {user.vip && (
        <div className={styles.vipContainer}>
          <h3>Obrigado por apoiar esse projeto</h3>
          <div>
            <FiClock size={28} color="#FFF" />
            <time> Última doação foi {formatDistance(new Date(user.lastDonate), new Date(), {locale: ptBR})}.</time>
          </div>
        </div>
      )}

      <SupportButton />
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

  const tasks = await db
    .collection('tarefas')
    .where('userId', '==', session?.id)
    .orderBy('created', 'asc')
    .get();

  const data = JSON.stringify(
    tasks.docs.map((items) => {
      return {
        id: items.id,
        createdFormatted: format(items.data().created.toDate(), 'dd MMMM yyyy'),
        ...items.data(),
      };
    })
  );

  const user = {
    nome: session.user?.name,
    id: session?.id,
    vip: session.vip,
    lastDonate: session.lastDonate
  };

  return {
    props: {
      user,
      data,
    },
  };
};
