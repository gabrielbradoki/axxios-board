import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.svg";
import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <Image src={logo} alt="logo" />
        </Link>
        <nav>
          <Link href="/">
            Home
          </Link>

          <Link href="/board">
            Meu board
          </Link>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}


