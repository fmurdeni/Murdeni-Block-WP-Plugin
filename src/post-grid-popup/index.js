/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';
import { postGridPopup as icon } from './icons';

/**
 * Register block
 */
registerBlockType(metadata.name, {
    ...metadata,
    title: __('Murdeni Post Grid Popup', 'murdeni-blocks'),
    description: __('Display posts or custom post types in a grid layout with popup details.', 'murdeni-blocks'),
    icon,
    edit: Edit,
    save: () => null, // Dynamic block, render callback on server
});
