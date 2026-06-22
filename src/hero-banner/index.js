/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import Edit from './edit';
import metadata from './block.json';
import { heroBanner as icon } from './icons';

/**
 * Register block
 */
registerBlockType(metadata.name, {
    ...metadata,
    title: __('Hero Banner', 'murdeni-blocks'),
    description: __('Display a hero banner with background image, title, subtitle, description, and buttons.', 'murdeni-blocks'),
    icon,
    edit: Edit,
    save: () => null, // Dynamic block, render callback on server
});
