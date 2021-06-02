/** @jsx jsx */

import { Button, Flex, jsx, Link } from "theme-ui";
import styles from "../styles/Home.module.css";
import Search from '../components/Search'
import utilStyles from '../styles/utils.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Flex sx={{ justifyContent: "center", alignItems: "center" }}>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={`${utilStyles.headingLg} ${utilStyles.fw4}`}>Search</h2>
          <Search />
        </section>
      </Flex>
    </div>
   
  );
}

