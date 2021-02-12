import { Content, ContentSwitch, EmptyContent } from "./components/content.js";
import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";
import Item from "./components/item.js";
import Layout from "./components/layout.js";
import { ipcRenderer } from "electron";

const App = () => {
  const [namespaces, setNamespaces] = useState([]);
  const [appState, setAppState] = useState("initial");

  const handleLogin = () => {
	setAppState("loading")
	ipcRenderer.send("login");
  }

  const handleNamespaceGetDetails = (namespaceName) => {
	ipcRenderer.send("namespace-details:load", namespaceName);
	ipcRenderer.on("namespace-details:get", (e, response) => {
		const namespaceDetails = JSON.parse(response).data[0]
		
		const result = namespaces
		  .map((item) => {
			if(item.name === namespaceDetails.name) {
				return {
					...item,
					...namespaceDetails
				};
			}
			
			return {
			  ...item
			};
		  });
  
		setNamespaces(result);
		setAppState("ready")
	  });
  }

  const retrieveNamespaces = () => {
	ipcRenderer.send("namespaces:load");
	ipcRenderer.on("namespaces:get", (e, namespaces) => {
		const result = JSON.parse(namespaces)
		  .map((item) => {
			return {
			  ...item,
			  slack: item.slack.split("(")[0],
			  "pods": "-",
			  "ready-pods": "-",
			  "last-deployed": "-"
			};
		  });
  
		setNamespaces(result);
		setAppState("ready")
	  });
  }

  useEffect(() => {
	ipcRenderer.on("login:success", (e) => {
		retrieveNamespaces()
	})

	ipcRenderer.on("logout", (e) => {
		console.log("Logged out...")
		setAppState("")
	})

	ipcRenderer.on("error", (e, response) => {
		alert(JSON.stringify(response))
	})
  }, []);

  const loadingState = () => (<EmptyContent text={"Loading..."} />)
  const defaultState = () => (<EmptyContent text={"Login"} action={handleLogin} />)
  const ready = () => (
	<Content>
		{namespaces.map((item, index) => (
			<Grid key={index} item xs={4} className="namespace-item">
				<Item item={item} onNamespaceGetDetails={handleNamespaceGetDetails} />
			</Grid>
		))}
	</Content>
  )

  return (
    <Layout onLogin={handleLogin} >
		<ContentSwitch state={appState} contentMap={{
			loading: loadingState,
			ready: ready,
			default: defaultState,
		}} />
    </Layout>
  );
};

export default App;
