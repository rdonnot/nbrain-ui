// 0.6 surface: density, compound exports, SegmentedControl / IconButton, ContextMenu, toast store, CSS split.
import fs from 'node:fs';
import {build} from 'esbuild';
import {JSDOM,VirtualConsole} from 'jsdom';
const source=`import React from 'react';import{createRoot}from'react-dom/client';import{flushSync}from'react-dom';
import{Eye,Box}from'lucide-react';
import{NBrainProvider,Button,DensityScope,IconButton,SegmentedControl,toast,ToastHost,ContextMenu,
 SelectRoot,SelectTrigger,SelectValue,SelectContent,SelectItem,SelectGroup,SelectLabel,SelectSeparator,
 DropdownMenuRoot,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem,DropdownMenuCheckboxItem,DropdownMenuRadioGroup,DropdownMenuRadioItem,DropdownMenuSeparator,DropdownMenuShortcut,DropdownMenuLabel,DropdownMenuGroup,DropdownMenuSub,DropdownMenuSubTrigger,DropdownMenuSubContent,
 PopoverRoot,PopoverTrigger,PopoverContent,PopoverHeader,PopoverTitle,PopoverDescription,
 SheetRoot,SheetTrigger,SheetContent,SheetHeader,SheetFooter,SheetTitle,SheetDescription,SheetClose}from'./src/index';
window.__toast=toast;window.__log=[];
function App(){const[seg,setSeg]=React.useState('a');const[sel,setSel]=React.useState('one');const[chk,setChk]=React.useState(true);
 return <NBrainProvider><DensityScope fontScale={1.2}>
  <Button size="xs" id="xs">xs</Button><IconButton aria-label="Show" icon={<Eye size={12}/>} size="xs" pressed/>
  <SegmentedControl label="View" iconOnly value={seg} onValueChange={setSeg} items={[{value:'a',label:'Solid',icon:<Box size={12}/>},{value:'b',label:'Wire',icon:<Eye size={12}/>},{value:'c',label:'Off',icon:<Eye size={12}/>,disabled:true}]}/>
  <SelectRoot value={sel} onValueChange={v=>setSel(String(v))}><SelectTrigger size="sm" aria-label="Pick"><SelectValue/></SelectTrigger><SelectContent><SelectGroup><SelectLabel>Group</SelectLabel><SelectItem value="one">One</SelectItem><SelectSeparator/><SelectItem value="two">Two</SelectItem></SelectGroup></SelectContent></SelectRoot>
  <DropdownMenuRoot><DropdownMenuTrigger id="dd">Menu</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuGroup><DropdownMenuLabel>Label</DropdownMenuLabel></DropdownMenuGroup><DropdownMenuItem variant="destructive" onClick={()=>window.__log.push('del')}>Delete<DropdownMenuShortcut>Del</DropdownMenuShortcut></DropdownMenuItem><DropdownMenuSeparator/><DropdownMenuCheckboxItem checked={chk} onCheckedChange={setChk}>Check</DropdownMenuCheckboxItem><DropdownMenuRadioGroup value="r1"><DropdownMenuRadioItem value="r1">R1</DropdownMenuRadioItem></DropdownMenuRadioGroup><DropdownMenuSub><DropdownMenuSubTrigger>More</DropdownMenuSubTrigger><DropdownMenuSubContent><DropdownMenuItem>Deep</DropdownMenuItem></DropdownMenuSubContent></DropdownMenuSub></DropdownMenuContent></DropdownMenuRoot>
  <PopoverRoot><PopoverTrigger id="pop">Pop</PopoverTrigger><PopoverContent><PopoverHeader><PopoverTitle>Title</PopoverTitle><PopoverDescription>Desc</PopoverDescription></PopoverHeader>Body</PopoverContent></PopoverRoot>
  <SheetRoot><SheetTrigger id="sheet">Sheet</SheetTrigger><SheetContent side="left"><SheetHeader><SheetTitle>Sheet title</SheetTitle><SheetDescription>d</SheetDescription></SheetHeader><SheetFooter><SheetClose>Done</SheetClose></SheetFooter></SheetContent></SheetRoot>
  <ContextMenu items={[{label:'Copy',shortcut:'Ctrl C',onClick:()=>window.__log.push('copy')},{type:'separator'},{label:'Sub',children:[{label:'Inner'}]},{label:'Off',disabled:true}]}><div id="ctx">target</div></ContextMenu>
 </DensityScope><ToastHost/></NBrainProvider>}
flushSync(()=>createRoot(document.getElementById('root')).render(<App/>));`;
const bundle=await build({stdin:{contents:source,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}});
const vcLog=[];const failures=[],checks=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{vcLog.push(String(e.message));failures.push(String(e.message))});
const dom=new JSDOM('<html><body><div id="root"></div></body></html>',{url:'https://v06.test',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc});
const w=dom.window,d=w.document;
w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}});w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
w.HTMLElement.prototype.scrollIntoView=function(){};w.Element.prototype.getAnimations=function(){return []};
w.eval(bundle.outputFiles[0].text);
const wait=(ms=200)=>new Promise(r=>setTimeout(r,ms));await wait();
const check=(n,b)=>(b?checks:failures).push(n);
const click=e=>{if(!e){failures.push('missing click target at '+new Error().stack.split('\n')[2]);return}e.dispatchEvent(new w.MouseEvent('click',{bubbles:true}))};
const key=(e,k)=>e.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true}));

// density
check('DensityScope sets data-nbrain-density=compact',d.querySelector('.nb-density-scope')?.getAttribute('data-nbrain-density')==='compact');
check('DensityScope carries the font scale',d.querySelector('.nb-density-scope').style.getPropertyValue('--nb-font-scale')==='1.2');
check('Button size xs',d.querySelector('#xs').classList.contains('button-xs'));
const ib=d.querySelector('button[aria-label="Show"]');
check('IconButton keeps its aria-label and the icon-xs size',!!ib&&ib.classList.contains('button-icon-xs')&&ib.getAttribute('aria-pressed')==='true');
// segmented
const radios=[...d.querySelectorAll('[role=radiogroup][aria-label=View] [role=radio]')];
check('Segmented: icon-only items are named by aria-label',radios.length===3&&radios[0].getAttribute('aria-label')==='Solid'&&radios[0].textContent==='');
check('Segmented: first item is checked and focusable only',radios[0].getAttribute('aria-checked')==='true'&&radios[0].tabIndex===0&&radios[1].tabIndex===-1);
key(radios[0],'ArrowRight');await wait();
check('Segmented: arrow key moves to the next enabled item',d.querySelectorAll('[role=radiogroup][aria-label=View] [role=radio]')[1].getAttribute('aria-checked')==='true');
key(d.querySelectorAll('[role=radiogroup][aria-label=View] [role=radio]')[1],'ArrowRight');await wait();
check('Segmented: arrow key skips the disabled item',d.querySelectorAll('[role=radiogroup][aria-label=View] [role=radio]')[0].getAttribute('aria-checked')==='true');
// select
click(d.querySelector('[aria-label=Pick]'));await wait(300);
check('SelectContent renders items in a compact popup',!!d.querySelector('.nb-select-popup[data-nbrain-density=compact] .nb-menu-item'));
check('SelectLabel and SelectSeparator render',!!d.querySelector('.nb-menu-label')&&!!d.querySelector('.nb-menu-separator'));
d.activeElement?.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await wait(300);
// dropdown
click(d.querySelector('#dd'));await wait(300);
check('DropdownMenu parts render (label, destructive item, shortcut, check, radio, sub trigger)',!!d.querySelector('.nb-menu-label')&&!!d.querySelector('[data-variant=destructive]')&&!!d.querySelector('.nb-menu-shortcut')&&d.querySelectorAll('.nb-menu-indicator').length>=1&&[...d.querySelectorAll('.nb-menu-item')].some(i=>i.textContent==='More'));
click([...d.querySelectorAll('[data-variant=destructive]')][0]);await wait(300);
check('DropdownMenuItem click runs the handler',w.__log.includes('del'));
// popover
click(d.querySelector('#pop'));await wait(300);
check('PopoverContent with header, title, description',d.querySelector('.popover-content .nb-popover-title')?.textContent==='Title'&&d.querySelector('.nb-popover-description')?.textContent==='Desc');
d.activeElement?.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await wait(300);
// sheet
click(d.querySelector('#sheet'));await wait(300);
check('SheetContent opens on the requested side with a close button',!!d.querySelector('.nb-sheet.nb-sheet-left[role=dialog]')&&!!d.querySelector('.nb-sheet-close'));
click([...d.querySelectorAll('button')].find(b=>b.textContent==='Done'));await wait(300);
check('SheetClose closes it',!d.querySelector('.nb-sheet'));
// context menu
d.querySelector('#ctx').dispatchEvent(new w.MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:10,clientY:10}));await wait(300);
check('ContextMenu opens with shortcut, separator, submenu and disabled entries',!!d.querySelector('.nb-menu-shortcut')&&!!d.querySelector('.nb-menu-separator')&&!!d.querySelector('.nb-menu-chevron')&&!!d.querySelector('.nb-menu-item[data-disabled]'));
click([...d.querySelectorAll('.nb-menu-item')].find(i=>i.textContent.startsWith('Copy')));await wait(300);
check('ContextMenu item click runs the handler',w.__log.includes('copy'));
// toast
const t=w.__toast;
const id=t({id:'job',kind:'running',title:'Render',message:'Working',progress:.25,timeout:0,actions:[{label:'Cancel',onClick:()=>w.__log.push('cancel')}]});await wait();
const card=()=>d.querySelector('[data-toast-id=job]');
check('Toast: kind, progress bar and action render',card()?.dataset.kind==='running'&&card().querySelector('[role=progressbar]').getAttribute('aria-valuenow')==='25'&&card().querySelector('.nb-toast-actions button')?.textContent.trim()==='Cancel');
t({id:'job',kind:'running',title:'Render',message:'Again',timeout:0});await wait();
check('Toast: same id replaces in place (no duplicate)',d.querySelectorAll('[data-toast-id=job]').length===1&&card().textContent.includes('Again'));
t.update('job',{kind:'success',message:'Done',progress:1,timeout:150});await wait(60);
check('Toast: update patches in place',card()?.dataset.kind==='success'&&card().textContent.includes('Done'));
await wait(900);
check('Toast: update re-arms the timeout and the card leaves',!card());
const e1=t.error('boom');await wait();check('Toast: error sugar renders as an alert',d.querySelector(`[data-toast-id="${e1}"]`)?.getAttribute('role')==='alert');
t.dismiss(e1);await wait(500);check('Toast: dismiss by id',!d.querySelector(`[data-toast-id="${e1}"]`));

// split stylesheet: every selector of the full sheet lives in exactly one split file, and the files are the ones the package exports
import postcss from 'postcss';
const sels=file=>{const out=[];postcss.parse(fs.readFileSync(file,'utf8')).walkRules(r=>{if(r.parent.type==='atrule'&&/keyframes/.test(r.parent.name))return;const ctx=r.parent.type==='atrule'?'@'+r.parent.name+r.parent.params+' ':'';for(const s of r.selectors)out.push(ctx+s+'{'+r.nodes.map(n=>n.toString()).join(';')+'}')});return out};
const full=sels('dist/styles.css'),parts=fs.readdirSync('dist/styles').filter(f=>f.endsWith('.css')).flatMap(f=>sels('dist/styles/'+f));
const have=new Set(parts);const missing=full.filter(x=>!have.has(x));
check('Split CSS: base.css exists and is smaller than the full sheet',fs.statSync('dist/styles/base.css').size<fs.statSync('dist/styles.css').size*.6);
check('Split CSS: every rule of styles.css is in some split file ('+missing.length+' missing)',missing.length===0);
check('Split CSS: base.css has the tokens and no radial/widget rules',/--nb-background/.test(fs.readFileSync('dist/styles/base.css','utf8'))&&!/nb-radial-/.test(fs.readFileSync('dist/styles/base.css','utf8'))&&!/nb-widget-frame/.test(fs.readFileSync('dist/styles/base.css','utf8')));
check('No runtime errors',failures.length===0);
fs.writeFileSync('v06-checks.json',JSON.stringify({checks,failures},null,2));console.log(JSON.stringify({checks:checks.length,failures},null,2));dom.window.close();process.exit(failures.length?1:0);
