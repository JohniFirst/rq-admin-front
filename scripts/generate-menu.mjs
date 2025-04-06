import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @typedef {Object} MenuItem
 * @property {number} menuOrder
 * @property {string} title
 * @property {number} id
 * @property {string} url
 * @property {string} icon
 * @property {MenuItem[]} [children]
 */

let currentId = 1;

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTitle(name) {
	return name.split("-").map(capitalize).join(" ");
}

/**
 * @param {string} dir
 * @returns {MenuItem[]}
 */
function scanDirectory(dir, basePath = "") {
	const items = [];
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);
		const relativePath = path.relative(
			path.join(process.cwd(), "src/pages"),
			fullPath
		);

		if (stat.isDirectory() && !file.startsWith(".") && !file.startsWith("_")) {
			const url = `${basePath}/${file}`;
			const children = scanDirectory(fullPath, url);

			items.push({
				menuOrder: items.length + 1,
				title: formatTitle(file),
				id: currentId++,
				url,
				icon: "test",
				...(children.length > 0 ? { children } : {}),
			});
		}
	});

	return items;
}

function generateMenu() {
	const pagesDir = path.join(process.cwd(), "src/pages");
	const menu = scanDirectory(pagesDir);

	const mockFile = path.join(process.cwd(), "mock/menu-list.js");
	const menuContent = `import { responseFormat } from "./response-format"

export default [
  {
    url: '/api/menu/list',
    method: 'get',
    response: ({ query }) => {
      return responseFormat(${JSON.stringify(menu, null, 2)})
    },
  },
]
`;

	fs.writeFileSync(mockFile, menuContent);
	console.log("Menu configuration has been generated successfully!");
}

generateMenu(); 