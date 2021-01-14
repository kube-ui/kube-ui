import React, { useEffect, useState } from "react";

import { Button } from "@material-ui/core";
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
				const that = {
					...item,
					...namespaceDetails
				};

				console.log(that)

				return that
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
		  .data
		  .filter(namespace => namespace.name.includes("client-int"))
		  .slice(1, 11)
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
  }, []);

  return <Layout namespaces={namespaces} onLogin={handleLogin} onNamespaceGetDetails={handleNamespaceGetDetails} appState={appState} />;
};

export default App;
