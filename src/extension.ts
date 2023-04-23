// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
interface Article {
  title: string;
  link: string;
  guid: string;
  description: string;
  pubDate: string;
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  const parser = new XMLParser();

  const res = await axios.get('https://blog.webdevsimplified.com/rss.xml');
  const articles = parser
    .parse(res.data)
    .rss.channel.item.map((item: Article) => {
      return {
        label: item.title,
        detail: item.description,
        link: item.link,
      };
    });

  let disposable = vscode.commands.registerCommand(
    'kennysearch.helloWorld',
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage('Hello World from kennysearch!');
    }
  );
  let search = vscode.commands.registerCommand(
    'kennysearch.search',
    async () => {
      const article = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true,
      });
      if (!article) {
        return;
      }
      vscode.env.openExternal(article.link as never);
      vscode.window.showInformationMessage('Searching for data');
    }
  );
  context.subscriptions.push(disposable);
  context.subscriptions.push(search);
}

// This method is called when your extension is deactivated
export function deactivate() {}
