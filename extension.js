// The module 'vscode' contains the VS Code extensibility API





// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const filesystem = require('fs');







/**
 * @param {string} path
 * @param {string} scriptname
 */
function generateHTML(path,scriptname){


const scriptCND = 'https://cdn.jsdelivr.net/npm/p5@1.0.0/lib/p5.js';
	const data = "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<title>Welcome</title>\n\t\t<meta charset=\"UTF-8\">\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\t\t<script src="+scriptCND+" ></script>\n\t\t<script src=\""+scriptname+".js\"></script>\n\t</head><body></body>\n</html>";
	const dataArray = new Uint8Array(Buffer.from(data));
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
 * @param {string} filename
 */
function generateProjectjs(path,filename){
	const scriptData = "function setup(){\n\n}\n\nfunction draw(){\n\n}";
	const dataArray = new Uint8Array(Buffer.from(scriptData));
	const file = path+"/"+filename+".js"; 
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

	try{
		filesystem.mkdir(uriPath+"/"+projectName,(err)=>{
			if(err) throw err;
			
	})

		return uriPath+"/"+projectName+"/";

	}catch(error)
	{
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
							generateHTML(status,projectName);
							generateProjectjs(status,projectName)
						}
						
						vscode.commands.executeCommand('vscode.openFolder', uriOfWorkspace);
						
						})
	
				}else if(folders.length > 1){
					vscode.window.showWorkspaceFolderPick().then(
						workspacefolder => {
						const status =	generateProjectFolder(workspacefolder.uri.path,projectName)
						if(status != undefined){
							generateHTML(status,projectName);
							generateProjectjs(status,projectName)
						}
							vscode.commands.executeCommand('vscode.openFolder', workspacefolder.uri);
						}
					)
				}else{
					let uriOfWorkspace = folders[0].uri;
					const status = generateProjectFolder(uriOfWorkspace.path,projectName);	
					
					if(status != undefined){
						
						generateHTML(status,projectName);
						generateProjectjs(status,projectName)
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
