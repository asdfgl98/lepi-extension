export const getServiceTemplate = (className: string, classType: string) => {
  return `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ${className}${classType} {

}
`;
};
