import fs from 'node:fs';import path from 'node:path';
let html=fs.readFileSync('dist-demo/index.html','utf8');
const image='data:image/png;base64,'+fs.readFileSync('public/assets/identity.png').toString('base64');
html=html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,(_,p)=>'<style>'+fs.readFileSync(path.join('dist-demo',p),'utf8')+'</style>');
html=html.replace(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g,(_,p)=>{let js=fs.readFileSync(path.join('dist-demo',p),'utf8').replaceAll('./assets/identity.png',image);return '<script type="module">'+js.replaceAll('</script','<\\/script')+'</script>'});
fs.writeFileSync('nbrain-component-atelier.html',html);
fs.writeFileSync('nbrain-radial-inspector.html',html.replace('<head>','<head><script>if(!location.hash)location.hash="/radial";</script>'));
console.log('Standalone HTML ready: atelier and radial inspector');
