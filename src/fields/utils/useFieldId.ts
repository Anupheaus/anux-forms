import { useId } from 'anux-react-utils';

export function useFieldId(fieldType: string): string {
  return `${fieldType}_${useId().replace(/-/g, '')}`;
}
