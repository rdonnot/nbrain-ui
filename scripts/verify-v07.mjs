// 0.7 surface: native-element drop-ins (NativeSelect, Checkbox/CheckInput, Switch/SwitchInput, Radio, RangeInput, ColorInput, FileInput), Input/Textarea sizes.
import fs from 'node:fs';
import {build} from 'esbuild';
import {JSDOM,VirtualConsole} from 'jsdom';
const source=`import React from 'react';import{createRoot}from'react-dom/client';import{flushSync}from'react-dom';
import{NBrainProvider,DensityScope,Input,Textarea,NativeSelect,Checkbox,CheckInput,Switch,SwitchInput,Radio,RangeInput,ColorInput,FileInput}from'./src/index';
window.__log=[];window.__refs={};
function App(){const[sel,setSel]=React.useState('b');const[chk,setChk]=React.useState(false);const[rg,setRg]=React.useState(25);const[rad,setRad]=React.useState('x');
 return <NBrainProvider><DensityScope density="compact" fontScale={1.1}>
  <NativeSelect id="ns" name="codec" data-testid="ns" title="Codec" aria-label="Codec" value={sel} onChange={e=>{window.__log.push('sel:'+e.target.value);setSel(e.target.value)}} ref={r=>{window.__refs.select=r}} size="sm"><optgroup label="G"><option value="a">A</option><option value="b">B</option></optgroup></NativeSelect>
  <NativeSelect id="ns-off" disabled className="mine" style={{width:120}} aria-label="Off"><option>Z</option></NativeSelect>
  <Checkbox id="bx" name="bx" data-k="1" aria-label="Unlabelled" defaultChecked onCheckedChange={v=>window.__log.push('cb:'+v)}/>
  <Checkbox label="Labelled" checked={chk} onCheckedChange={setChk}/>
  <Checkbox aria-label="Mixed" indeterminate checked={false} onCheckedChange={()=>{}}/>
  <CheckInput id="ci" data-k="2" name="ci" aria-label="Native check" checked={chk} onChange={e=>{window.__log.push('ci:'+e.target.checked);setChk(e.target.checked)}} ref={r=>{window.__refs.check=r}}/>
  <CheckInput id="ci2" aria-label="Indeterminate" indeterminate defaultChecked={false}/><CheckInput label="With label" defaultChecked id="ci3"/>
  <Switch aria-label="Sw" defaultChecked onCheckedChange={v=>window.__log.push('sw:'+v)} id="sw"/>
  <SwitchInput id="si" label="Switch input" onChange={e=>window.__log.push('si:'+e.target.checked)}/>
  <Radio name="r" value="x" checked={rad==='x'} onChange={()=>setRad('x')} id="rx" aria-label="X" data-k="3"/><Radio name="r" value="y" label="Y label" checked={rad==='y'} onChange={()=>setRad('y')} id="ry"/>
  <RangeInput id="rg" aria-label="Range" min={0} max={200} step={5} value={rg} onChange={e=>{window.__log.push('rg:'+e.target.value);setRg(Number(e.target.value))}} data-k="4" ref={r=>{window.__refs.range=r}}/>
  <RangeInput id="rgu" aria-label="Uncontrolled" min={10} max={20} defaultValue={15} size="xs"/>
  <ColorInput id="co" aria-label="Colour" defaultValue="#ff0000" size="sm" onChange={e=>window.__log.push('co:'+e.target.value)} data-k="5"/>
  <FileInput id="fi" aria-label="Files" accept=".png" multiple buttonLabel="Pick it" data-k="6" onChange={e=>window.__log.push('fi:'+e.target.files.length)} ref={r=>{window.__refs.file=r}} className="wrap-me"/>
  <Input id="in-d" type="date" size="xs" aria-label="Date" data-k="7" defaultValue="2026-10-12"/><Input id="in-n" type="number" size="sm" aria-label="Num" htmlSize={4}/><Input id="in-s" type="search" aria-label="S"/><Textarea id="ta" size="xs" aria-label="T"/>
 </DensityScope>
 <DensityScope asContext density="compact"><NativeSelect id="ctx-sel" aria-label="ctx"><option>1</option></NativeSelect><RangeInput id="ctx-rg" aria-label="ctxr"/></DensityScope></NBrainProvider>}
flushSync(()=>createRoot(document.getElementById('root')).render(<App/>));`;
const bundle=await build({stdin:{contents:source,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}});
const failures=[],checks=[],vc=new VirtualConsole();vc.on('jsdomError',e=>failures.push(String(e.message)));
const dom=new JSDOM('<html><body><div id="root"></div></body></html>',{url:'https://v07.test',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc});
const w=dom.window,d=w.document;
w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}});w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
w.HTMLElement.prototype.scrollIntoView=function(){};w.Element.prototype.getAnimations=function(){return []};
const errs=[];const ce=w.console.error;w.console.error=(...a)=>{errs.push(a.map(String).join(' '))};
w.eval(bundle.outputFiles[0].text);
const wait=(ms=120)=>new Promise(r=>setTimeout(r,ms));await wait();
const check=(n,b)=>(b?checks:failures).push(n);
const $=s=>d.querySelector(s);
const setVal=(el,v,ev='input')=>{const proto=Object.getPrototypeOf(el);Object.getOwnPropertyDescriptor(proto,'value').set.call(el,v);el.dispatchEvent(new w.Event(ev,{bubbles:true}))};

// NativeSelect
const ns=$('#ns');
check('NativeSelect is a real <select> with options and optgroup',ns?.tagName==='SELECT'&&ns.querySelectorAll('option').length===2&&!!ns.querySelector('optgroup'));
check('NativeSelect forwards id, name, data-*, title, aria-label and the ref',ns.id==='ns'&&ns.name==='codec'&&ns.dataset.testid==='ns'&&ns.title==='Codec'&&ns.getAttribute('aria-label')==='Codec'&&w.__refs.select===ns);
check('NativeSelect keeps nb-input look, size class and the user className/style',ns.classList.contains('nb-input')&&ns.classList.contains('nb-native-select')&&ns.classList.contains('nb-size-sm')&&$('#ns-off').classList.contains('mine')&&$('#ns-off').style.width==='120px'&&$('#ns-off').disabled);
check('NativeSelect value is controlled',ns.value==='b');
setVal(ns,'a','change');await wait();
check('NativeSelect native onChange gets e.target.value',w.__log.includes('sel:a')&&ns.value==='a');
check('NativeSelect inside a DensityScope carries the density and font scale',ns.getAttribute('data-nbrain-density')==='compact'&&ns.style.getPropertyValue('--nb-font-scale')==='1.1');
check('NativeSelect in a context-only DensityScope still gets the density attribute',$('#ctx-sel').getAttribute('data-nbrain-density')==='compact');
// Checkbox (Base UI)
const bx=$('[data-k="1"]');const bxIn=$('input#bx');
check('Checkbox: label is optional; aria-label and data-* reach the box, id and name the hidden input',!!bx&&bxIn?.name==='bx'&&bx.getAttribute('aria-label')==='Unlabelled'&&bx.dataset.k==='1'&&bx.getAttribute('role')==='checkbox'&&bx.classList.contains('nb-checkbox')&&!bx.closest('label'));
check('Checkbox: defaultChecked works uncontrolled',bx.getAttribute('aria-checked')==='true'||bx.hasAttribute('data-checked'));
bx.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await wait();
check('Checkbox: onCheckedChange fires',w.__log.includes('cb:false'));
check('Checkbox: labelled form still wraps in a label',!!$('label.check-label .nb-checkbox')&&$('label.check-label').textContent.includes('Labelled'));
check('Checkbox: indeterminate reports aria-checked=mixed',[...d.querySelectorAll('[role=checkbox]')].some(e=>e.getAttribute('aria-label')==='Mixed'&&e.getAttribute('aria-checked')==='mixed'));
// CheckInput
const ci=$('#ci');
check('CheckInput is a native checkbox input with id/name/data-*/ref',ci.tagName==='INPUT'&&ci.type==='checkbox'&&ci.name==='ci'&&ci.dataset.k==='2'&&w.__refs.check===ci&&ci.classList.contains('nb-check-input'));
ci.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await wait();
check('CheckInput: native onChange(e.target.checked) and controlled checked',w.__log.includes('ci:true')&&ci.checked);
check('CheckInput: indeterminate sets the DOM property and aria-checked',$('#ci2').indeterminate===true&&$('#ci2').getAttribute('aria-checked')==='mixed');
check('CheckInput: label prop wraps input and text in a label',$('#ci3').closest('label.check-label')?.textContent==='With label'&&$('#ci3').checked);
check('CheckInput carries the density attribute',ci.getAttribute('data-nbrain-density')==='compact');
// Switch
const sw=$('[role=switch][aria-label=Sw]');
check('Switch: label optional, aria-label kept, defaultChecked',sw.getAttribute('role')==='switch'&&sw.getAttribute('aria-label')==='Sw'&&sw.classList.contains('nb-switch')&&sw.hasAttribute('data-checked'));
sw.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await wait();check('Switch: onCheckedChange fires',w.__log.includes('sw:false'));
const si=$('#si');si.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await wait();
check('SwitchInput: native input role=switch with native onChange and a label',si.type==='checkbox'&&si.getAttribute('role')==='switch'&&w.__log.includes('si:true')&&si.closest('label')?.textContent==='Switch input');
// Radio
const rx=$('#rx'),ry=$('#ry');
check('Radio: native radios sharing a name, forwarding props',rx.type==='radio'&&rx.name==='r'&&rx.dataset.k==='3'&&rx.checked&&!ry.checked&&ry.closest('label')?.textContent==='Y label');
ry.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await wait();
check('Radio: native onChange moves the selection',ry.checked&&!rx.checked);
// RangeInput
const rg=$('#rg');
check('RangeInput is a native range with min/max/step/id/data-*/ref',rg.type==='range'&&rg.min==='0'&&rg.max==='200'&&rg.step==='5'&&rg.dataset.k==='4'&&w.__refs.range===rg&&rg.classList.contains('nb-range'));
check('RangeInput controlled: --nb-range-pct follows value/min/max (25/200 = 12.5%)',rg.style.getPropertyValue('--nb-range-pct')==='12.5%');
setVal(rg,'100');await wait();
check('RangeInput: native onChange and the filled % update (100/200 = 50%)',w.__log.includes('rg:100')&&rg.style.getPropertyValue('--nb-range-pct')==='50%');
const ru=$('#rgu');
check('RangeInput uncontrolled: initial % from defaultValue (15 in 10..20 = 50%)',ru.style.getPropertyValue('--nb-range-pct')==='50%'&&ru.classList.contains('nb-size-xs'));
setVal(ru,'20');await wait();
check('RangeInput uncontrolled: % follows user input (100%)',ru.style.getPropertyValue('--nb-range-pct')==='100%');
check('RangeInput keeps the density attribute and keeps the density font var',rg.getAttribute('data-nbrain-density')==='compact'&&rg.style.getPropertyValue('--nb-font-scale')==='1.1');
// ColorInput
const co=$('#co');
check('ColorInput is a native color input with size class, props and defaultValue',co.type==='color'&&co.classList.contains('nb-swatch-input')&&co.classList.contains('nb-swatch-sm')&&co.dataset.k==='5'&&co.value==='#ff0000');
setVal(co,'#00ff00');await wait();check('ColorInput native onChange',w.__log.includes('co:#00ff00'));
// FileInput
const fi=$('#fi');
check('FileInput: real <input type=file> with accept/multiple/id/data-*, ref goes to the input',fi.tagName==='INPUT'&&fi.type==='file'&&fi.accept==='.png'&&fi.multiple&&fi.dataset.k==='6'&&w.__refs.file===fi);
check('FileInput: Button-looking trigger with buttonLabel and the placeholder name; className on the wrapper',fi.parentElement.classList.contains('nb-file-input')&&fi.parentElement.classList.contains('wrap-me')&&fi.parentElement.querySelector('.nb-button.button-secondary')?.textContent==='Pick it'&&fi.parentElement.querySelector('.nb-file-input-name').textContent==='No file chosen');
let clicked=0;fi.addEventListener('click',()=>clicked++);w.__refs.file.click();check('FileInput: ref.click() opens the native picker',clicked===1);
const mk=n=>new w.File(['x'],n);
const setFiles=(el,fs_)=>{Object.defineProperty(el,'files',{value:Object.assign(fs_,{item:i=>fs_[i]}),configurable:true});el.dispatchEvent(new w.Event('change',{bubbles:true}))};
setFiles(fi,[mk('a.png')]);await wait();
check('FileInput: shows the chosen file name and fires native onChange',w.__log.includes('fi:1')&&fi.parentElement.querySelector('.nb-file-input-name').textContent==='a.png');
setFiles(fi,[mk('a.png'),mk('b.png')]);await wait();
check('FileInput: several files show a count',fi.parentElement.querySelector('.nb-file-input-name').textContent==='2 files');
// Input / Textarea
check('Input: size xs/sm add classes, md adds none, htmlSize is the native size',$('#in-d').classList.contains('nb-size-xs')&&$('#in-n').classList.contains('nb-size-sm')&&$('#in-n').getAttribute('size')==='4'&&!$('#in-s').className.includes('nb-size'));
check('Input renders date/number/search types and forwards props',$('#in-d').type==='date'&&$('#in-d').value==='2026-10-12'&&$('#in-d').dataset.k==='7'&&$('#in-n').type==='number'&&$('#in-s').type==='search');
check('Textarea takes size',$('#ta').classList.contains('nb-textarea')&&$('#ta').classList.contains('nb-size-xs'));
// stylesheet
const css=fs.existsSync('dist/styles.css')?fs.readFileSync('dist/styles.css','utf8'):fs.readFileSync('src/styles.css','utf8');
check('CSS: chevron, check, range (webkit + moz), swatch, file rules and date picker colour scheme ship',['.nb-native-select','.nb-check-input','--nb-range-pct','::-webkit-slider-thumb','::-moz-range-progress','::-webkit-color-swatch','::-moz-color-swatch','.nb-file-input-native','::-webkit-calendar-picker-indicator','color-scheme:dark'].every(s=>css.includes(s)));
check('CSS: compact density rules exist for the new controls',/data-nbrain-density=compact\]\s*\.nb-check-input/.test(css)||css.includes('[data-density=compact] .nb-check-input'));
const bad=errs.filter(e=>!/act\(|not wrapped/.test(e));check('No React warnings or errors ('+bad.length+')',bad.length===0);if(bad.length)console.log(bad.join('\n'));
check('No runtime errors',failures.length===0);
fs.writeFileSync('v07-checks.json',JSON.stringify({checks,failures},null,2));console.log(JSON.stringify({checks:checks.length,failures},null,2));dom.window.close();process.exit(failures.length?1:0);
