#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mainFile = path.join(root, 'murdeni-blocks.php');
const pluginSlug = 'Murdeni-Block-WP-Plugin';
const uploadRoot = path.resolve(root, '..', '..', 'pluginupload');
const outputDir = path.join(uploadRoot, pluginSlug);
const releaseFiles = [
	'assets',
	'build',
	'includes',
	'languages',
	'murdeni-blocks.php',
	'README.md',
];

function readPluginVersion() {
	const contents = fs.readFileSync(mainFile, 'utf8');
	const match = contents.match(/Version:\s*([^\s]+)/);

	if (!match) {
		throw new Error('Unable to find plugin version in murdeni-blocks.php.');
	}

	return match[1];
}

function assertSafeOutputPath(targetPath) {
	const resolvedTarget = path.resolve(targetPath);
	const resolvedUploadRoot = path.resolve(uploadRoot);

	if (
		!resolvedTarget.startsWith(resolvedUploadRoot + path.sep) ||
		path.basename(resolvedTarget) !== pluginSlug
	) {
		throw new Error(`Refusing to clean unsafe output path: ${resolvedTarget}`);
	}
}

function copyRecursive(source, destination) {
	const stat = fs.statSync(source);

	if (stat.isDirectory()) {
		fs.mkdirSync(destination, { recursive: true });
		for (const entry of fs.readdirSync(source)) {
			copyRecursive(path.join(source, entry), path.join(destination, entry));
		}
		return;
	}

	fs.mkdirSync(path.dirname(destination), { recursive: true });
	fs.copyFileSync(source, destination);
}

function main() {
	const version = readPluginVersion();

	assertSafeOutputPath(outputDir);
	fs.rmSync(outputDir, { recursive: true, force: true });
	fs.mkdirSync(outputDir, { recursive: true });

	for (const file of releaseFiles) {
		const source = path.join(root, file);
		if (!fs.existsSync(source)) {
			continue;
		}
		copyRecursive(source, path.join(outputDir, file));
	}

	console.log(`Copied Murdeni Blocks v${version} to ${outputDir}`);
}

try {
	main();
} catch (error) {
	console.error(error.message);
	process.exit(1);
}
