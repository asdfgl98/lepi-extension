import * as vscode from "vscode";
import { generateAngularComponent } from "./utils/angular/componentGenerator";
import { generateAngularService } from "./utils/angular/serviceGenerator";

export function activate(context: vscode.ExtensionContext) {
  // 컴포넌트
  const component = vscode.commands.registerCommand("lepisode-extension.generateComponent", async (uri: vscode.Uri) => generateAngularComponent(uri, "component"));
  const page = vscode.commands.registerCommand("lepisode-extension.generatePage", async (uri: vscode.Uri) => generateAngularComponent(uri, "page"));
  const modal = vscode.commands.registerCommand("lepisode-extension.generateModal", async (uri: vscode.Uri) => generateAngularComponent(uri, "modal"));
  const custom = vscode.commands.registerCommand("lepisode-extension.generateCustom", async (uri: vscode.Uri) => generateAngularComponent(uri));

  // 서비스
  const service = vscode.commands.registerCommand("lepisode-extension.generateService", async (uri: vscode.Uri) => generateAngularService(uri));

  context.subscriptions.push(component, page, modal, custom);
}

export function deactivate() {}
