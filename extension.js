// The module 'vscode' contains the VS Code extensibility API





// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const filesystem = require('fs');







/**
 * @param {string} path
 */
function generateHTML(path){



	const html = `<!DOCTYPE html>
	<html>
	
	<head>
	  <meta charset="UTF-8">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	  <meta name="viewport" content="width=device-width, initial-scale=1">
	
	  <title>Welcome</title>
	  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/p5@1.0.0/lib/p5.min.js"></script>
	  <script src="sketch.js" type="text/javascript"></script>
	</head>
	
	<body>
	</body>
	
	</html>
	
	`
	const dataArray = new Uint8Array(Buffer.from(html));
	const file = path+"/"+"index.html"; 
	filesystem.writeFile(file,dataArray,(err)=>{
		if (err){
			vscode.window.showInformationMessage(err.message)
		}
		else{
			changePermission(file)
			return true
		}
	})




}

/**
 * @param {string} path
 * 
 */
function generateProjectjs(path,){
	const scriptData = "function setup(){\n\n}\n\nfunction draw(){\n\n}";
	const dataArray = new Uint8Array(Buffer.from(scriptData));
	const file = path+"/sketch.js"; 
	filesystem.writeFile(file,dataArray,(err)=>{
		if (err){
			vscode.window.showInformationMessage(err.message)
		}
		else{
			changePermission(file)
			return true
		}
	})

}


/**
 * @param {String} files
 */
function changePermission(files){
	filesystem.chmod(files, 0o775, (err) => {
		if (err){
			vscode.window.showInformationMessage("Unable Change Permissions")
		}
	  });
}


/**
 * @param {string} uriPath
 * @param {string} projectName
 */
function generateProjectFolder(uriPath,projectName){

	
	if(!filesystem.existsSync(uriPath+"/"+projectName)){
		try{
			filesystem.mkdir(uriPath+"/"+projectName,(err)=>{
				if(err) throw err;
				
		})
	
			return uriPath+"/"+projectName+"/";
	
		}catch(error)
		{
			
			return undefined;
		}

	}else{
		vscode.window.showInformationMessage("Project Already Exists");
		return undefined;
	}

	
	
	
}

function selectWorkspaceFolder(){
	vscode.window.showInputBox({
		placeHolder:"Enter project name :"
	}).then(
		projectName =>{
			if(projectName!=undefined){
				let folders = vscode.workspace.workspaceFolders
				if(folders==undefined){
					vscode.window.showOpenDialog({
						canSelectFiles:false,
						canSelectFolders:true,
						canSelectMany:false,
						openLabel:'Select Workspace Folder',
						defaultUri: vscode.Uri.file('/'),
						filters:{}
					}).then(uri => {
						let uriOfWorkspace = uri[0];
					 const status =	generateProjectFolder(uriOfWorkspace.path,projectName)
						if(status != undefined){
							generateHTML(status);
							generateProjectjs(status)
						}
						
						vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
						
						})
	
				}else if(folders.length > 1){
					vscode.window.showWorkspaceFolderPick().then(
						workspacefolder => {
						const status =	generateProjectFolder(workspacefolder.uri.path,projectName)
						if(status != undefined){
							generateHTML(status);
							generateProjectjs(status)
						}
							vscode.commands.executeCommand('vscode.openFolder', workspacefolder.uri);
						}
					)
				}else{
					let uriOfWorkspace = folders[0].uri;
					const status = generateProjectFolder(uriOfWorkspace.path,projectName);	
					
					if(status != undefined){
						
						generateHTML(status);
						generateProjectjs(status)
					}	
					vscode.commands.executeCommand('vscode.openFolder',uriOfWorkspace)				
				}

			}
		}
	)
	


}





// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "p5js" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('p5jsprojectcreator.createProject', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		selectWorkspaceFolder();
			
		
		
	});

	

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
