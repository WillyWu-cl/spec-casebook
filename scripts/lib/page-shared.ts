// The styles and script every casebook page shares: a page template holds the two markers, this fills them in.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const part = (name: string) => readFileSync(join(import.meta.dirname, '..', name), 'utf8');

export function withShared(html: string): string {
  return html.replace('/*__SHARED_CSS__*/', () => part('page-shared.css.tpl')).replace('/*__SHARED_JS__*/', () => part('page-shared.js.tpl'));
}
