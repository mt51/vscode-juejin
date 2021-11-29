// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
  getArticles,
  getGithub,
  GithubCategoryEnum,
  GithubLangEnum,
  GithubPeriodEnum,
} from './api';

let cachedPanel: vscode.WebviewPanel;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'vscode-juejin.jueJin',
    () => {

      if (cachedPanel) {
        cachedPanel.reveal(vscode.ViewColumn.One);
        return;
      }
      const panel = vscode.window.createWebviewPanel(
        'article',
        '掘金插件',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(context.extensionUri, 'media'),
            vscode.Uri.joinPath(context.extensionUri, 'web_dist'),
          ],
        }
      );

      panel.webview.html = getHtmlForWebview(
        panel.webview,
        context.extensionUri
      );

      panel.onDidDispose(() => {
        panel.dispose();
      });

      panel.webview.onDidReceiveMessage(
        (message) => {
          let params = null;
          try {
            params = JSON.parse(message.data);
          } catch (e) {
            return;
          }

          switch (message.type) {
            case 'fetch:articles':
              if (!params) {
                params = {
                  cate_id: '6809637767543259144',
                  client_type: 6587,
                  cursor: '0',
                  id_type: 2,
                  limit: 20,
                  sort_type: 200,
                };
              }
              getArticles(params).then((data) => {
                panel.webview.postMessage({ type: 'fetched:articles', data });
              });
              break;
            case 'fetch:githubs':
              if (!params) {
                params = {
                  category: GithubCategoryEnum.trending,
                  lang: GithubLangEnum.javascript,
                  limit: 20,
                  offset: 0,
                  period: GithubPeriodEnum.day,
                };
              }
              getGithub(params).then(({ data }) => {
                panel.webview.postMessage({ type: 'fetched:githubs', data });
              });
              break;
            default:
              console.error('Unrecognized event type');
              break;
          }
        },
        undefined,
        context.subscriptions
      );

      cachedPanel = panel;
    }
  );

  context.subscriptions.push(disposable);
}

function getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {
  // Local path to main script run in the webview
  const scriptPathOnDisk = vscode.Uri.joinPath(
    extensionUri,
    'web_dist/js',
    'bundle.js'
  );

	const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'web_dist/css',
	'main.css'));

  // And the uri we use to load this script in the webview
  const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

  // Local path to css styles
  // const styleResetPath = vscode.Uri.joinPath(extensionUri, 'media', 'reset.css');
  // const stylesPathMainPath = vscode.Uri.joinPath(extensionUri, 'media', 'vscode.css');

  // // Uri to load styles into webview
  // const stylesResetUri = webview.asWebviewUri(styleResetPath);
  // const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

  // Use a nonce to only allow specific scripts to be run
  const nonce = getNonce();

  return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">

			<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
			-->

			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			${process.env.NODE_ENV === 'development' ? '' : `<link href="${stylesMainUri}" rel="stylesheet">`}

			<title>掘金 vscode 插件</title>
		</head>
		<body>
			<div id="root"></div>
			<script src="${scriptUri}"></script>
		</body>
		</html>`;
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (cachedPanel) {
    cachedPanel.dispose();
  }
}
