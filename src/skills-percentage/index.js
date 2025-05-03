/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import Edit from './edit';
import { skillsPercentage as icon } from './icons';

/**
 * Register block
 */
registerBlockType('murdeni/skills-percentage', {
    icon,
    edit: Edit,
    save: () => null, // Dynamic block rendered on the server
});
