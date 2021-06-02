import "../styles/globals.css";
import { ThemeProvider } from "theme-ui";
import theme from "../theme";
import MDXProvider from "../components/MDXProvider";
import { Button, Flex, jsx, Link } from "theme-ui";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
     <nav>
    <ul className="menuItems">
      <li><a href='/' data-item='Search'>Search</a></li>
      <li><a href='/files' data-item='Files'>Files</a></li>
    </ul>
  </nav>
      <MDXProvider>
        <Component {...pageProps} />
      </MDXProvider>
    </ThemeProvider>
  );
}

export default MyApp;
