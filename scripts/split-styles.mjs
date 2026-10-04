// Splits the isolated package CSS (.build/styles.css) into base.css + per-component files in .build/styles/.
// dist/styles.css stays the full sheet; the split files are for hosts that import only what they use:
//   @import "@nbrain/ui/styles/base.css";   (tokens, reset, every primitive: Button, Input, Select, Dialog, Tabs, ... toasts, menus)
//   @import "@nbrain/ui/styles/tabstrip.css"; radial.css; window.css; choice.css; widgets.css; production.css
// A rule whose selectors belong to several groups is partitioned, so the union of the files is the full sheet.
import fs from 'node:fs';import postcss from 'postcss';
const GROUPS=[
 ['radial',/^(?:nb-radial|nb-dial(?:-|$)|nb-rotary|nb-command-radial|radial-)/],
 ['tabstrip',/^nb-tabstrip/],
 ['choice',/^nb-choice/],
 ['window',/^(?:nb-floating|nb-panel|nb-window|window-|nbrain-glass-panel|nb-glass-panel|glass-panel)/],
 ['widgets',/^(?:nb-widget|nb-asset|nb-queue|nb-tree|nb-chat|nb-joystick|nb-fader|nb-meter|nb-engine|nb-viewport|nb-curve|nb-transform|nb-instrument|nb-scope|nb-dock|nb-connection|nb-numeric|nb-parameter|nb-color|nb-number-widget|nb-scrub)/],
 ['production',/^(?:shot-|workspace-|activity-|calendar-|glass-project|stagger-|nb-schedule|nb-node|nb-table|data-table|table-|nb-graph|board-|agent-(?:card|info|icon|paths|idle|running|ready|blocked)|orchestrator|energy-|project-|approval-|media-transport|timeline|clip|resource-meter|connection-status|prompt-composer|metric|nb-report|nb-art)/]
];
const css=fs.readFileSync('.build/styles.css','utf8');
const ast=postcss.parse(css);
const firstClass=sel=>{const rest=sel.replace(/^:where\(\[data-nbrain-ui\]\)\s*/,'').replace(/^:root(?:\[[^\]]*\])*\s*/,'').replace(/^(?::is|:where)\([^)]*\)\s*/,'');const m=rest.match(/^(?:\[[^\]]*\]\s*)*(?:[a-z]+)?\.(-?[a-zA-Z_][\w-]*)/);return m?m[1]:null};
const groupOf=sel=>{const c=firstClass(sel);if(!c)return 'base';for(const [g,re] of GROUPS)if(re.test(c))return g;return 'base'};
const out=Object.fromEntries([['base',[]],...GROUPS.map(([g])=>[g,[]])]);
// keyframes belong to the only group that animates with them, otherwise base
const usedBy={};ast.walkDecls(/animation/,d=>{const g=groupOf(d.parent.selectors?.[0]||'');for(const w of d.value.split(/[\s,]+/))if(w.startsWith('nb-'))(usedBy[w]??=new Set()).add(g)});
const partition=rule=>{const by={};for(const s of rule.selectors)(by[groupOf(s)]??=[]).push(s);return by};
const clone=(rule,selectors)=>{const c=rule.clone();c.selectors=selectors;return c};
for(const node of ast.nodes){
 if(node.type==='comment')continue;
 if(node.type==='rule'){for(const [g,sels] of Object.entries(partition(node)))out[g].push(sels.length===node.selectors.length?node:clone(node,sels));continue}
 if(node.type==='atrule'&&/keyframes/.test(node.name)){const u=usedBy[node.params];out[u&&u.size===1?[...u][0]:'base'].push(node);continue}
 if(node.type==='atrule'&&node.nodes?.some(n=>n.type==='rule')){
  const per={};
  for(const inner of node.nodes){if(inner.type!=='rule'){(per.base??=[]).push(inner);continue}for(const [g,sels] of Object.entries(partition(inner)))(per[g]??=[]).push(sels.length===inner.selectors.length?inner:clone(inner,sels))}
  for(const [g,rules] of Object.entries(per)){const a=node.clone({nodes:[]});a.removeAll();rules.forEach(r=>a.append(r.clone()));out[g].push(a)}
  continue}
 out.base.push(node);
}
fs.rmSync('.build/styles',{recursive:true,force:true});fs.mkdirSync('.build/styles',{recursive:true});
const report=[];
for(const [g,nodes] of Object.entries(out)){if(!nodes.length)continue;const text=nodes.map(n=>n.toString()).join('\n')+'\n';fs.writeFileSync(`.build/styles/${g}.css`,text);report.push(`${g} ${Buffer.byteLength(text)}`)}
console.log('Split CSS: '+report.join(', '));
