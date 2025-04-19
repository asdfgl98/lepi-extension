import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { getServiceTemplate } from "../../templates/service.template";

export type ComponentType = "component" | "page" | "modal" | "layout" | string;

export const generateAngularService = async (uri: vscode.Uri) => {
  // 1. 선택한 파일 경로 확인
  const directoryPath = uri ? uri.fsPath : "";
  if (!directoryPath) {
    vscode.window.showErrorMessage("디렉토리를 선택한 상태에서 사용해주세요.");
    return;
  }

  // 2. 서비스 이름 입력받기
  const serviceName = await vscode.window.showInputBox({
    placeHolder: "🤖서비스 명을 입력해주세요. (ex: user)",
    prompt: "Input Service Name",
  });

  if (!serviceName) {
    vscode.window.showInformationMessage("서비스 생성이 취소되었습니다.");
    return;
  }

  //2.1 서비스 타입 선택
  const serviceType = await vscode.window.showQuickPick(["service", "store"], {
    placeHolder: "🤖서비스 타입을 선택해주세요.",
  });

  if (!serviceType) {
    vscode.window.showInformationMessage("서비스 생성이 취소되었습니다.");
    return;
  }

  // 3. 서비스 이름 정규화 (케밥 케이스로 변환)
  const kebabCaseName = serviceName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

  // 4. 클래스 이름 생성 (파스칼 케이스)
  const className = kebabCaseName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const classType = serviceType.charAt(0).toUpperCase() + serviceType.slice(1);

  try {
    // 5. 서비스 파일 생성
    // 5.1. ${type}.ts
    const serviceContent = getServiceTemplate(className, classType);
    fs.writeFileSync(path.join(directoryPath, `${kebabCaseName}.${serviceType}.ts`), serviceContent);

    vscode.window.showInformationMessage(`${className} 서비스가 생성되었습니다.`);
  } catch (err) {
    vscode.window.showErrorMessage(`서비스 생성 중 오류가 발생했습니다: ${err}`);
  }
};
