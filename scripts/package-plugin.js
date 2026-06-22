#!/usr/bin/env node

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mainFile = path.join(root, 'murdeni-blocks.php');
const distDir = path.join(root, 'dist');
const tempDir = path.join(distDir, '.package-tmp');
const pluginSlug = 'Murdeni-Block-WP-Plugin';
const packageRoot = path.join(tempDir, pluginSlug);
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

function run(command, args, options = {}) {
	const result = spawnSync(command, args, {
		cwd: options.cwd || root,
		stdio: 'inherit',
		shell: false,
	});

	if (result.error) {
		throw result.error;
	}

	if (result.status !== 0) {
		throw new Error(`${command} exited with status ${result.status}.`);
	}
}

function zipDirectory(sourceDir, outputFile) {
	if (process.platform === 'win32') {
		run('powershell.exe', [
			'-NoProfile',
			'-ExecutionPolicy',
			'Bypass',
			'-Command',
			`Compress-Archive -Path '${path.join(sourceDir, '*').replace(/'/g, "''")}' -DestinationPath '${outputFile.replace(/'/g, "''")}' -Force`,
		]);
		return;
	}

	run('zip', ['-qr', outputFile, pluginSlug], { cwd: sourceDir });
}

function main() {
	const version = readPluginVersion();
	const outputFile = path.join(distDir, `murdeni-blocks-v${version}.zip`);

	fs.rmSync(tempDir, { recursive: true, force: true });
	fs.mkdirSync(packageRoot, { recursive: true });
	fs.rmSync(outputFile, { force: true });

	for (const file of releaseFiles) {
		const source = path.join(root, file);
		if (!fs.existsSync(source)) {
			continue;
		}
		copyRecursive(source, path.join(packageRoot, file));
	}

	zipDirectory(tempDir, outputFile);
	fs.rmSync(tempDir, { recursive: true, force: true });

	console.log(`Created ${path.relative(root, outputFile)}`);
}

try {
	main();
} catch (error) {
	console.error(error.message);
	process.exit(1);
}
