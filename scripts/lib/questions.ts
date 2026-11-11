// Open questions of a table (user, 2026-11-04): the "## Open questions" bullets of its requirements.md and the answers
// reviewers type under them on the Cases page. Answers live in library/<product>/<feature>/question-answers.json, one
// file for both platforms (the Q-ids of a feature's two drafts mean the same question), keyed by Q-id, with the
// question text kept so a changed question shows it. The agent applies each "open" answer and sets it "done" with a
// one-line resolution (spec-casebook SKILL.md step 4, Question answers).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { featureDir, writeJson } from './library.ts';

export type Question = { id: string; text: string; rows: string[] };
export type Answer = { question: string; answer: string; by: string; at: string; platform: string; status: 'open' | 'done'; resolution?: string };

// "## Open questions" up to the next "## " heading; each "- Q-n …" bullet (with any indented lines under it) is one question
export function parseQuestions(md: string): Question[] {
  const start = md.search(/^## Open questions\b.*$/m);
  if (start < 0) return [];
  const rest = md.slice(start).split('\n').slice(1), end = rest.findIndex(l => /^## /.test(l));
  const out: Question[] = [];
  for (const line of end < 0 ? rest : rest.slice(0, end)) {
    const m = line.match(/^[-*]\s+(Q-\d+)\b[\s:.)–-]*(.*)$/);
    if (m) out.push({ id: m[1], text: m[2].trim(), rows: [] });
    else if (out.length && /^\s+\S/.test(line)) out.at(-1)!.text += ' ' + line.trim();
  }
  for (const q of out) q.rows = [...new Set(q.text.match(/\bTC-\d+\b/g) ?? [])];
  return out;
}

// Chinese reading copy of the Open questions (user, 2026-11-10, REQ-004 of phd/cutout): questions.zh-Hant.json beside
// requirements.md (draft folder, copied to the table on Save), { "Q-1": "<question>。假設：<assumption>", … } in
// Traditional Chinese with Taiwan wording. The page's 中文 mode shows it above the English question; requirements.md
// stays English and is what answers are keyed to.
export function readQuestionsZh(dir: string | null): Record<string, string> {
  const p = dir ? join(dir, 'questions.zh-Hant.json') : '';
  return p && existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {};
}

const answersFile = (feature: string) => join(featureDir(feature), 'question-answers.json');
export const readAnswers = (feature: string): Record<string, Answer> =>
  existsSync(answersFile(feature)) ? JSON.parse(readFileSync(answersFile(feature), 'utf8')) : {};

// one answer per question id; an emptied box removes that answer, an unchanged one keeps its status
export function saveAnswers(feature: string, platform: string, body: { by?: string; items?: { id: string; answer: string; question: string }[] }) {
  const answers = readAnswers(feature), at = new Date().toISOString();
  for (const it of body.items ?? []) {
    if (!/^Q-\d+$/.test(it.id)) continue;
    const text = String(it.answer ?? '').trim();
    if (!text) { delete answers[it.id]; continue; }
    if (answers[it.id]?.answer === text) continue;
    answers[it.id] = { question: String(it.question ?? ''), answer: text, by: String(body.by ?? '').slice(0, 80), at, platform, status: 'open' };
  }
  const sorted = Object.fromEntries(Object.entries(answers).sort(([a], [b]) => Number(a.slice(2)) - Number(b.slice(2))));
  writeJson(answersFile(feature), sorted);
  return { file: answersFile(feature), answers: sorted };
}
