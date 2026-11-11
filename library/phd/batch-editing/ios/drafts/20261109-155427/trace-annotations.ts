// Traces every annotation block of the draft (reading-the-spec.md step 9), by block id, to requirements found by a
// phrase of their text (so the trace survives renumbering). Re-run after annotations.ts.
// Usage: node trace-annotations.ts <ios|android> <draft dir>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const P = process.argv[2], D = process.argv[3];
const md = readFileSync(join(D, 'requirements.md'), 'utf8');
const reqs = [...md.matchAll(/^- (R-\d+) \[[^\]]*\] (.*)$/gm)].map(m => [m[1], m[2]] as [string, string]);
const R = (...phrases: string[]) => phrases.map(ph => { const r = reqs.find(([, t]) => t.includes(ph)); if (!r) throw new Error(`no requirement with 「${ph}」`); return r[0]; }).join(', ');
const t = JSON.parse(readFileSync(join(D, 'annotation-trace.json'), 'utf8'));
const UI = 'ui: phone mockup text (status bar time, tab and tool labels, sample counts) checked by the rows of its screen';
const rules: [RegExp, () => string][] = [
  [/^design-(light|dark)-entry@/, () => 'label: row title'],
  [/^design-(light|dark)-enhance@/, () => 'label: row title'],
  [/^design-(light|dark)-adjust@(0|3312),977/, () => 'label: row title'],
  [/^design-(light|dark)-adjust@(521|3833),1586/, () => R('「Applied to x photos」', 'Design draws 「AI Exposure」')],
  [/^design-(light|dark)-adjust@(1649|4969),1541/, () => R('HSL has the colour chips')],
  [/^design-(light|dark)-adjust@(1979|5299),1541/, () => R('HSL has the colour chips')],
  [/^design-(light|dark)-adjust@(720|4032),1673/, () => R('Design draws 「AI Exposure」')],
  [/^design-(light|dark)-adjust@.*/, () => 'Q-8'],
  [/^design-(light|dark)-save@(542|3854),3659/, () => R('Save shows 「Saving k / N」')],
  [/^design-(light|dark)-save@(823|4135),3363/, () => R('The Batch Save page shows a grid')],
  [/^design-(light|dark)-save@(929|4241),4089/, () => R('The Batch Save page shows a grid')],
  [/^design-(light|dark)-save@(1636|4948),3729/, () => R('The dialog reads 「Discard changes?」')],
  [/^design-(light|dark)-save@(1816|5128),3817/, () => R('The dialog reads 「Discard changes?」')],
  [/^design-(light|dark)-save@(1871|5183),3408/, () => 'Q-17'],
  [/^design-(light|dark)-save@(1752|5064),4017/, () => R('The batch AI Enhance room has no Standard')],
  [/^design-(light|dark)-save@/, () => UI],
  [/^pm-background@/, () => 'label: the feature\'s purpose (why batch editing and AI Enhance in it); no behaviour'],
  [/^pm-header@/, () => R('Batch Edit offers only three tools')],
  [/^pm-credit@/, () => R('AI Enhance in batch charges no credits')],
  [/^pm-error-handle@/, () => R('Failures are summed up once', 'While processing nothing else can be done', 'If the app is killed', 'Standard AI Enhance results from batch', 'Losing the network counts as failure', 'Sending the app to the background')],
  [/^pm-tracking@13266,682/, () => R('Switching the picker to Batch', 'A batch save sends', 'Event names have three')],
  [/^pm-tracking@/, () => R('Switching the picker to Batch', 'GenAI_Feature_Generate', 'A batch save sends', '「Edit Next Batch」 sends')],
  [/^pm-tbd@13230,1687/, () => R('AI Enhance in batch charges no credits')],
  [/^pm-tbd@14320,1687/, () => R('Batch Edit is free on day 1')],
  [/^pm-tbd@(13669|15161)/, () => 'older: superseded options of TBD Q1 / Q2 (decided 10/30: no credits, no Premium lock, 20 photos free)'],
  [/^pm-flow-1@6404,743/, () => R('Batch Edit is reached only', 'Batch Edit offers only three tools', 'Batch Edit is free on day 1') + '; the audience line and 「iOS + Android 同步」 are labels'],
  [/^pm-flow-1@9140,1167/, () => R('「Batch Editing」 shortcut') + ' (icon direction and deeplink; Q-3)'],
  [/^pm-flow-(1|3|4|5|7)@6646,/, () => 'label: row title'],
  [/^pm-flow-5@7506,5762/, () => R('Replace photo opens the Photo Picker, where switching')],
  [/^pm-flow-4@8862,4974/, () => R('A Free user\'s 「Enhance」 opens the existing Premium IAP')],
  [/^pm-flow-2@6646,2166/, () => 'label: row title'],
  [/^pm-flow-2@7634,2702/, () => R('「Applied to x photos」')],
  [/^pm-flow-2@(7416|7846),2823/, () => R('The batch Adjustment room is the 26')],
  [/^pm-flow-2@/, () => UI],
  [/^pm-flow-6@7533,6897/, () => R('The Batch Save page shows a grid')],
  [/^pm-flow-6@7141,7257/, () => R('Save shows 「Saving k / N」')],
  [/^pm-flow-6@7643,7647/, () => R('「Edit Next Batch」 opens the Photo Picker')],
  [/^pm-flow-6@/, () => UI],
  [/^pm-flow-7@7936,8222/, () => R('Home with no edit yet', 'Replace photo with no edit yet', '「Edit Next Batch」 opens the Photo Picker')],
  [/^pm-flow-7@6646,9140/, () => 'label: arrow colour legend'],
  [/^pm-ui-1@6841,9638/, () => R('「Single」 / 「Batch」 switch', 'With 「Single」, picking one photo', 'have the same Single / Batch switch')],
  [/^pm-ui-1@8301,9638/, () => R('Only 「Batch」 allows several photos', 'Picked photos show their pick order', 'The picker bottom shows the count', 'Switching the picker to Batch')],
  [/^pm-ui-1@9761,9638/, () => R('With 「Batch」 and only one photo', 'With 「Single」, picking one photo', 'Replace photo opens the Photo Picker, where switching')],
  [/^pm-ui-1@11221,9638/, () => R('Picking a 21st photo')],
  [/^pm-ui-2@/, () => R('The Batch Edit Room looks like the Edit Room', 'The top bar has Home', 'Settings (rightmost)', 'A thumbnail strip on the main screen', 'Save shows 「Saving k / N」', 'Home with no edit yet', 'Replace photo with no edit yet', 'The main screen\'s Undo / Redo', 'Undo on a photo can take it back')],
  [/^pm-ui-3@6856,11984/, () => R('The batch Crop & Rotate room is', 'The top shows the current photo\'s output size', 'Tapping ✎ allows typing', 'After a typed px size', 'With width and height linked', 'Each batch room (Crop & Rotate, Adjustment) has 「All」', '「All」 is disabled when', '「All」 becomes enabled', 'Switching photos sets 「All」', 'Undo of the Apply-to-all step', 'After 「All」 the thumbnail strip', 'After 「All」 any photo', 'Tapping 「All」 again', 'Each batch room shows the thumbnail strip', 'The main screen\'s Undo / Redo')],
  [/^pm-ui-3@8316,11984/, () => R('After 「All」 the room stays open', 'After 「All」 the thumbnail strip', 'One Undo after Apply to all', '「All」 becomes enabled')],
  [/^pm-ui-3@6856,12854/, () => R('Every other photo gets the largest box', 'Apply to all copies rotation and flips', 'A Free crop is applied', 'Each batch room has one shared Undo', 'Switching photos in a room does not clear', 'When Undo / Redo changes a photo', 'A room\'s ✕ drops', 'A room\'s ✓ returns') + ' (「centred」: Q-6)'],
  [/^pm-ui-4@9346,13468/, () => R('Opening Color › Curve or HSL hides')],
  [/^pm-ui-4@10240,13575/, () => R('Opening Color › Curve or HSL hides', 'Collapsing the Curve / HSL panel')],
  [/^pm-ui-4@6856,13582/, () => R('The batch Adjustment room is the 26', 'Each batch room (Crop & Rotate, Adjustment) has 「All」', 'After 「All」 any photo', 'Tapping 「All」 again', 'Each batch room shows the thumbnail strip', '「All」 is disabled when', '「All」 becomes enabled', 'Switching photos sets 「All」', 'Undo of the Apply-to-all step', 'Opening Color › Curve or HSL hides', 'The main screen\'s Undo / Redo') + ' (AI Exposure: Q-8)'],
  [/^pm-ui-4@8316,13582/, () => R('After 「All」 the room stays open', 'After 「All」 the thumbnail strip', 'One Undo after Apply to all', '「All」 becomes enabled')],
  [/^pm-ui-4@6856,14242/, () => R('Adjustment Apply to all copies the room\'s whole setting', 'Each batch room has one shared Undo', 'Switching photos in a room does not clear', 'When Undo / Redo changes a photo', 'A room\'s ✕ drops', 'A room\'s ✓ returns', 'Undo / Redo in Adjustment do not switch')],
  [/^pm-ui-5@6841,15062/, () => R('The batch AI Enhance room has no Standard', 'The batch 「Enhance」 runs the 10/E', 'Each tap on 「Enhance」 asks', 'AI Enhance in batch charges no credits', 'One 「Enhance」 enhances every photo', 'From the AI Enhance shortcut, several photos', 'The AI Enhance room\'s thumbnail strip')],
  [/^pm-ui-5@8301,15062/, () => R('In one visit of the AI Enhance room', 'Leaving the room and opening it again', 'Batch has none of the Advanced rules')],
  [/^pm-ui-5@9761,15062/, () => R('A Free user\'s 「Enhance」 opens the existing Premium IAP')],
  [/^pm-ui-5@11221,15062/, () => R('While processing, the existing loading screen', 'While processing nothing else can be done')],
  [/^pm-ui-5@12681,15062/, () => R('Failures are summed up once', 'Tapping a failed thumbnail', 'The button becomes 「Retry Failed (x)」', 'After Retry the summary counts') + ' (second line wording: Q-12)'],
  [/^pm-ui-5@14141,15062/, () => R('Losing the network counts as failure', '「Retry Failed (x)」 reruns the unfinished', 'If the app is killed', 'Standard AI Enhance results from batch')],
  [/^pm-ui-6@/, () => R('Each tap on 「Enhance」 asks', '「Cancel」 returns to the AI Enhance room', 'AI Enhance in batch charges no credits', 'One 「Enhance」 enhances every photo')],
  [/^pm-ui-7@/, () => R('Home with no edit yet', 'Replace photo with no edit yet', 'The dialog reads 「Discard changes?」', '「Keep Editing」 closes the dialog', 'Standard AI Enhance results from batch')],
  [/^pm-ui-8@6856,18560/, () => R('Save shows 「Saving k / N」', 'Each photo is saved as a new file', 'Every photo of the batch is saved')],
  [/^pm-ui-8@8316,18560/, () => R('The Batch Save page shows a grid', 'On the Batch Save page ‹', '「Edit Next Batch」 opens the Photo Picker', 'The Batch Save page thumbnails do not open', 'For the rating dialog') + (P === 'ios' ? ', ' + R('On iOS this differs') : '')],
  [/^pm-crop-apply-rule@16739,193/, () => 'label: board title (Meitu test)'],
  [/^pm-crop-apply-rule@16799,385/, () => 'label: Meitu\'s behaviour (competitor test summary); PhD\'s rule is the 「✅ 結論」 block, traced on its own'],
  [/^pm-crop-apply-rule@16805,1061/, () => R('Crop Apply to all keeps the current photo', 'Every other photo gets the largest box')],
  [/^pm-crop-apply-rule@16805,1247/, () => R('Crop Apply to all keeps the current photo', 'Every other photo gets the largest box', 'Each photo\'s output size is worked out', 'Crop Apply to all replaces the other', 'A Free crop is applied', '「Original」 with Apply to all', 'A photo whose ratio already equals', 'Tapping ✎ allows typing', 'After a typed px size', 'Apply to all copies rotation and flips', 'One Undo after Apply to all')],
  [/^pm-crop-apply-rule@16799,(2995|3744)/, () => R('Choosing a ratio gives the photo the largest box')],
  [/^pm-crop-apply-rule@16799,(4493|5242)/, () => R('Every other photo gets the largest box')],
  [/^pm-crop-apply-rule@16799,5991/, () => R('Crop Apply to all keeps the current photo', 'Every other photo gets the largest box')],
  [/^pm-crop-apply-rule@16799,6740/, () => R('A photo whose ratio already equals')],
  [/^pm-crop-apply-rule@16799,7151/, () => R('A Free crop is applied')],
  [/^pm-crop-apply-rule@16799,7982/, () => R('「Original」 with Apply to all')],
  [/^pm-crop-apply-rule@16799,8311/, () => R('Tapping ✎ allows typing', 'After a typed px size') + ' (toast copy: Q-5)'],
];
let n = 0;
for (const b of t.blocks) {
  if (b.trace && !b.trace.startsWith('?')) continue;
  const r = rules.find(([re]) => re.test(b.id));
  if (!r) { console.log('UNTRACED', b.id, b.text.slice(0, 80)); continue; }
  b.trace = r[1](); n++;
}
writeFileSync(join(D, 'annotation-trace.json'), JSON.stringify(t, null, 2) + '\n');
console.log(`traced ${n}`);
