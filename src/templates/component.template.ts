export const getComponentTsTemplate = (selector: string, className: string, type: string, classType: string) => {
  return `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-${selector}',
  templateUrl: './${selector}.${type}.html',
  styleUrls: ['./${selector}.${type}.css'],
  imports: [CommonModule]
})
export ${type === "page" ? "default " : ""}class ${className}${classType} {
}
`;
};
