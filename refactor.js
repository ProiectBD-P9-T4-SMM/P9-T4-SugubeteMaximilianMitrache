const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// Replace component calls back to JSX
code = code.replace(/\{currentPage === 'login' && ViewLogin\(\)\}/g, "{currentPage === 'login' && <ViewLogin navigate={navigate} setUser={setUser} />}");
code = code.replace(/\{currentPage === 'public' && ViewPublicPortal\(\)\}/g, "{currentPage === 'public' && <ViewPublicPortal />}");
code = code.replace(/\{currentPage === 'dashboard' && ViewDashboard\(\)\}/g, "{currentPage === 'dashboard' && <ViewDashboard navigate={navigate} />}");
code = code.replace(/\{currentPage === 'students' && ViewStudents\(\)\}/g, "{currentPage === 'students' && <ViewStudents />}");
code = code.replace(/\{currentPage === 'reports' && ViewReports\(\)\}/g, "{currentPage === 'reports' && <ViewReports />}");
code = code.replace(/\{currentPage === 'documents' && ViewDocuments\(\)\}/g, "{currentPage === 'documents' && <ViewDocuments />}");
code = code.replace(/\{currentPage === 'admin' && ViewAdmin\(\)\}/g, "{currentPage === 'admin' && <ViewAdmin />}");

code = code.replace(/<Header \/>/g, "<Header navigate={navigate} currentPage={currentPage} user={user} setUser={setUser} />");

// Move components outside App
// Find the start of App
const appStart = code.indexOf('export default function App() {');

// Extract components from inside App
const compsToMove = [
  { name: 'Header', props: '{ navigate, currentPage, user, setUser }' },
  { name: 'Footer', props: '' },
  { name: 'ViewLogin', props: '{ navigate, setUser }' },
  { name: 'ViewPublicPortal', props: '' },
  { name: 'ViewDashboard', props: '{ navigate }' },
  { name: 'ViewStudents', props: '' },
  { name: 'ViewReports', props: '' },
  { name: 'ViewDocuments', props: '' },
  { name: 'ViewAdmin', props: '' }
];

let extractedComps = '';

for (const comp of compsToMove) {
  const startRegex = new RegExp(`const ${comp.name} = \\(\\) => \\{?|const ${comp.name} = \\(\\) => \\(`);
  const match = code.match(startRegex);
  if (match) {
    let startIndex = match.index;
    
    // Find matching brace/paren
    let openCount = 0;
    let endIndex = startIndex;
    let started = false;
    
    for (let i = startIndex; i < code.length; i++) {
      if (code[i] === '{' || code[i] === '(') {
        openCount++;
        started = true;
      } else if (code[i] === '}' || code[i] === ')') {
        openCount--;
      }
      
      if (started && openCount === 0) {
        // If it's an arrow function without block body, we need to include the trailing semicolon
        endIndex = i + 1;
        if (code[endIndex] === ';') endIndex++;
        break;
      }
    }
    
    let compCode = code.substring(startIndex, endIndex);
    // Remove from App
    code = code.substring(0, startIndex) + code.substring(endIndex);
    
    // Add props
    if (comp.props) {
      compCode = compCode.replace(`const ${comp.name} = () =>`, `const ${comp.name} = (${comp.props}) =>`);
    }
    
    extractedComps += compCode + '\n\n';
  }
}

// remove leftover variables inside App that we moved to ViewLogin
code = code.replace(/const \[loginError, setLoginError\] = useState\(''\);\n/, '');
code = code.replace(/const \[usernameInput, setUsernameInput\] = useState\(''\);\n/, '');

// Add useState to ViewLogin
extractedComps = extractedComps.replace(/const ViewLogin = \(\{ navigate, setUser \}\) => \(/, `const ViewLogin = ({ navigate, setUser }) => {
  const [loginError, setLoginError] = React.useState('');
  const [usernameInput, setUsernameInput] = React.useState('');
  return (`).replace(/<\/div>\n    <\/div>\n  \);/, `</div>\n    </div>\n  );\n};`);


code = code.replace('export default function App() {', extractedComps + 'export default function App() {');

fs.writeFileSync('src/App.jsx', code);
console.log('Refactored App.jsx');

