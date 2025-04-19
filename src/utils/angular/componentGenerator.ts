import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { getComponentTsTemplate } from "../../templates/component.template";

export type ComponentType = "component" | "page" | "modal" | "layout" | string;

export const generateAngularComponent = async (uri: vscode.Uri, type?: ComponentType) => {
  // 1. 선택한 파일 경로 확인
  const directoryPath = uri ? uri.fsPath : "";
  if (!directoryPath) {
    vscode.window.showErrorMessage("디렉토리를 선택한 상태에서 사용해주세요.");
    return;
  }

  // 2. 컴포넌트 이름 입력받기
  const componentName = await vscode.window.showInputBox({
    placeHolder: "🤖컴포넌트명을 입력해주세요. (ex: button)",
    prompt: "Input Component Name",
  });

  if (!componentName) {
    vscode.window.showInformationMessage("컴포넌트 생성이 취소되었습니다.");
    return;
  }

  if (!type) {
    const componentType = await vscode.window.showInputBox({
      placeHolder: "🤖컴포넌트 타입을 입력해주세요. (default: component)",
      value: "component",
      prompt: "Input Component Type",
    });

    if (!componentType) {
      vscode.window.showInformationMessage("컴포넌트 생성이 취소되었습니다.");
      return;
    }

    type = componentType as ComponentType;
  }

  // 3. 컴포넌트 이름 정규화 (케밥 케이스로 변환)
  const kebabCaseName = componentName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

  // 4. 클래스 이름 생성 (파스칼 케이스)
  const className = kebabCaseName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const classType = type.charAt(0).toUpperCase() + type.slice(1);

  // 5. 컴포넌트 디렉토리 생성
  const componentDir = path.join(directoryPath, kebabCaseName);

  try {
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir);
    }

    // 6. 컴포넌트 파일들 생성
    // 6.1. ${type}.ts
    const componentContent = getComponentTsTemplate(kebabCaseName, className, type, classType);
    fs.writeFileSync(path.join(componentDir, `${kebabCaseName}.${type}.ts`), componentContent);

    // 6.2. ${type}.html
    fs.writeFileSync(path.join(componentDir, `${kebabCaseName}.${type}.html`), "");

    // 6.3. ${type}.css
    fs.writeFileSync(path.join(componentDir, `${kebabCaseName}.${type}.css`), "");

    vscode.window.showInformationMessage(`${className} 컴포넌트가 생성되었습니다.`);
  } catch (err) {
    vscode.window.showErrorMessage(`컴포넌트 생성 중 오류가 발생했습니다: ${err}`);
  }
};
