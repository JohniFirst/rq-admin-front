const fs = require('fs');
const path = require('path');

// 读取文件内容
const filePath = path.join(__dirname, 'src/routes/default-routes.tsx');

try {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // 解析文件内容
  const routeRegex = /(?:default|error)Routes: RouteObject\[\] = \[([\s\S]*?)\]/g;
  const routeMatches = fileContent.matchAll(routeRegex);

  const routeComponentMap = {};

  for (const match of routeMatches) {
    const routes = match[1];
    const routePairs = routes.matchAll(/\{ path: "(.*?)",\n element: <(.*?) \/> \}/g);

    for (const pair of routePairs) {
      const [, routePath, component] = pair;
      const importRegex = new RegExp(`import ${component} from "([^"]*)"`);
      const importMatch = fileContent.match(importRegex);
      if (importMatch) {
        const importPath = importMatch[1].replace(/'|"/g, '');
        routeComponentMap[routePath.trim()] = importPath;
      }
    }
  }

  console.log(routeComponentMap);
} catch (err) {
  console.error(`读取文件时出错: ${err.message}`);
}
