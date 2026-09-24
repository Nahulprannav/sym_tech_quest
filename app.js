(() => {
  const teams=['Alpha','Beta','Gamma','Delta','Epsilon'];
  const keys={Alpha:['AX7-K9','A2-FOX','ARC-41','NOVA-8'],Beta:['BT4-M2','B7-OWL','BYTE-26','ORBIT-3'],Gamma:['GM9-P5','G3-HEX','GRID-58','PULSE-6'],Delta:['DL2-R8','D8-CPU','DATA-73','FLUX-1'],Epsilon:['EP6-W3','E5-ION','NODE-19','QUARK-4']};
  const phrases={Alpha:'TECHQUEST_CHAMPIONS',Beta:'THE_ULTIMATE_GEEKS',Gamma:'MASTERS_OF_CODE',Delta:'CYBER_NINJAS',Epsilon:'KINGS_OF_IT'};
  const banks=[
    [
      {q:'Which HTML element creates a hyperlink?',o:['<a>','<link>','<href>','<url>'],a:0},
      {q:'Which CSS property changes text color?',o:['font-style','color','text-decoration','background'],a:1},
      {q:'What does CSS stand for?',o:['Computer Style Syntax','Cascading Style Sheets','Creative Screen System','Colorful Style Source'],a:1},
      {q:'Which selector targets an element with id="panel"?',o:['.panel','#panel','panel','*panel'],a:1},
      {q:'Which HTML attribute provides alternative text for an image?',o:['title','src','alt','name'],a:2}
    ],[
      {q:'Which keyword declares a block-scoped variable that can be reassigned?',o:['const','let','static','final'],a:1},
      {q:'What does JSON.parse(text) do?',o:['Converts JSON text into a value','Encrypts text','Sends a request','Sorts an array'],a:0},
      {q:'Which operator tests strict equality in JavaScript?',o:['=','==','===','!='],a:2},
      {q:'What is the first index of a JavaScript array?',o:['-1','0','1','Depends on its length'],a:1},
      {q:'Which method adds an item to the end of an array?',o:['push()','shift()','pop()','slice()'],a:0}
    ],[
      {q:'Which format is commonly used for lightweight structured API data?',o:['JSON','BMP','MP3','EXE'],a:0},
      {q:'Which HTTP method is typically used to retrieve data?',o:['POST','PATCH','GET','DELETE'],a:2},
      {q:'In a table, what does a row represent?',o:['A record','A database server','A search filter','A field type'],a:0},
      {q:'Which value represents “no value” in JSON?',o:['undefined','None','nil','null'],a:3},
      {q:'What should you use to find matching records in a directory?',o:['A filter or query','A CSS animation','A font family','A page margin'],a:0}
    ],[
      {q:'A Caesar cipher shifts each letter forward by 3. To decode it, shift…',o:['Forward by 3','Backward by 3','Forward by 13','Backwards by 1'],a:1},
      {q:'Decode the letter H with a backward shift of 3.',o:['E','K','D','F'],a:0},
      {q:'What comes next: 2, 4, 8, 16, …?',o:['18','24','30','32'],a:3},
      {q:'Which is the smallest prime number?',o:['0','1','2','3'],a:2},
      {q:'If every NEX is a ZOR and this item is a NEX, it must be…',o:['A ZOR','Not a ZOR','Both true and false','Unknown'],a:0}
    ],[
      {q:'What does HTTPS add to a web connection?',o:['Encrypted transport','A faster keyboard','More screen pixels','A new file format'],a:0},
      {q:'Which is the safest way to handle a password?',o:['Reuse it everywhere','Share it with teammates online','Use a unique strong password','Write it in public chat'],a:2},
      {q:'What is phishing?',o:['A database backup','A deceptive attempt to steal information','A sorting algorithm','A screen resolution'],a:1},
      {q:'Which response is best for an unexpected login link?',o:['Open it immediately','Check the sender and destination first','Forward it to everyone','Enter your password to test it'],a:1},
      {q:'What does multi-factor authentication add?',o:['Another independent verification step','A second username','A public profile','An easier password'],a:0}
    ]
  ];
  const $=s=>document.querySelector(s), escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeGet=(k,fallback)=>{try{return JSON.parse(sessionStorage.getItem(k))??fallback}catch{return fallback}};
  const safeSet=(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify(v))}catch{}};
  const logEndpoint=new URLSearchParams(location.search).get('log')||'';
  const reportCompletion=(station,score,extra={})=>{
    if(!logEndpoint)return;
    const profile=safeGet('cipher:profile',{name:'',team:''});if(!profile.team)return;
    const record={eventId:`${profile.team}:${profile.name.trim().toLowerCase()}:station-${station}`,teamName:profile.name,assignedTeam:profile.team,station,score,completedAt:new Date().toISOString(),...extra};
    try{fetch(logEndpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(record),keepalive:true}).catch(()=>{});}catch{}
  };
  const teamSel=$('#team'); if(teamSel) teams.forEach(t=>teamSel.add(new Option(`Team ${t}`,t)));

  const page=location.pathname.match(/station([1-5])\.html$/i);
  if(page) renderQuestionStation(Number(page[1]));

  function renderQuestionStation(station){
    const main=$('main.mission'),head=main?.querySelector('.station-head'); if(!main||!head)return;
    const isFinal=station===5;
    if(!isFinal)[...main.children].forEach(node=>{if(node!==main.querySelector('.crumb')&&node!==head)node.remove()});
    const root=document.createElement('section');root.className='panel';root.id='dynamicQuiz';
    if(isFinal){const terminal=main.querySelector('.terminal');main.insertBefore(root,terminal);if(terminal)terminal.hidden=true;}else main.append(root);
    const profile=safeGet('cipher:profile',{name:'',team:''});
    const stateKey=`cipher:station:v2:${station}`;
    let state=safeGet(stateKey,null);
    if(!state || state.team!==profile.team || !state.responses || !Array.isArray(state.ids)){state={team:profile.team,ids:[],responses:{}};safeSet(stateKey,state);}
    const redraw=()=>{
      if(!profile.team){root.innerHTML=`<div class="step-label">FIRST · TEAM REGISTRATION</div><h2>Who is entering the station?</h2><p>Enter your team name and choose the team designation assigned by the event coordinator.</p><div class="field-row"><div class="field"><label for="teamName">Team name</label><input id="teamName" placeholder="Your team name" value="${escapeHtml(profile.name)}" maxlength="32" required></div><div class="field"><label for="team">Assigned team</label><select id="team"><option value="">Choose Alpha–Epsilon…</option>${teams.map(t=>`<option value="${t}">Team ${t}</option>`).join('')}</select></div><button class="btn" id="begin" type="button">START STATION</button></div><p class="small" id="status"></p>`;$('#begin').onclick=()=>{const name=$('#teamName').value.trim(),team=$('#team').value;if(!name||!team){$('#status').textContent='Enter your team name and assigned team to continue.';return;}profile.name=name;profile.team=team;safeSet('cipher:profile',profile);state=safeGet(stateKey,null);if(!state||state.team!==team||!state.responses||!Array.isArray(state.ids)){state={team,ids:[],responses:{}};safeSet(stateKey,state);}redraw();};return;}
      if(!state.ids.length){state.ids=shuffle(banks[station-1].map((_,i)=>i)).slice(0,3);safeSet(stateKey,state);}
      const answered=state.ids.filter(id=>Object.hasOwn(state.responses,id)).length;
      const correct=state.ids.filter(id=>state.responses[id]===banks[station-1][id].a).length;
      const qid=state.ids.find(id=>!Object.hasOwn(state.responses,id));
      let body='';
      if(answered===3){if(isFinal){body=`<div class="step-label">FINAL CHECKPOINT COMPLETE · SCORE ${correct} / 3 CORRECT</div><p>Enter your four station keys to reveal your team’s final phrase.</p>`;}else{const secret=keys[profile.team][station-1];body=`<div class="step-label">STATION COMPLETE · SCORE ${correct} / 3 CORRECT</div><div class="result show"><div class="step-label">TEAM ${profile.team.toUpperCase()} · KEY ${String(station).padStart(2,'0')}</div><div class="key-display">${secret}</div><div class="screenshot-note">📸 TAKE A SCREENSHOT OF YOUR KEY AND SCORE TO SHOW YOUR COORDINATOR</div></div>`;reportCompletion(station,correct,{key:secret});}}
      else {const q=banks[station-1][qid];body=`<div class="step-label">TEAM ${escapeHtml(profile.name)} · ${profile.team.toUpperCase()} · QUESTION ${answered+1} OF 3</div><h2>${escapeHtml(q.q)}</h2><form id="answerForm"><div class="answer-list">${q.o.map((opt,i)=>`<label class="answer-option"><input type="radio" name="answer" value="${i}" required><span>${escapeHtml(opt)}</span></label>`).join('')}</div><button class="btn" type="submit">${answered===2?'FINISH STATION':'NEXT QUESTION'}</button></form><p class="screenshot-note">Five questions in this station’s pool · three selected for your team.</p>`;}
      root.innerHTML=`<div class="step-label">TEAM ASSIGNMENT LOCKED · ${profile.team.toUpperCase()}</div><p class="small">${escapeHtml(profile.name)} · <button class="text-link" id="changeTeam" type="button">Change team</button></p>${body}`;
      if(isFinal&&answered===3){const terminal=main.querySelector('.terminal');if(terminal){terminal.hidden=false;const sel=terminal.querySelector('#team');if(sel)sel.value=profile.team;}}
      $('#changeTeam').onclick=()=>{profile.team='';safeSet('cipher:profile',profile);const terminal=main.querySelector('.terminal');if(terminal)terminal.hidden=true;redraw();};
      if(isFinal&&answered===3)reportCompletion(station,correct,{eventId:`${profile.team}:${profile.name.trim().toLowerCase()}:final-checkpoint`,status:'checkpoint complete'});
      const form=$('#answerForm');if(form)form.onsubmit=e=>{e.preventDefault();const selected=Number(new FormData(form).get('answer'));state.responses[qid]=selected;safeSet(stateKey,state);redraw();};
    };
    redraw();
  }
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

  const decrypt=$('#decryptForm');if(decrypt)decrypt.addEventListener('submit',e=>{e.preventDefault();const t=$('#team').value;let ok=!!t;for(let i=0;i<4;i++)if($(`#key${i+1}`).value.trim().toUpperCase()!==keys[t||'Alpha'][i])ok=false;if(ok){$('#finalResult').innerHTML=`<p class="eyebrow">MASTER CIPHER DECRYPTED · TEAM ${t.toUpperCase()}</p><div class="final-phrase">${phrases[t]}</div><p class="success">MISSION COMPLETE · Tell a coordinator to record your finish time.</p>`;$('#finalResult').classList.add('show');reportCompletion(5,3,{eventId:`${t}:${safeGet('cipher:profile',{name:''}).name.trim().toLowerCase()}:mission-complete`,status:'mission complete',finalPhrase:phrases[t]});}else{$('#finalResult').innerHTML='<p class="error">ACCESS DENIED · Check your team and all four keys against your screenshots.</p>';$('#finalResult').classList.add('show');}});
  const baseInput=$('#baseUrl');if(baseInput){baseInput.value=location.origin==='null'?'':location.origin+location.pathname.replace(/organizer\.html$/,'');$('#makeQR').addEventListener('click',()=>{const base=$('#baseUrl').value.trim().replace(/\/$/,'');const endpoint=$('#sheetEndpoint')?.value.trim()||'';const warning=$('#qrWarning');if(!/^https?:\/\//i.test(base)){warning.textContent='Enter a deployed public base URL (https://...) first. Local file URLs cannot be scanned by other phones.';warning.className='error';return;}if(endpoint&&!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:\?.*)?$/i.test(endpoint)){warning.textContent='The Sheet endpoint should be the deployed Google Apps Script URL ending in /exec.';warning.className='error';return;}if(!window.QRCode){warning.textContent='QR library did not load. Check internet access and reload this organizer page.';warning.className='error';return;}document.querySelectorAll('.qr-box').forEach((box,i)=>{box.innerHTML='';const target=new URL(`${base}/station${i+1}.html`);if(endpoint)target.searchParams.set('log',endpoint);const url=target.toString();new QRCode(box,{text:url,width:150,height:150,colorDark:'#101827',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});const link=document.createElement('a');link.className='download-qr';link.textContent='Download QR PNG';link.download=`project-cipher-station-${i+1}.png`;link.href=box.querySelector('canvas')?.toDataURL('image/png')||'';box.nextElementSibling.replaceChildren(link,document.createElement('br'),document.createTextNode(url));});warning.textContent=endpoint?'Ready. Each completion will be logged to your Google Sheet. Download or print the codes.':'Ready. These codes work without shared logging. Add a deployed Sheet endpoint to record results centrally.';warning.className=endpoint?'success':'small';});}
})();
