# iOS draft from the Android draft 20261106-115758: every Android-only step rewritten or dropped (SKILL.md step 0).
import csv,re
A='library/phd/i2v-reuse/android/drafts/20261106-115758/'; D='library/phd/i2v-reuse/ios/drafts/20261106-121538/'
PATH='My AI Artwork (Launcher › AI Photos › My Artwork, top right)'
USAGE='the credit usage history (Mine › My Credits)'
def common(s):
    s=s.replace(PATH,'My AI Artwork').replace('Android phone','iPhone')
    s=s.replace('Open Buy Credit › Detail from the credit button','Open '+USAGE).replace('Open Buy Credit › Detail',"Open "+USAGE)
    s=s.replace('Buy Credit › Detail lists',USAGE[0].upper()+USAGE[1:]+' lists').replace('Buy Credit › Detail has',USAGE[0].upper()+USAGE[1:]+' has').replace('Buy Credit › Detail',USAGE)
    return s
t=common(open(A+'requirements.md').read()).replace('requirements (android)','requirements (ios)')
L=t.split('\n')
drop=('- R-040 ','- R-058 ','- R-059 ','- R-060 ','- R-061 ','- Q-9 ')
L=[l for l in L if not l.startswith(drop)]
t='\n'.join(L)
t=re.sub(r'## Android system Back \(pass 8, REQ-051 rule\)\n\n?','',t)
t=re.sub(r'### System back\n.*?(?=### Domain rules)','',t,flags=re.S)
t=re.sub(r'### Domain rules\n.*?(?=### Request ledger coverage)','''### Domain rules
| Entry | Requirements |
|---|---|
| KP-013 | R-050 |
| KP-016 | R-030 |
| KP-031 | n/a (this page's spec draws no 「Next Edit」) |
| KP-127 | n/a (no editor) |
| KP-128 | n/a (no portrait tools) |

''',t,flags=re.S)
def line(pfx,new):
    global t
    m=[l for l in t.split('\n') if l.startswith(pfx)]; assert m,pfx
    t=t.replace(m[0],new)
t=t.replace('## Android: credits and artwork (domain rules)','## Credits and artwork')
line('- R-026 ','- R-026 [PM:pm-ui From Save & Share Reuse D1-04b] When Image to Video would show its iOS intro (demo / Steps) or the AI Processing Notice, it shows first as today, and 「Settings applied」 shows only once the Custom page is visible.')
line('- R-036 ','- R-036 [PM:pm-ui From Save & Share Reuse D3-02; KB: KP-023] Generate charges the price 「Generate」 showed; the credit usage history is the record to match, not the badge.')
line('- R-037 ','- R-037 [PM:pm-flow Artwork mockup] The new job appears in My AI Artwork › Image to Video as a Processing tile and becomes a finished Custom video.')
line('- R-039 ','- R-039 [PM:pm-ui From Save & Share Reuse D2-01] The reused prompt is the prompt sent to the generator.')
line('- R-046 ',"- R-046 [PM:pm-error-handling D2-05] A reused prompt longer than the current model's limit is brought back whole; the box and the counter turn red and 「Generate」 is disabled, as today; no credits are charged (the PM names the limit for Android only, Q-7).")
line('- R-049 ','- R-049 [PM:pm-error-handling D2-08] Not enough credits, Free user: 「Generate」 leads to Upgrade to Premium, as today; no credits are charged.')
line('- R-050 ','- R-050 [PM:pm-error-handling D2-08; KB: KP-013] Not enough credits, subscriber (Pro or Pro+): 「Generate」 leads to 「More Credits Required」, as today; no credits are charged.')
line('- R-052 ','- R-052 [PM:pm-tracking D4-02, D4-03] Generate after Reuse from the Image to Video tab\'s Save & Share sends ImageToVideo_Result_Generate with from = artwork_reuse (a new value on iOS, same as Android).')
line('- R-056 ','- R-056 [PM:pm-ui from_video mockup] The history button at the reused room\'s top right does what it does in a Custom room opened by 「Create more」.')
line('- R-057 ','- R-057 [PM:pm-ui from_video mockup] The credit button at the reused room\'s top shows the account\'s balance and opens what it opens in a Custom room opened by 「Create more」.')
line('- Q-5 ','- Q-5 Back from a Save & Share page opened from Recent (Video): the PM arrow draws only the Image to Video tab path. Assumption: ‹ returns to where the page was opened (Recent). R-034; TC-009.')
line('- Q-7 ','- Q-7 「Android 上限 500」 gives no limit for iOS and names no model. Assumption: the row uses any iOS model whose limit is below the reused prompt\'s length; if no iOS model has a lower limit, the row is retired. R-046; TC-032.')
line('- Q-8 ','- Q-8 How are tracking events observed on iOS? Assumption: rows wait for an event log (log pull or RD event viewer) and are parked until one is set up. R-051 to R-054; TC-037 to TC-040.')
line('- Q-16 ','- Q-16 The Design draws dark frames but no spec says how they are reached. Assumption: the page follows the iPhone\'s Dark appearance; if the app has no dark mode the row is retired. R-068; TC-050.')
line('- Q-16 ',[l for l in t.split('\n') if l.startswith('- Q-16 ')][0]+'\n- Q-17 The spec does not name the iOS route to the credit usage history. Assumption: Mine › My Credits (KP-123 names My Credits only). R-028, R-036; TC-017, TC-025, TC-031.')
t=re.sub(r'\| R-049 \| tier=VIP \(R-050\) \| TC-036 \|\n','| R-049 | tier=Pro (R-050) | TC-036 |\n| R-049 | tier=Pro+ (R-050) | TC-052 |\n',t)
t=t.replace('| R-050 | tier=VIP | TC-036 |','| R-050 | tier=Pro | TC-036 |\n| R-050 | tier=Pro+ | TC-052 |')
t=t.replace('| R-012 | theme=light | TC-006 |','| R-012 | theme=light | TC-006 |\n| R-026 | intro=demo / Steps | TC-015 |\n| R-026 | intro=AI Processing Notice | TC-051 |')
t=t.replace('| Stage | ‹ Back | System Back |\n|---|---|---|','| Stage | ‹ Back |\n|---|---|')
t=re.sub(r'^(\|[^|\n]+\|[^|\n]+\|)[^|\n]+\|$',lambda m:m.group(1),t,flags=re.M) if False else t
open(D+'requirements.md','w').write(t)

rows=list(csv.DictReader(open(A+'draft.csv',encoding='utf-8')))
cols=['ID','Section','Precondition','Action','Expected Result','Priority','Spec Ref','Notes','Change','Change Reason']
rows=[r for r in rows if r['ID'] not in('TC-027','TC-043','TC-044','TC-045','TC-046')]
for r in rows:
    for k in('Precondition','Action','Expected Result','Notes'): r[k]=common(r[k])
    r['Change']='new'; r['Change Reason']=''
    r['Spec Ref']=', '.join(x for x in r['Spec Ref'].split(', ') if x not in('R-040',))
    r['Section']=r['Section'].replace('Android: credits and artwork','Credits and artwork')
    r['Notes']=re.sub(r'\.? ?KP-0(12|17|19|20|26|36)\b[^.]*','',r['Notes']).replace('(KP-036)','')
by={r['ID']:r for r in rows}
by['TC-015']['Action']='1. Tap 「Reuse」\n2. Close the demo / Steps intro'
by['TC-015']['Expected Result']='The intro shows first and no 「Settings applied」 shows over it; after it closes, the Custom page shows and the toast 「Settings applied」 appears'
by['TC-015']['Precondition']=by['TC-015']['Precondition'].replace('explanation sheet','demo / Steps intro')
by['TC-023']['Expected Result']=by['TC-023']['Expected Result'].replace(' shows the chosen photo','  appears').replace('  ',' ')
by['TC-026']['Precondition']=by['TC-026']['Precondition'].replace('a PhotoDirector Android log pull','app log collection on (PhotoDirector log pull not set up yet)')
by['TC-032']['Precondition']=by['TC-032']['Precondition'].replace('longer than 500 characters, made with a model that allows it','longer than another model\'s limit, made with a model that allows it')
by['TC-032']['Action']=by['TC-032']['Action'].replace('a model whose limit is 500','a model with a lower limit')
by['TC-032']['Notes']='PM-only: the Design does not draw this. iOS limit and model: Q-7'
by['TC-036']['Precondition']=by['TC-036']['Precondition'].replace('VIP','Pro').replace('subscriber','Pro subscriber')
by['TC-036']['Notes']='PM-only: the Design does not draw this. Needs a Pro account with low credits (Launcher › Pink › ☰ › [0] IAP › Status = Pro)'
by['TC-042']['Precondition']=by['TC-042']['Precondition'].replace('made on iOS','made on Android')
by['TC-047']['Expected Result']='It opens what it opens in a Custom room opened by 「Create more」'
by['TC-047']['Notes']='PM-only: the Design does not draw this. Compare with 「Create more」 on the same build'
by['TC-048']['Expected Result']="It showed the account's balance, and it opens what it opens in a Custom room opened by 「Create more」"
by['TC-048']['Notes']='PM-only: the Design does not draw this. Compare with 「Create more」 on the same build'
by['TC-050']['Precondition']=by['TC-050']['Precondition'].replace('Phone set to dark theme','iPhone set to Dark appearance')
by['TC-001']['Notes']=by['TC-001']['Notes']
n1=dict(by['TC-015']); n1.update(ID='TC-051',Action='1. Tap 「Reuse」\n2. Close the AI Processing Notice',Precondition=by['TC-015']['Precondition'].replace('demo / Steps intro','AI Processing Notice'),
 **{'Expected Result':'The AI Processing Notice shows first and no 「Settings applied」 shows over it; after it closes, the Custom page shows and the toast 「Settings applied」 appears','Spec Ref':'R-026'})
n2=dict(by['TC-036']); n2.update(ID='TC-052',Precondition=by['TC-036']['Precondition'].replace('Pro subscriber','Pro+ subscriber').replace('Pro ','Pro+ ').replace('Pro+ + ','Pro+ '),Notes=by['TC-036']['Notes'].replace('a Pro account','a Pro+ account').replace('Status = Pro','Status = Pro+'))
rows.insert(rows.index(by['TC-015'])+1,n1); rows.insert(rows.index(by['TC-036'])+1,n2)
w=csv.DictWriter(open(D+'draft.csv','w',encoding='utf-8',newline=''),cols,extrasaction='ignore'); w.writeheader(); w.writerows(rows)
print(len(rows))
