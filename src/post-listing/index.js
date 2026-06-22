/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

/**
 * Register block
 */
registerBlockType(metadata.name, {
    ...metadata,
    title: __('Murdeni Post Listing', 'murdeni-blocks'),
    description: __('Display posts or custom post types in a list layout with image on the left and content on the right.', 'murdeni-blocks'),
    edit: Edit,
    save: () => null, // Server-side rendering
});
