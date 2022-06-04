import { DataContextProvider } from "../context/DataContext/dataContext";
import DefaultLayout from "../components/Layout";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/globals.css";

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
	return (
		<DefaultLayout>
			<DataContextProvider>
				<Component {...pageProps} />
			</DataContextProvider>
		</DefaultLayout>
	);
}

export default MyApp;
