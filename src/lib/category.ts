import type { Category } from '../content/site';

/** Short key used as the `data-cat` attribute; CSS maps it to the tint tokens. */
export type CategoryKey = 'autonomy' | 'manip' | 'perception' | 'mech' | 'software';

const keys: Record<Category, CategoryKey> = {
  'Autonomy & Navigation': 'autonomy',
  Manipulation: 'manip',
  Perception: 'perception',
  'Mechanical Design': 'mech',
  'Software & AI': 'software',
};

export function catKey(category: Category): CategoryKey {
  return keys[category];
}
