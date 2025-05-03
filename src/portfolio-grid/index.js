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
import { portfolioGrid as icon } from './icons';

/**
 * Register block
 */
registerBlockType('murdeni/portfolio-grid', {
    icon,
    edit: Edit,
    save: () => null, // Dynamic block rendered on the server
});
